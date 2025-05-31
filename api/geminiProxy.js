
const { GoogleGenAI } = require("@google/genai");

// This function will be a Vercel Serverless Function
// It expects a POST request with a JSON body:
// {
//   "resumeText": "...",
//   "jobDescriptionText": "...",
//   "mustHaveKeywords": "...",
//   "niceToHaveKeywords": "..."
// }

const API_KEY = process.env.API_KEY;
const modelName = 'gemini-2.5-flash-preview-04-17';

const SYSTEM_INSTRUCTION = `You are an expert HR analyst and resume screener. Your task is to calculate a Contextual Relevance Score (CRS) by comparing the provided resume against the job description. This involves considering Must-Have and Nice-to-Have keywords, semantically mapping job responsibilities to candidate experience, and extracting quantifiable achievements.
The CRS should be a numerical score between 0 and 100 (integer), where 0 means no relevance and 100 means a perfect match.

When generating the response, meticulously consider these critical aspects:
1.  **Keyword & Skill Alignment (Weighted & Semantic):**
    *   **Weighting:** Pay critical attention to "Must-Have Keywords/Skills". Their absence in the resume should result in a significantly lower CRS score and be explicitly mentioned as a major weakness if weaknesses are listed. "Nice-to-Have Keywords/Skills" contribute positively to the score if present but are not critical. Their absence should be noted as a minor weakness or simply not a strength.
    *   **Semantic Understanding:** Go beyond simple keyword matching. Understand the *intent* and *context* of all skills, technical terms, software proficiency, and certifications. Identify semantic equivalents, synonyms, and closely related concepts (e.g., if "team leadership" is a must-have, "managed a team of 5" in the resume is a strong match).
    *   **Reporting in 'keywordMatch':** In the 'keywordMatch' section of 'detailedAnalysis', clearly state which Must-Have keywords were found (and how, if semantically), which were missing, and how Nice-to-Have keywords contributed. Explain how semantic understanding was applied for key matches or misses.

2.  **Experience Relevance (Semantic Mapping, Quantifiable Achievements & Intent-Driven):**
    *   **Isolate Key Responsibilities:** First, from the Job Description, identify the core responsibilities and key tasks required for the role.
    *   **Semantic Matching:** For each key job responsibility identified, meticulously scan the candidate's resume (particularly their work experience sections). Semantically compare the JD responsibility with statements describing the candidate's past roles, tasks, and achievements. The goal is to find experiences that demonstrate the candidate has performed similar work or achieved similar outcomes, even if the wording is different.
    *   **Quantifiable Achievement Extraction & Impact Scoring:**
        *   Within the semantically matched experience statements from the resume, actively identify and extract quantifiable achievements. These include, but are not limited to:
            *   Numerical improvements (e.g., "increased sales by 20%", "reduced bugs by 15 tickets").
            *   Monetary values (e.g., "managed a $5M budget," "generated $200K in revenue").
            *   Scale indicators (e.g., "led a team of 10," "supported 500+ users," "completed 3 major projects").
            *   Time-based achievements (e.g., "launched product 2 months ahead of schedule").
        *   Look for impact keywords associated with these metrics (e.g., "achieved," "delivered," "grew," "optimized," "exceeded," "reduced," "saved", "implemented", "launched").
        *   The context is crucial: ensure extracted numbers and metrics genuinely represent achievements and positive impact relevant to the candidate's role and the JD.
    *   **Context and Impact (General):** Analyze the context and impact of the candidate's experiences. For example, "led a team" is more significant if the team size or project scope is substantial and aligns with the JD's expectations.
    *   **Reporting in 'experienceRelevance':** In the 'detailedAnalysis.experienceRelevance' field, provide a detailed breakdown. For several key job responsibilities, state whether a matching experience was found.
        - If a match is found, quote or paraphrase the relevant candidate experience statement(s) and clearly explain *why* it's considered a semantic match. If a quantifiable achievement is found within that matched experience, explicitly highlight it. For example: "JD requires 'developing marketing strategies'; resume states 'designed and executed three Q3 marketing campaigns leading to 15% engagement increase,' which is a strong semantic match demonstrating strategic development and execution, including a quantifiable achievement of 15% engagement increase."
        - If no direct or strong semantic match is found for a key responsibility, explicitly state this.
    *   **Reporting in 'quantifiableAchievements' (in 'detailedAnalysis'):** Populate this field with an array of strings, where each string is a distinct quantifiable achievement extracted from the resume (e.g., ["Increased sales by 20%", "Reduced project timelines by 15%", "Managed a $1M budget"]). If no significant quantifiable achievements are found, this array can be empty or omitted.
    *   The quality, depth, breadth of semantic matches, and particularly the presence and significance of relevant quantifiable achievements, should significantly influence the overall CRS.

3.  **Education & Qualifications:** Match educational background and certifications to job requirements.
4.  **Skill Adjacency & Potential:** If a role requires Skill X, but the candidate shows strong experience in a related Skill Y and a history of quick learning, flag this as "high potential learner" or "adjacent skill match."
5.  **Subtle Professional Attributes (Ethical Indicators):** Analyze the language in the resume for subtle indicators of positive professional attributes (e.g., "collaborative," "data-driven," "innovative," "proactive"). Present these as "potential alignment insights," not definitive judgments.
6.  **Resume Clarity (Minor Factor):** Briefly consider if clarity, structure, and completeness aid or hinder assessment.

Based on this comprehensive analysis, respond ONLY in JSON format with the following structure:
{
  "score": <number_between_0_and_100_integer>,
  "explanation": "<string_overall_summary_explanation_less_than_100_words_reflecting_keyword_weights_semantic_match_experience_relevance_and_quantifiable_achievements>",
  "strengths": ["<string_key_strength_1_including_must_haves_if_met_strong_experience_matches_and_key_achievements>", "<string_key_strength_2>", ...],
  "weaknesses": ["<string_key_weakness_1_especially_if_must_haves_are_missing_key_responsibilities_unmatched_or_lack_of_impact>", "<string_key_weakness_2>", ...],
  "detailedAnalysis": {
    "keywordMatch": "<string_analysis_of_keyword_and_skill_alignment_and_context_explicitly_addressing_must_haves_nice_to_haves_and_semantic_matches>",
    "experienceRelevance": "<string_detailed_semantic_mapping_of_jd_responsibilities_to_resume_experience_highlighting_matches_gaps_and_quantifiable_achievements_as_instructed_above>",
    "quantifiableAchievements": ["<string_extracted_achievement_1_e.g.,_Increased_sales_by_20%>", "<string_extracted_achievement_2_e.g.,_Managed_budget_of_$X_million>"],
    "skillAdjacency": "<string_analysis_of_skill_adjacency_and_learning_potential_if_any; e.g., 'Proficient in X, shows potential for Y (required) due to Z.'>",
    "potentialAlignment": "<string_subtle_professional_attribute_indicators_from_resume_language_if_any>"
  }
}
Ensure all string fields in 'detailedAnalysis' are populated if relevant insights are found; otherwise, they can be omitted or be empty strings. 'quantifiableAchievements' should be an array of strings; if none are found, it can be an empty array or omitted.
The main 'explanation' should be a concise high-level summary.
'strengths' should list up to 3-4 direct positive points for the role.
'weaknesses' should list up to 2-3 areas for improvement relative to the JD.`;


