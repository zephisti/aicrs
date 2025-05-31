
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon'; // Re-using for logo-like element

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-full shadow-lg mb-4">
        <SparklesIcon className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-primary-700 sm:text-5xl">
        Contextual Relevance Score <span className="block sm:inline text-primary-500">(CRS)</span> Generator
      </h1>
      <p className="mt-4 text-lg text-secondary-600 max-w-2xl mx-auto">
        Upload a resume and job description to get an AI-powered relevance score and analysis.
      </p>
    </header>
  );
};
