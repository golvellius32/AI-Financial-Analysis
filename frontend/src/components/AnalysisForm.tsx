import React, { useState } from 'react';
import { analyzeStock } from '../services/api';

export const AnalysisForm: React.FC<{
  onAnalysis: (result: string) => void;
}> = ({ onAnalysis }) => {
  const [ticker, setTicker] = useState('');
  const [year, setYear] = useState('');
  const [period, setPeriod] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await analyzeStock({ ticker, year, period, useOllama: false });
      onAnalysis((response.data as { data: string }).data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="ticker">Ticker:</label>
        <input
          type="text"
          id="ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="year">Year:</label>
        <input
          type="text"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="period">Period:</label>
        <input
          type="text"
          id="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  );
};