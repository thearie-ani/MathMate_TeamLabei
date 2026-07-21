# telegram_bot.py
import os
import json
import re
import requests
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, MessageHandler, CommandHandler, CallbackQueryHandler, ContextTypes, filters
from telegram.constants import ParseMode

load_dotenv()
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

CHAT_URL = "http://localhost:8000/chat"
CHAT_IMAGE_URL = "http://localhost:8000/chat/image"

SUBJECTS_FILE = "user_subjects.json"

SUBJECT_LABELS = {
    "1": "Calculus",
    "2": "Statistics",
    "3": "Algebra1",
    "4": "Calculus2"
}


def load_subjects():
    if os.path.isfile(SUBJECTS_FILE):
        with open(SUBJECTS_FILE, "r") as f:
            return json.load(f)
    return {}


def save_subjects(data):
    with open(SUBJECTS_FILE, "w") as f:
        json.dump(data, f)


def clean_for_telegram(text):
    """Convert LaTeX/markdown into Telegram-renderable plain text."""

    # \frac{a}{b} -> (a)/(b)
    text = re.sub(r'\\frac\{(.*?)\}\{(.*?)\}', r'(\1)/(\2)', text)

    # \boxed{x} -> bold final answer
    text = re.sub(r'\\boxed\{(.*?)\}', r'*Answer: \1*', text)

    # \sqrt{x} -> sqrt(x)
    text = re.sub(r'\\sqrt\{(.*?)\}', r'sqrt(\1)', text)

    # \lim{x -> a} or \lim_{x \to a} -> lim(x -> a)
    text = re.sub(r'\\lim[_{]*\{?(.*?)\}?\s', r'lim(\1) ', text)

    # x^{n} or x^n -> x^n (drop braces)
    text = re.sub(r'\^\{(.*?)\}', r'^\1', text)

    # \left( \right) -> plain parentheses
    text = text.replace(r'\left', '').replace(r'\right', '')

    # common named symbols -> readable text/ASCII
    symbol_map = {
        r'\varepsilon': 'epsilon', r'\epsilon': 'epsilon',
        r'\delta': 'delta', r'\Delta': 'Delta',
        r'\neq': '!=', r'\leq': '<=', r'\geq': '>=',
        r'\to': '->', r'\rightarrow': '->',
        r'\cdot': '*', r'\times': 'x',
        r'\infty': 'infinity', r'\pm': '+/-',
        r'\alpha': 'alpha', r'\beta': 'beta', r'\theta': 'theta',
        r'\pi': 'pi', r'\sum': 'sum', r'\int': 'integral',
    }
    for latex, plain in symbol_map.items():
        text = text.replace(latex, plain)

    # remove $$ ... $$ and $ ... $ wrappers, keep content
    text = re.sub(r'\$\$(.*?)\$\$', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'\$(.*?)\$', r'\1', text)

    # ## Headers -> bold line
    text = re.sub(r'^#{1,6}\s*(.+)$', r'*\1*', text, flags=re.MULTILINE)

    # **bold** -> *bold* (Telegram legacy Markdown)
    text = re.sub(r'\*\*(.*?)\*\*', r'*\1*', text)

    # catch-all: any remaining \command{...} -> just the inner content
    text = re.sub(r'\\[a-zA-Z]+\{(.*?)\}', r'\1', text)

    # catch-all: any remaining bare \command (no braces) -> strip the backslash
    text = re.sub(r'\\([a-zA-Z]+)', r'\1', text)

    # leftover stray braces
    text = text.replace('{', '').replace('}', '')

    return text.strip()


user_subjects = load_subjects()


def subject_keyboard():
    buttons = [
        [InlineKeyboardButton(label, callback_data=key)]
        for key, label in SUBJECT_LABELS.items()
    ]
    return InlineKeyboardMarkup(buttons)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Hi! I'm MathMate. Pick a subject to get started:",
        reply_markup=subject_keyboard()
    )


async def subject_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Pick a subject:", reply_markup=subject_keyboard())


async def subject_button(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    choice = query.data
    user_id = str(query.from_user.id)
    user_subjects[user_id] = choice
    save_subjects(user_subjects)

    await query.edit_message_text(f"Subject set to {SUBJECT_LABELS[choice]}. Now send me a question!")


async def safe_reply(update: Update, raw_answer: str):
    """Try Markdown rendering; fall back to plain text if Telegram rejects the formatting."""
    cleaned = clean_for_telegram(raw_answer)
    try:
        await update.message.reply_text(cleaned, parse_mode=ParseMode.MARKDOWN)
    except Exception:
        await update.message.reply_text(cleaned)  # fallback with no formatting


async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = str(update.effective_user.id)
    subject_choice = user_subjects.get(user_id)

    if not subject_choice:
        await update.message.reply_text("Please pick a subject first:", reply_markup=subject_keyboard())
        return

    resp = requests.post(CHAT_URL, json={
        "question": update.message.text,
        "subject_choice": subject_choice
    })

    if resp.status_code != 200:
        await update.message.reply_text("Something went wrong, try again.")
        return

    data = resp.json()
    await safe_reply(update, data["answer"])


async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    photo_file = await update.message.photo[-1].get_file()
    image_bytes = await photo_file.download_as_bytearray()

    files = {"file": ("quiz.jpg", bytes(image_bytes), "image/jpeg")}
    resp = requests.post(CHAT_IMAGE_URL, files=files)

    if resp.status_code != 200:
        await update.message.reply_text("Couldn't read that image, try again.")
        return

    data = resp.json()
    await safe_reply(update, data["answer"])


app = ApplicationBuilder().token(TOKEN).build()
app.add_handler(CommandHandler("start", start))
app.add_handler(CommandHandler("subject", subject_command))
app.add_handler(CallbackQueryHandler(subject_button))
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))
app.add_handler(MessageHandler(filters.PHOTO, handle_photo))

if __name__ == "__main__":
    print("Bot is running...")
    app.run_polling()