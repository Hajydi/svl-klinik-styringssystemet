
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "Indlæser SVL Coaching..." }: LoadingSpinnerProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
        <p className="text-lg font-medium text-white">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
