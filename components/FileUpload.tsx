
import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs-dist worker
// Using a specific version in the workerSrc URL for stability, matching the import map version.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.mjs`;

interface FileUploadProps {
  onFileRead: (content: string) => void;
  label?: string; 
  buttonText?: string;
  compact?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileRead, 
  label = "Upload Resume (.txt or .pdf)", // Updated default label
  buttonText = "Upload a file", 
  compact = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      setFileName(null);
      setIsParsing(true);

      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          onFileRead(text);
          setFileName(file.name);
          setIsParsing(false);
        };
        reader.onerror = () => {
          setError('Failed to read .txt file.');
          if (fileInputRef.current) fileInputRef.current.value = '';
          setIsParsing(false);
        }
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            if (!arrayBuffer) {
                throw new Error("Could not read file data.");
            }
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              // Ensure item.str is defined before joining
              fullText += textContent.items.map(item => (item as any).str || '').join(' ') + '\n';
            }
            onFileRead(fullText.trim());
            setFileName(file.name);
          } catch (pdfError) {
            console.error('Error parsing PDF:', pdfError);
            setError('Failed to parse PDF. Ensure it is a valid PDF file.');
            if (fileInputRef.current) fileInputRef.current.value = '';
          } finally {
            setIsParsing(false);
          }
        };
        reader.onerror = () => {
          setError('Failed to read PDF file.');
          if (fileInputRef.current) fileInputRef.current.value = '';
          setIsParsing(false);
        }
        reader.readAsArrayBuffer(file);
      } else {
        setError('Invalid file type. Please upload a .txt or .pdf file.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsParsing(false);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {label && (
          <label htmlFor="file-upload-input" className={`block text-sm font-medium text-secondary-700 ${compact ? 'mb-0.5' : 'mb-1'}`}>
          {label}
        </label>
      )}
      <div 
        className={`mt-1 flex justify-center border-2 border-secondary-300 border-dashed rounded-md hover:border-primary-400 transition-colors ${compact ? 'px-4 py-3' : 'px-6 pt-5 pb-6'}`}
      >
        <div className="space-y-1 text-center">
          <UploadIcon className={`mx-auto text-secondary-400 ${compact ? 'h-8 w-8' : 'h-12 w-12'}`} />
          <div className={`flex text-sm text-secondary-600 ${compact ? 'justify-center' : ''}`}>
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={isParsing}
              className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 disabled:opacity-70 disabled:cursor-wait"
            >
              <span>{buttonText}</span>
              <input
                id="file-upload-input" 
                name="file-upload-input"
                type="file"
                accept=".txt,.pdf" // Updated accept attribute
                className="sr-only"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isParsing}
              />
            </button>
            {!compact && <p className="pl-1">or drag and drop</p> }
          </div>
          {!compact && <p className="text-xs text-secondary-500">TXT or PDF files up to 5MB</p>} {/* Updated file type description */}
          {isParsing && <p className={`text-sm text-primary-600 ${compact ? 'mt-1 text-xs' : 'mt-2'}`}>Processing file...</p>}
          {fileName && !isParsing && <p className={`text-sm text-green-600 ${compact ? 'mt-1 text-xs' : 'mt-2'}`}>Uploaded: {fileName}</p>}
          {error && !isParsing && <p className={`text-sm text-red-600 ${compact ? 'mt-1 text-xs' : 'mt-2'}`}>{error}</p>}
        </div>
      </div>
    </div>
  );
};