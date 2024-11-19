// src/components/AnalysisResults.tsx
import React from 'react';

export const AnalysisResults: React.FC<{
  analysis: string;
}> = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <pre className="whitespace-pre-wrap">{analysis}</pre>
    </div>
  );
};