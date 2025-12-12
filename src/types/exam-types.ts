// src/types/exam-types.ts

// -------------------------
// 1. CREATE EXAM TYPES
// -------------------------

export interface CreateExamQuestionDto {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
}

export interface CreateExamDto {
  repoId?: string;
  title: string;
  description?: string;
  startDatetime?: string;
  endDatetime?: string;
  duration?: number;

  // Changed 'questions' to 'Question' to match C# Backend
  Question: CreateExamQuestionDto[];
}

// Wrapper for Command
export interface CreateExamCommand {
  exam: CreateExamDto;
}

// -------------------------
// 2. UPDATE EXAM TYPES
// -------------------------

export interface UpdateExamQuestionDto {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
}

export interface UpdateExamDto {
  examId: string;
  repoId?: string;
  title?: string;
  description?: string;
  startDatetime?: string;
  endDatetime?: string;
  duration?: number;

  // 👇 UPDATE: Synced with CreateDto to match C# Backend
  Question: UpdateExamQuestionDto[];
}

// Wrapper for Command
export interface UpdateExamCommand {
  exam: UpdateExamDto;
}

// -------------------------
// 3. AI GENERATION & RESPONSE TYPES
// -------------------------

export interface GetQuestionQuery {
  asset_Id: string[];
  question_Count: number;
}

// Response DTO
export interface ExamQuestionDto {
  questionId?: string;
  examId?: string;
  question: string;
  answers: string[];
  correctAnswerIndex: number;
}

// Generic Exam DTO for Response
export interface ExamDto {
  id?: string;
  title: string;
  description?: string;
  repoId?: string;
  
  // Note: Backend might return 'questions' or 'Question'. 
  // Kept as 'questions' for standard view, but check your API response.
  questions?: ExamQuestionDto[];
}