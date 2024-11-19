// frontend/src/types/index.ts
export interface AnalysisRequest {
    ticker: string;
    year: string;
    period: string;
    useOllama: boolean;
  }
  
  export interface AnalysisResponse {
    success: boolean;
    data?: string;
    error?: string;
  }