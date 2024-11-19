# backend/services/main.py
import json
import os
import argparse
from dotenv import load_dotenv
from pathlib import Path
from services import openai, simfin  # Change to absolute import
from services.ollama import ollama  # Import ollama function

dotenv_path = Path("../.env")
load_dotenv(dotenv_path=dotenv_path)
SIMFIN_API_KEY = os.environ["SIMFIN_API_KEY"]
openai_token = os.environ.get("OPENAI_API_KEY")
ollama_url = os.environ.get("OLLAMA_URL", "http://localhost:11434")

def get_system_prompt():
    return """
    You are an AI Financial Analyst. Given company financials, you are asked to summarize the finances, 
    give pros and cons, and make a recommendation. Make sure you include the company name and year of the search. 
    You will explain the complex finances so that a beginner without any financial knowledge can understand. 
    You will always warn the user that they need to do their own research, and that you are a guide to get started.
    """

def get_financial_data_analysis(ticker: str, year: str, period: str, use_ollama: bool):
    try:
        print(f"Analyzing {ticker} for {year} {period}")
        dats_wrangler = simfin.SimFin(SIMFIN_API_KEY)
        content = dats_wrangler.get_financial_info_text(ticker, year, period)
        print(f"Got some data for {ticker} for {year} {period}")
        messages = [
            {"role": "system", "content": get_system_prompt()},
            {"role": "user", "content": content},
        ]

        if use_ollama:
            print("Using Ollama")
            client = ollama()
            model = "llama3:8b"
        else:
            print("Using OpenAI")
            client = openai.OpenAI(api_key=openai_token)
            model = "gpt-4o-mini"
        temperature = 0
        if hasattr(client, 'chat') and callable(getattr(client, 'chat')):
            response = client.chat(messages=messages, model=model, temperature=temperature)
        else:
            raise AttributeError("The client object does not have a callable 'chat' method.")
         # Return the chat content instead of the raw response
        if isinstance(response, str):
            return response
        elif isinstance(response, dict):
            # Handle different response formats
            if 'content' in response:
                return response['content']
            elif 'choices' in response and len(response['choices']) > 0:
                return response['choices'][0]['message']['content']
        
        raise ValueError(f"Unexpected response format: {response}")   
       
    except Exception as e:
        import logging
        logging.basicConfig(level=logging.ERROR)
        logging.error(f"Error in analysis for ticker {ticker}, year {year}, period {period}: {str(e)}")
        raise
    except Exception as e:
        print(f"Error in analysis: {str(e)}")
        raise
