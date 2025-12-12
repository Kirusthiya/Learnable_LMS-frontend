// src/app/types/marks.types.ts

export interface StudentAnswerDto {
  questionId?: string;
  answerIndex: number;
  submittedAt: string; // C# DateTime comes as string in JSON
}

export interface MarksDto {
  examId: string;
  studentId: string;
  marks: number | null;
  examStatus: string | null;
  studentsAnswers?: StudentAnswerDto[]; // Optional based on your usage
}

// For the CreateDefaultMarks endpoint
export interface AddMarkCommand {
  examId: string;
  classId: string;
}

// Response type for CreateDefaultMarks
export interface CreateMarkResponse {
  message: string;
  examId: string;
  classId: string;
  studentIds: string[];
}