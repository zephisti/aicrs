
import React from 'react';
import type { FeedbackRating } from '../types';
import { ThumbUpIcon } from './icons/ThumbUpIcon';
import { ThumbDownIcon } from './icons/ThumbDownIcon';
import { ChatBubbleLeftEllipsisIcon } from './icons/ChatBubbleLeftEllipsisIcon';
import { TextAreaInput } from './TextAreaInput';
import { LoadingSpinner } from './LoadingSpinner';

interface FeedbackFormProps {
  rating: FeedbackRating;
  reason: string;
  onRatingChange: (rating: FeedbackRating) => void;
  onReasonChange: (reason: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean; 
}

const ratingOptions: { value: Exclude<FeedbackRating, null>; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { value: 'Strong Match', label: 'Strong Match', icon: ThumbUpIcon },
  { value: 'Potential Match', label: 'Potential Match', icon: ChatBubbleLeftEllipsisIcon },
  { value: 'Not a Fit', label: 'Not a Fit', icon: ThumbDownIcon },
];

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  rating,
  reason,
  onRatingChange,
  onReasonChange,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <div className="mt-8 p-6 bg-white shadow-xl rounded-xl">
      <h3 className="text-xl font-semibold text-primary-700 mb-4 text-center">Rate this CRS Analysis</h3>
      
      <div className="mb-6">
        <p className="block text-sm font-medium text-secondary-700 mb-2 text-center">How accurate was this analysis?</p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
          {ratingOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onRatingChange(option.value)}
              className={`w-full sm:w-auto flex-1 sm:flex-none sm:min-w-[150px] flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${rating === option.value
                  ? 'bg-primary-600 text-white border-primary-600 ring-primary-500 shadow-md'
                  : 'bg-white text-secondary-700 border-secondary-300 hover:bg-secondary-50 hover:border-primary-300 focus:ring-primary-400'
                }`}
              aria-pressed={rating === option.value}
            >
              <option.icon className={`h-5 w-5 mr-2 ${rating === option.value ? 'text-white' : 'text-primary-500'}`} />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <TextAreaInput
        id="feedback-reason"
        label="Additional Comments (Optional)"
        value={reason}
        onChange={onReasonChange}
        placeholder="e.g., Missed key skill X, overestimated experience in Y, good potential but lacks Z..."
        rows={4}
      />

      <div className="mt-6 text-center">
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !rating}
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out flex items-center justify-center mx-auto"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner className="h-5 w-5 mr-2" />
              Submitting...
            </>
          ) : (
            'Submit Feedback'
          )}
        </button>
      </div>
    </div>
  );
};
