import axios from 'axios';

interface AnalysisRequest {
  ticker: string;
  year: string;
  period: string;
  useOllama: boolean;
}

export const analyzeStock = async (data: AnalysisRequest) => {
  return axios.post('http://localhost:5000/api/analyze', data);
};