import warnings
warnings.filterwarnings("ignore")

import os
import telebot
from dotenv import load_dotenv
from retreival import retrieve
from query import generate_answer
load_dotenv()

#Connected to the telegram API key
bot = telebot.TeleBot(os.getenv("TELEGRAM_TOKEN"))

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    bot.reply_to(message, 
    "Welcome to Phub Chlart Vey!\nYou can ask me anything about the 8 planets!")

@bot.message_handler(func=lambda message: True)
def handle_message(message):
    question = message.text
    
    # Retrieve chunks
    chunks = retrieve(question)
    
    if not chunks:
        bot.reply_to(message, 
        "I only know about the 8 planets!")
    else:
        # Generate answer
        answer = generate_answer(question, chunks)
        bot.reply_to(message, answer)



print(" Phub Chlart Vey is running...")
bot.infinity_polling()
