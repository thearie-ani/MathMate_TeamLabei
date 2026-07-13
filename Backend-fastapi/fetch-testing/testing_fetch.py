import requests
from bs4 import BeautifulSoup
import time
import os
import re

def clean_text(text):
    text = re.sub(r'(.{10,}?)\s*\1', r'\1', text)
    text = re.sub(r'(Section \d+\.\d+ Exercises)', r'\n\n\1\n', text)
    text = re.sub(r'(Chapter \d+)', r'\n\n\1\n', text)
    text = re.sub(r'(Example \d+\.\d+)', r'\n\n\1\n', text)
    text = re.sub(r'(Checkpoint \d+\.\d+)', r'\n\nCheckpoint \1\n', text)
    text = re.sub(r'(Definition)', r'\n\nDefinition\n', text)
    text = re.sub(r'(Solution)', r'\nSolution\n', text)
    text = re.sub(r'(\d+ \.)', r'\n\1', text)
    text = re.sub(r' {2,}', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

subjects = {
    "calculus1": "https://openstax.org/books/calculus-volume-1/pages/1-introduction",
    "statistic": "https://openstax.org/books/introductory-statistics-2e/pages/1-introduction",
    "algebra1": "https://openstax.org/books/algebra-1/pages/1-unit-1-overview",
    "calculus2": "https://openstax.org/books/calculus-volume-2/pages/1-introduction"
}

for subject, start_url in subjects.items():
    print(f"\n===== Starting: {subject} =====")
    os.makedirs(f"data/{subject}", exist_ok=True)

    current_url = start_url
    visited = []

    # Extract base book path from start_url for building relative links
    base_url = "/".join(start_url.split("/")[:-1]) + "/"

    while current_url:
        print("Fetching:", current_url)
        try:
            response = requests.get(current_url, timeout=10)
            response.encoding = 'utf-8'
            soup = BeautifulSoup(response.text, 'html.parser')

            main = soup.find('main') or soup.find('div', class_='os-text')
            raw_text = main.get_text(separator=' ', strip=True) if main else ""
            clean = clean_text(raw_text)

            filename = current_url.split("/")[-1] + ".txt"
            with open(f"data/{subject}/{filename}", "w", encoding="utf-8") as f:
                f.write(clean)

            visited.append(current_url)

        except Exception as e:
            print(f"Error fetching {current_url}: {e}")
            break

        # Find Next link
        next_link = None
        for link in soup.find_all('a'):
            if link.get_text(strip=True).lower() == 'next':
                next_link = link
                break

        if next_link and next_link.get('href'):
            href = next_link['href']
            if href.startswith('http'):
                current_url = href
            else:
                current_url = base_url + href.lstrip('/')
        else:
            print(f"No 'Next' link found — done with {subject}.")
            current_url = None

        time.sleep(1)

    print(f"✓ {subject}: {len(visited)} pages saved to data/{subject}/")

print("\n===== All subjects done! =====")