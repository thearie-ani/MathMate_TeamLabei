## ភពឆ្លាតវៃ (Phub Chlart Vey)
 ភពឆ្លាតវៃ (Phub Chlart Vey) is a chatbot 
that uses the RAG concept to answer 
questions about the 8 planets in our 
solar system. It provides accurate and 
reliable answers to satisfy your 
curiosity about the planets.

## Table of contents
```
- Project File structure
- Technologies use
- Installation
- How to run
- Example question
- Dataset source

```

## Project file structure

```
Python_Project/
├── faiss-vector-store/         ← vector database (auto created)
│   ├── index.faiss
│   └── chunks.json
├── planet_dataset/             ← planet txt files
│   ├── mercury.txt
│   ├── venus.txt
│   ├── earth.txt
│   ├── mars.txt
│   ├── jupiter.txt
│   ├── saturn.txt
│   ├── uranus.txt
│   └── neptune.txt
├── src/                        ← source code
│   ├── __init__.py             ← package identifier
│   ├── ingestion.py            ← load, chunk, embed, store
│   ├── retreival.py            ← search vector database
│   ├── query.py                ← generate answer with Gemini
│   ├── telegram_bot.py         ← Telegram bot interface
│   └── compare_embedding.py    ← test embedding similarity
├── .env                        ← API keys (hidden from GitHub)
├── .gitignore                  ← files to ignore in GitHub
├── README.md                   ← project documentation
└── requirements.txt            ← dependencies
```
## Technologies use

- **FAISS** - Vector database for storing and searching embeddings
- **sentence-transformers** - Convert text to vectors (all-MiniLM-L6-v2)
- **Google Gemini** - Generate natural language answers
- **LangChain** - Document loading and text splitting
- **pyTelegramBotAPI** - Telegram bot interface
- **python-dotenv** - Environment variable management

## Installation 
1. Clone the repository
```bash
git clone https://github.com/PV0509/Python-Final-project-Group06.git
``` 
2. Install dependencies 
```bash
pip install -r requirements.txt
``` 
3. Create .env file:
```
GOOGLE_API_KEY=your_gemini_key_here
TELEGRAM_TOKEN=your_telegram_token_here
```
4. Get API keys:
- Gemini API: aistudio.google.com
- Telegram Token: t.me/BotFather

## How to Run

Step 1 - Create vector database (run once only):
```bash
python src/ingestion.py
```

Step 2 - Run console chatbot: If you want to test console base
```bash
python src/query.py
```

Step 3 - Run Telegram bot: If you want to test telegrambot case
```bash
python src/telegram_bot.py
```
## Example Questions
- What is the temperature on Mars?
- How many moons does Jupiter have?
- Which planet is the hottest?
- Does Mercury have water?
- Compare Earth and Mars temperature
- Why is Mercury named like that?

## Dataset Source
- NASA: science.nasa.gov/solar-system/planets
- NASA Fact Sheet: nssdc.gsfc.nasa.gov/planetary/factsheet
