from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from services.main import get_financial_data_analysis  # Updated import

app = Flask(__name__)
CORS(app)

load_dotenv()

@app.route('/')
def home():
    return """
    <h1>AI Financial Analyst API</h1>
    <p>Available endpoints:</p>
    <ul>
        <li><code>POST /api/analyze</code></li>
    </ul>
    """

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    ticker = data.get('ticker')
    year = data.get('year')
    period = data.get('period')
    use_ollama = data.get('useOllama', False)
    
    try:
        analysis = get_financial_data_analysis(
            ticker,
            year,
            period,
            use_ollama
        )
        return jsonify({'success': True, 'data': analysis})
    except ValueError as ve:
        return jsonify({'success': False, 'error': 'Invalid input: ' + str(ve)}), 400
    except KeyError as ke:
        return jsonify({'success': False, 'error': 'Missing key: ' + str(ke)}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': 'An unexpected error occurred: ' + str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)