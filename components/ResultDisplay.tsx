
import React from 'react';
import type { CRSResponse } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
// Consider adding specific icons for analysis categories if desired, e.g., BriefcaseIcon, LightBulbIcon, TrendingUpIcon for achievements
// For now, reusing InformationCircleIcon or CheckCircleIcon for achievements.

interface ResultDisplayProps {
  result: CRSResponse;
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const percentage = Math.max(0, Math.min(100, score));
  const circumference = 2 * Math.PI * 50; // Assuming radius of 50
  const offset = circumference - (percentage / 100) * circumference;

  let scoreColor = 'text-red-500'; // Default to red
  if (percentage >= 75) { // Good > 75
    scoreColor = 'text-green-500';
  } else if (percentage >= 50) { // Okay 50-74
    scoreColor = 'text-yellow-500';
  }


  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-secondary-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="50"
          cx="60"
          cy="60"
        />
        <circle
          className={scoreColor}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="50"
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-4xl font-bold ${scoreColor}`}>
        {percentage}
      </div>
    </div>
  );
};

interface DetailItemProps {
  title: string;
  content?: string;
  listContent?: string[];
  icon?: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ title, content, listContent, icon }) => {
  if ((!content || content.trim() === "") && (!listContent || listContent.length === 0)) return null;
  
  const defaultIcon = <InformationCircleIcon className="h-5 w-5 mr-2 text-primary-500 flex-shrink-0" />;

  return (
    <div>
      <h4 className="text-md font-semibold text-secondary-700 flex items-center mb-1">
        {icon ? <span className="mr-2 flex-shrink-0">{icon}</span> : defaultIcon}
        {title}
      </h4>
      {content && <p className="text-secondary-600 bg-secondary-50 p-3 rounded-md text-sm">{content}</p>}
      {listContent && listContent.length > 0 && (
        <ul className="list-none space-y-2 pl-0 mt-2">
          {listContent.map((item, index) => (
            <li key={index} className="flex items-start p-2 bg-secondary-50 rounded-md text-sm">
              <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-secondary-700">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const analysisDetails = [];
  if (result.detailedAnalysis) {
    if (result.detailedAnalysis.keywordMatch && result.detailedAnalysis.keywordMatch.trim() !== "") {
      analysisDetails.push({ title: "Keyword & Skill Analysis", content: result.detailedAnalysis.keywordMatch });
    }
    if (result.detailedAnalysis.experienceRelevance && result.detailedAnalysis.experienceRelevance.trim() !== "") {
      analysisDetails.push({ title: "Experience Context & Impact", content: result.detailedAnalysis.experienceRelevance });
    }
    // New: Add Quantifiable Achievements
    if (result.detailedAnalysis.quantifiableAchievements && result.detailedAnalysis.quantifiableAchievements.length > 0) {
      analysisDetails.push({ 
        title: "Highlighted Quantifiable Achievements", 
        listContent: result.detailedAnalysis.quantifiableAchievements,
        icon: <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" /> // Specific icon for achievements
      });
    }
    if (result.detailedAnalysis.skillAdjacency && result.detailedAnalysis.skillAdjacency.trim() !== "") {
      analysisDetails.push({ title: "Skill Adjacency & Potential", content: result.detailedAnalysis.skillAdjacency });
    }
    if (result.detailedAnalysis.potentialAlignment && result.detailedAnalysis.potentialAlignment.trim() !== "") {
      analysisDetails.push({ title: "Potential Professional Attributes", content: result.detailedAnalysis.potentialAlignment });
    }
  }


  return (
    <section aria-labelledby="result-section" className="mt-8 p-6 bg-white shadow-xl rounded-xl">
      <h2 id="result-section" className="text-2xl font-semibold text-primary-700 mb-6 text-center">
        Relevance Score & Analysis
      </h2>
      
      <div className="mb-8">
        <ScoreCircle score={result.score} />
        <p className="text-center text-secondary-600 mt-2 text-lg">Contextual Relevance Score</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-secondary-800 flex items-center mb-2">
            <InformationCircleIcon className="h-6 w-6 mr-2 text-primary-600" />
            Explanation Summary
          </h3>
          <p className="text-secondary-600 bg-primary-50 p-4 rounded-md">{result.explanation}</p>
        </div>

        {analysisDetails.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-secondary-800 mb-3 mt-6">
              Detailed Analysis Breakdown
            </h3>
            <div className="space-y-4">
              {analysisDetails.map(detail => (
                <DetailItem 
                  key={detail.title} 
                  title={detail.title} 
                  content={detail.content}
                  listContent={detail.listContent}
                  icon={detail.icon}
                />
              ))}
            </div>
          </div>
        )}

        {result.strengths && result.strengths.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-secondary-800 flex items-center mb-2">
              <CheckCircleIcon className="h-6 w-6 mr-2 text-green-500" />
              Key Strengths
            </h3>
            <ul className="list-none space-y-2 pl-0">
              {result.strengths.map((strength, index) => (
                <li key={index} className="flex items-start p-3 bg-green-50 rounded-md">
                  <CheckCircleIcon className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-secondary-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.weaknesses && result.weaknesses.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-secondary-800 flex items-center mb-2">
              <XCircleIcon className="h-6 w-6 mr-2 text-red-500" />
              Areas for Improvement
            </h3>
            <ul className="list-none space-y-2 pl-0">
              {result.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start p-3 bg-red-50 rounded-md">
                  <XCircleIcon className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-1" />
                  <span className="text-secondary-700">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};