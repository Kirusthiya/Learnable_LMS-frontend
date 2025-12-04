export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;  
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'request';
  meta?: any;
}


export type GlobalSearch = {
 id: string; 
    type: 'User' | 'Class'; 
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

export type Asset = {
  assetId: string;
  type: string; 
  title: string;
  description: string;
  url: string; 
  ocrPdfs?: { chunkId: number; chunk: string }[];    
}


