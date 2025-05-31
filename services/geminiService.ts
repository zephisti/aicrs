
import type { CRSResponse } from '../types';

export const generateCRS = async (
  resumeText: string, 
  jobDescriptionText: string,
  mustHaveKeywords: string,
  niceToHaveKeywords: string
): Promise<CRSResponse> => {
  
  const requestBody = {
    resumeText,
    jobDescriptionText,
    mustHaveKeywords,
    niceToHaveKeywords,
  };

  try {
    const response = await fetch('/api/geminiProxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `API request failed with status ${response.status}` }));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const result: CRSResponse = await response.json();
    
    // Basic validation of the response structure, more detailed validation happens server-side
    if (typeof result.score !== 'number' || 
        typeof result.explanation !== 'string' ||
        !Array.isArray(result.strengths) ||
        !Array.isArray(result.weaknesses)) {
          throw new Error('Invalid CRSResponse structure received from proxy.');
        }
    return result;

  } catch (error) {
    console.error('Error calling CRS proxy API:', error);
    if (error instanceof Error) {
        throw new Error(`CRS Service Error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while communicating with the CRS service.');
  }
};
