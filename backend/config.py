# backend/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SIMFIN_API_KEY = os.getenv('SIMFIN_API_KEY')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://localhost:11434')