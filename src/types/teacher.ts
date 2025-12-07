import { Class } from './user';

// -----------------------------------------------------
// Register Teacher Payload for Angular → Backend
// Matches RegisterTeacherDto (C#)
// -----------------------------------------------------
export type RegisterTeacherCreds = {
  userId?: string;            // Will be overridden by backend (JWT)
  displayName?: string | null;
  fullName?: string | null;

  dateOfBirth?: string | null;
  contactPhone?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
};

export type RegisterTeacherRequest = {
  dto: RegisterTeacherCreds;
};

// -----------------------------------------------------
// Teacher DTO returned from backend
// Matches TeacherDto (C#)
// -----------------------------------------------------
export type Teacher = {
  profileId: string;
  userId: string;

  dateOfBirth?: string | null;
  contactPhone?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  lastUpdatedAt?: string | null;

  // User fields
  displayName?: string | null;
  fullName?: string | null;
  username?: string | null;
  email: string;

  classes?: Class[];
};

// -----------------------------------------------------
// Combined User + Teacher DTO
// Matches TeacherUserDto (C#)
// -----------------------------------------------------
export type TeacherUserDto = {
  user: {
    id: string;
    fullName: string;
    displayName: string;
    username: string;
    email: string;
    role: string;
  };
  teacher: Teacher;
};

export type UpdateClassDto = {
  classId: string;
  className: string;
  classJoinName: string;
  description: string;
  teacherId: string;
  status: string;
};

