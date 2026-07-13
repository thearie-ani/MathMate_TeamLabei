import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path
import re
import time
import os
from datetime import datetime

# ── Load env 
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI not found in .env file")

# ── Connect to MongoDB
client = MongoClient(MONGODB_URI)

try:
    client.admin.command("ping")
    print("✓ Connected to MongoDB Atlas")
except Exception as e:
    raise ConnectionError(f"MongoDB connection failed: {e}")

db = client["sala_ai"]
subjects_col = db["subjects"]
chapters_col  = db["chapters"]
lessons_col   = db["lessons"]

# Subjects config
SUBJECTS = {
    "calculus1": {
        "name": "Calculus Volume 1",
        "start_url": "https://openstax.org/books/calculus-volume-1/pages/1-introduction",
    },
   
    "statistic": {
        "name": "Introductory Statistics",
        "start_url": "https://openstax.org/books/introductory-statistics-2e/pages/1-introduction",
    },
    "algebra1": {
        "name": "Algebra 1",
        "start_url": "https://openstax.org/books/algebra-1/pages/1-unit-1-overview",
    },
    "calculus2": {
        "name": "Calculus Volume 2",
        "start_url": "https://openstax.org/books/calculus-volume-2/pages/1-introduction",
    },
}

# ── Helpers ───────────────────────────────────────────────────────────────────
def clean_main(main):
    for tag in main.find_all(["nav", "footer", "script", "style", "button"]):
        tag.decompose()

    for table in main.find_all("table"):
        rows = table.find_all("tr")
        lines = []
        for row in rows:
            cells = row.find_all(["td", "th"])
            lines.append(" | ".join(c.get_text(strip=True) for c in cells))
        table.replace_with("\n".join(lines))

    return main


def get_title(soup):
    for tag in ["h1", "h2"]:
        el = soup.find(tag)
        if el:
            return el.get_text(strip=True)
    return "Untitled"


def get_chapter_number(url):
    slug = url.split("/")[-1]
    match = re.match(r"(\d+)", slug)
    return int(match.group(1)) if match else 0


def get_next_url(soup, base_url):
    for link in soup.find_all("a"):
        if link.get_text(strip=True).lower() == "next":
            href = link.get("href", "")
            if href.startswith("http"):
                return href
            return base_url + href.lstrip("/")
    return None


def get_or_create_subject(slug, name):
    doc = subjects_col.find_one({"slug": slug})
    if doc:
        print(f"  Subject exists: {slug}")
        return doc["_id"]
    _id = subjects_col.insert_one({
        "name": name,
        "slug": slug,
        "created_at": datetime.now(),
    }).inserted_id
    print(f"  Created subject: {slug}")
    return _id


def get_or_create_chapter(subject_id, chapter_num):
    doc = chapters_col.find_one({
        "subject_id": subject_id,
        "chapter_number": chapter_num,
    })
    if doc:
        return doc["_id"]
    _id = chapters_col.insert_one({
        "subject_id": subject_id,
        "chapter_number": chapter_num,
        "title": f"Chapter {chapter_num}",
        "created_at": datetime.now(),
    }).inserted_id
    print(f"  Created chapter {chapter_num}")
    return _id


def fetch_page(url):
    response = requests.get(url, timeout=10)
    response.encoding = "utf-8"
    return BeautifulSoup(response.text, "html.parser")


def store_lesson(subject_id, chapter_id, section_slug, title, content_html, url, order_index):
    if lessons_col.find_one({"url": url}):
        print(f"  Skip (exists): {section_slug}")
        return False
    lessons_col.insert_one({
        "subject_id":   subject_id,
        "chapter_id":   chapter_id,
        "section_slug": section_slug,
        "title":        title,
        "content_html": content_html,
        "url":          url,
        "order_index":  order_index,
        "created_at":   datetime.now(),
    })
    print(f"  Stored [{order_index}]: {title}")
    return True


# ── Main crawl 
for slug, data in SUBJECTS.items():
    print(f"\n{'='*50}")
    print(f"  {data['name']}")
    print(f"{'='*50}")

    subject_id = get_or_create_subject(slug, data["name"])

    current_url         = data["start_url"]
    base_url            = "/".join(current_url.split("/")[:-1]) + "/"
    visited             = []
    order_index         = 0
    current_chapter_num = None
    chapter_id          = None

    while current_url:
        try:
            soup         = fetch_page(current_url)
            main         = soup.find("main") or soup.find("div", class_="os-text")
            content_html = str(clean_main(main)) if main else ""
            title        = get_title(soup)
            section_slug = current_url.split("/")[-1]
            chapter_num  = get_chapter_number(current_url)

            if chapter_num != current_chapter_num:
                current_chapter_num = chapter_num
                chapter_id = get_or_create_chapter(subject_id, chapter_num)

            store_lesson(
                subject_id, chapter_id,
                section_slug, title,
                content_html, current_url,
                order_index
            )

            visited.append(current_url)
            order_index += 1

        except Exception as e:
            print(f"  Error on {current_url}: {e}")
            break

        next_url = get_next_url(soup, base_url)
        if not next_url:
            print(f"  No next link — done with {slug}")
            break

        current_url = next_url
        time.sleep(1)

    print(f"\n✓ {slug}: {len(visited)} pages stored")

print("\n===== All done! =====")
client.close()