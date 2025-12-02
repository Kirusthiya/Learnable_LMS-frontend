export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;  // ISO string
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'request';
  meta?: any;
}


export type GlobalSearch = {
 id: string; // Guid is mapped to string in TypeScript
    type: 'User' | 'Class'; // The type of the result
    title: string;
    subTitle: string;
};

export type ClassDto = {
 classId: string;
  className: string;
  classJoinName: string;
  description: string;
  status: string;
  teacher: any;
  students: any[];
  repositories: any[];
}


export type UserDetailsDto= {
   userId: string;
   role: 'Student' | 'Teacher' ;
    fullName: string;
    displayName: string;
    username: string;
    email: string;
    contactNumber: string;
    bio: string;
    profilePictureUrl?: string;
    enrolledClasses?: ClassDto[];
}


// types/Notification.ts (or appropriate)
export type SimpleClass= {
  classId: string;
  className: string;
  description?: string | null;
}


