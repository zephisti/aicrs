
export type FeedbackRating = "Strong Match" | "Potential Match" | "Not a Fit" | null;

export interface RecruiterFeedback {
  rating: FeedbackRating;
  reason?: string;
}

export interface CRSResponse {
  score: number;
  explanation: string;
  strengths: string[];
  weaknesses: string[];
  detailedAnalysis?: {
    keywordMatch?: string;
    experienceRelevance?: string;
    skillAdjacency?: string;
    potentialAlignment?: string;
    quantifiableAchievements?: string[]; 
  };
}

export type RequisitionStatus = 'Draft' | 'Open' | 'On Hold' | 'Closed' | 'Filled';

export interface Requisition {
  id: string;
  jobTitle: string;
  status: RequisitionStatus;
  hiringManager?: string;
  location?: string;
  dateCreated: string; // ISO string for date
  dateModified?: string; // ISO string for date
  candidateCount: number;
  averageCrs?: number;
  jobDescription: string;
  mustHaveSkills?: string; // Comma-separated
  niceToHaveSkills?: string; // Comma-separated
}

// Candidate Related Types
export interface CandidateCrsEntry {
  requisitionId: string;
  requisitionTitle: string;
  score: number;
  date: string; // ISO string
  analysisLink?: string; // Link to the detailed CRS breakdown if stored separately
}

export type CandidateApplicationStatus = 
  'Applied' | 
  'CRS Screened' | 
  'Recruiter Review' | 
  'HM Screen' | 
  'Interviewing' | 
  'Offer Extended' | 
  'Offer Accepted' | 
  'Hired' | 
  'Rejected' | 
  'Withdrawn';

export interface CandidateApplication {
  requisitionId: string;
  requisitionTitle: string;
  status: CandidateApplicationStatus;
  dateApplied: string; // ISO string
  lastStatusUpdate?: string; // ISO string
}

export interface ActivityLogEntry {
  date: string; // ISO string
  activity: string;
  user?: string; // User who performed the action or note author
  details?: string; // Optional additional details for the log
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  resumeText?: string; // Raw resume text
  // Optional: a more structured parsed resume can be added here later
  // parsedResume?: { 
  //   contactInfo?: any;
  //   summary?: string;
  //   experience?: any[];
  //   education?: any[];
  //   skills?: string[];
  // };
  tags?: string[]; // e.g., ["frontend", "senior", "react"]
  source?: string; // e.g., "LinkedIn", "Referral", "Careers Page"
  dateAdded: string; // ISO string
  lastActivityDate?: string; // ISO string
  crsHistory?: CandidateCrsEntry[];
  applications?: CandidateApplication[];
  activityLog?: ActivityLogEntry[];
  notes?: string; // General notes field for internal comments
}
