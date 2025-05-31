
import React from 'react';

interface TextAreaInputProps {
  id: string;
  label?: string; // Made label optional
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-secondary-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        name={id}
        rows={rows}
        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-secondary-300 rounded-md p-3 placeholder-secondary-400 bg-white transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
