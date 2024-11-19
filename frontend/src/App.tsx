// frontend/src/App.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface AnalysisData {
  success: boolean;
  data?: string;
  error?: string;
}

function App() {
  const [ticker, setTicker] = useState('');
  const [year, setYear] = useState('');
  const [period, setPeriod] = useState('');
  const [useOllama, setUseOllama] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post<AnalysisData>('http://localhost:5000/api/analyze', {
        ticker,
        year,
        period,
        useOllama
      });
      setAnalysis(response.data.data || '');
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysis('Error performing analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-8">AI Financial Analyst</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ticker</label>
                <input
                  type="text"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  placeholder="AAPL"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  placeholder="2024"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Period</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select period</option>
                  <option value="q1">Q1</option>
                  <option value="q2">Q2</option>
                  <option value="q3">Q3</option>
                  <option value="q4">Q4</option>
                  <option value="fy">Full Year</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={useOllama}
                  onChange={(e) => setUseOllama(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Use Ollama</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </form>

            {ticker && " " && analysis && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <pre className="whitespace-pre-wrap">{analysis}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;