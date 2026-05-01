import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Test Page</h1>
      <button 
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand-hover transition-colors"
      >
        Go back to Home
      </button>
    </div>
  );
};

export default TestPage;