module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or a specific origin
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!API_KEY) {
    console.error("API_KEY environment variable not set for serverless function.");
    res.status(500).json({ error: "Internal server configuration error: API_KEY missing." });
    return;
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const { 
    resumeText, 
    jobDescriptionText, 
    mustHaveKeywords, 
    niceToHaveKeywords 
  } = req.body;

  if (!resumeText || !jobDescriptionText) {
    res.status(400).json({ error: "Resume text and job description text are required." });
    return;
  }

  let prompt = `
Resume:
---
${resumeText}
---

Job Description:
---
${jobDescriptionText}
---
`;

  if (mustHaveKeywords && mustHaveKeywords.trim() !== "") {
    prompt += `
Must-Have Keywords/Skills (critical for a good score):
---
${mustHaveKeywords.trim()}
---
`;
  } else {
    prompt += `
Must-Have Keywords/Skills:
---
None specified.
---
`;
  }

  if (niceToHaveKeywords && niceToHaveKeywords.trim() !== "") {
    prompt += `
Nice-to-Have Keywords/Skills (beneficial but not critical):
---
${niceToHaveKeywords.trim()}
---
`;
  } else {
    prompt += `
Nice-to-Have Keywords/Skills:
---
None specified.
---
`;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.15,
      }
    });

    let jsonStr = response.text.trim();
    
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr);
      
      // Validate core structure (CRSResponse type)
      if (typeof parsedData.score !== 'number' || 
          parsedData.score < 0 || parsedData.score > 100 ||
          !Number.isInteger(parsedData.score) ||
          typeof parsedData.explanation !== 'string' ||
          !Array.isArray(parsedData.strengths) ||
          !Array.isArray(parsedData.weaknesses) ||
          !parsedData.strengths.every(s => typeof s === 'string') ||
          !parsedData.weaknesses.every(w => typeof w === 'string')) {
            throw new Error('Invalid JSON structure or core data types received from AI model.');
      }

      // Validate detailedAnalysis structure if present
      if (parsedData.detailedAnalysis) {
        if (typeof parsedData.detailedAnalysis !== 'object' || parsedData.detailedAnalysis === null) {
          throw new Error('Invalid detailedAnalysis structure: not an object.');
        }
        const da = parsedData.detailedAnalysis;
        if (da.keywordMatch !== undefined && typeof da.keywordMatch !== 'string') throw new Error('Invalid detailedAnalysis.keywordMatch type.');
        if (da.experienceRelevance !== undefined && typeof da.experienceRelevance !== 'string') throw new Error('Invalid detailedAnalysis.experienceRelevance type.');
        if (da.skillAdjacency !== undefined && typeof da.skillAdjacency !== 'string') throw new Error('Invalid detailedAnalysis.skillAdjacency type.');
        if (da.potentialAlignment !== undefined && typeof da.potentialAlignment !== 'string') throw new Error('Invalid detailedAnalysis.potentialAlignment type.');
        if (da.quantifiableAchievements !== undefined && (!Array.isArray(da.quantifiableAchievements) || !da.quantifiableAchievements.every(s => typeof s === 'string'))) {
            throw new Error('Invalid detailedAnalysis.quantifiableAchievements type: must be an array of strings.');
        }
      }
      
      res.status(200).json(parsedData);
    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini:", jsonStr, parseError);
      res.status(500).json({ error: `Failed to parse AI response. Raw response snippet: ${jsonStr.substring(0,200)}`, details: parseError.message });
    }

  } catch (apiError) {
    console.error('Error calling Gemini API via proxy:', apiError); // Full error to Vercel logs
    
    let errorMessage = 'An unknown error occurred while communicating with the AI service.';
    let errorDetailsPayload = {};

    if (apiError instanceof Error) {
        errorMessage = `AI API Error: ${apiError.message}`;
        // Attempt to get more structured details if available
        const cause = apiError.cause;
        const details = (apiError).details; // Assuming details might be on the error object
        const code = (apiError).code; // Assuming code might be on the error object
        // const responseData = (apiError).response?.data; // Example for Axios-like errors

        if (cause) errorDetailsPayload.cause = cause.toString();
        if (details) errorDetailsPayload.details = details;
        if (code) errorDetailsPayload.code = code;
        // if (responseData) errorDetailsPayload.responseData = responseData;
        
        // For GoogleGenAI specific errors, they might have a `status` or `errorInfo`
        if ((apiError).status) errorDetailsPayload.status = (apiError).status;
        if ((apiError).errorInfo) errorDetailsPayload.errorInfo = (apiError).errorInfo;


    } else if (typeof apiError === 'string') {
        errorMessage = apiError;
    } else {
        // Try to stringify if it's some other object, for more context
        try {
            const stringifiedError = JSON.stringify(apiError);
            errorDetailsPayload.untypedError = JSON.parse(stringifiedError); // Ensure it's a clean object
        } catch (e) {
            errorDetailsPayload.unparseableErrorObject = true;
        }
    }
    
    res.status(500).json({ 
      error: errorMessage, 
      ...(Object.keys(errorDetailsPayload).length > 0 && { details: errorDetailsPayload }) 
    });
  }
}