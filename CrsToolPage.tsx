
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { TextAreaInput } from './components/TextAreaInput';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AlertIcon } from './components/icons/AlertIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { InformationCircleIcon } from './components/icons/InformationCircleIcon';
import { Header } from './components/Header';
import { FeedbackForm } from './components/FeedbackForm'; // New import
import { generateCRS } from './services/geminiService';
import type { CRSResponse, RecruiterFeedback, FeedbackRating } from './types'; // New imports

const CrsToolPage: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [mustHaveKeywords, setMustHaveKeywords] = useState<string>('');
  const [niceToHaveKeywords, setNiceToHaveKeywords] = useState<string>('');
  const [crsResult, setCrsResult] = useState<CRSResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState<FeedbackRating>(null);
  const [feedbackReason, setFeedbackReason] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  const resetFeedback = () => {
    setFeedbackRating(null);
    setFeedbackReason('');
    setFeedbackSubmitted(false);
  };

  const handleResumeUpload = (content: string) => {
    setResumeText(content);
    setError(null); 
    setCrsResult(null);
    resetFeedback();
  };

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value);
    setError(null);
    setCrsResult(null);
    resetFeedback();
  };

  const handleMustHaveKeywordsChange = (value: string) => {
    setMustHaveKeywords(value);
    setError(null);
    setCrsResult(null);
    resetFeedback();
  };

  const handleNiceToHaveKeywordsChange = (value: string) => {
    setNiceToHaveKeywords(value);
    setError(null);
    setCrsResult(null);
    resetFeedback();
  };

  const handleSubmit = useCallback(async () => {
    if (!resumeText) {
      setError('Please upload or provide resume text.');
      return;
    }
    if (!jobDescription) {
      setError('Please provide a job description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCrsResult(null);
    resetFeedback();

    try {
      const result = await generateCRS(resumeText, jobDescription, mustHaveKeywords, niceToHaveKeywords);
      setCrsResult(result);
    } catch (err) {
      console.error('Error generating CRS:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, [resumeText, jobDescription, mustHaveKeywords, niceToHaveKeywords]);

  const handleFeedbackSubmit = useCallback(() => {
    if (!crsResult || !feedbackRating) {
      setError("Please select a rating before submitting feedback.");
      return;
    }
    const feedbackData: RecruiterFeedback = {
      rating: feedbackRating,
      reason: feedbackReason,
    };
    console.log('Feedback Submitted:', {
      inputs: {
        resumeText,
        jobDescription,
        mustHaveKeywords,
        niceToHaveKeywords,
      },
      crsResult,
      feedback: feedbackData,
    });
    setFeedbackSubmitted(true);
    setError(null); 
    // In a real app, this would send data to a backend
  }, [crsResult, feedbackRating, feedbackReason, resumeText, jobDescription, mustHaveKeywords, niceToHaveKeywords]);

  const handleDownloadJson = useCallback(() => {
    if (!crsResult) return;

    const feedbackToSave: RecruiterFeedback | undefined = feedbackSubmitted ? { rating: feedbackRating, reason: feedbackReason } : undefined;

    const dataToDownload = {
      resumeText: resumeText,
      jobDescription: jobDescription,
      mustHaveKeywords: mustHaveKeywords,
      niceToHaveKeywords: niceToHaveKeywords,
      analysisResult: crsResult,
      recruiterFeedback: feedbackToSave,
    };

    const jsonString = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crs_analysis_data_v3.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [crsResult, resumeText, jobDescription, mustHaveKeywords, niceToHaveKeywords, feedbackSubmitted, feedbackRating, feedbackReason]);

  return (
    <div className="bg-gradient-to-br from-secondary-100 via-primary-50 to-secondary-100 text-secondary-800 p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
      <div className="max-w-3xl mx-auto">
        <Header />

        <main className="mt-10 space-y-8">
          <section aria-labelledby="input-section" className="p-6 bg-white shadow-xl rounded-xl">
            <h2 id="input-section" className="sr-only text-2xl font-semibold text-primary-700 mb-6">Input Details for CRS</h2>
            <div className="space-y-6">
              {/* FileUpload will use its updated defaults for label and accepted types */}
              <FileUpload 
                onFileRead={handleResumeUpload} 
              />
              <TextAreaInput
                id="job-description"
                label="Job Description"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                rows={10}
              />
              <div>
                <div className="flex items-center mb-1">
                    <label htmlFor="must-have-keywords" className="block text-sm font-medium text-secondary-700">
                        Must-Have Keywords/Skills
                    </label>
                    <div className="group relative ml-2">
                        <InformationCircleIcon className="h-4 w-4 text-secondary-400 hover:text-secondary-600 cursor-help" />
                        <span className="absolute bottom-full left-1/2 z-10 mb-2 w-60 -translate-x-1/2 transform rounded-md bg-secondary-800 p-2 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                            Comma-separated. Critical for a high score. Absence will significantly lower the score.
                        </span>
                    </div>
                </div>
                <TextAreaInput
                  id="must-have-keywords"
                  label="" 
                  placeholder="e.g., Python, Project Management, Agile"
                  value={mustHaveKeywords}
                  onChange={handleMustHaveKeywordsChange}
                  rows={3}
                />
              </div>
              <div>
                <div className="flex items-center mb-1">
                     <label htmlFor="nice-to-have-keywords" className="block text-sm font-medium text-secondary-700">
                        Nice-to-Have Keywords/Skills
                    </label>
                    <div className="group relative ml-2">
                        <InformationCircleIcon className="h-4 w-4 text-secondary-400 hover:text-secondary-600 cursor-help" />
                        <span className="absolute bottom-full left-1/2 z-10 mb-2 w-60 -translate-x-1/2 transform rounded-md bg-secondary-800 p-2 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                            Comma-separated. Will positively influence the score if present.
                        </span>
                    </div>
                </div>
                <TextAreaInput
                  id="nice-to-have-keywords"
                  label="" 
                  placeholder="e.g., Docker, AWS, Public Speaking"
                  value={niceToHaveKeywords}
                  onChange={handleNiceToHaveKeywordsChange}
                  rows={3}
                />
              </div>
            </div>
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-md flex items-start">
                <AlertIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            <div className="mt-8 text-center">
              <button
                onClick={handleSubmit}
                disabled={isLoading || !resumeText || !jobDescription} 
                className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out flex items-center justify-center mx-auto"
                aria-label="Generate Contextual Relevance Score"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner className="h-5 w-5 mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Generate CRS
                  </>
                )}
              </button>
            </div>
          </section>

          {crsResult && !isLoading && !error && (
            <>
              <ResultDisplay result={crsResult} />
              <div className="mt-8 text-center">
                <button
                  onClick={handleDownloadJson}
                  className="px-6 py-3 bg-secondary-600 text-white font-semibold rounded-lg shadow-md hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 transition-colors duration-150 ease-in-out flex items-center justify-center mx-auto"
                  aria-label="Download CRS result and inputs as JSON"
                >
                  <DownloadIcon className="h-5 w-5 mr-2" />
                  Download Result (JSON)
                </button>
              </div>
              {!feedbackSubmitted ? (
                <FeedbackForm
                  rating={feedbackRating}
                  reason={feedbackReason}
                  onRatingChange={setFeedbackRating}
                  onReasonChange={setFeedbackReason}
                  onSubmit={handleFeedbackSubmit}
                />
              ) : (
                <div className="mt-8 p-4 bg-green-50 border border-green-300 text-green-700 rounded-md text-center shadow-md">
                  <p className="font-semibold">Thank you for your feedback!</p>
                </div>
              )}
            </>
          )}
        </main>
        
        <footer className="mt-12 text-center text-sm text-secondary-500">
          <p>&copy; {new Date().getFullYear()} TalentFlow CRS. Powered by AI.</p>
        </footer>
      </div>
    </div>
  );
};

export default CrsToolPage;