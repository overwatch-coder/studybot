export interface CourseInfo {
  module: string;
  language: string;
  level: string;
  pdfs?: File[];
  pdfContent?: string;
}

export interface UserProgress {
  completedModules: number;
  totalModules: number;
  lastActivity: string;
  timeSpent: string;
  questionsAnswered: number;
  flashcardsReviewed: number;
  studySessions: number;
}