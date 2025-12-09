export type NotificationDto= {
  id:string;
  sender: UserDto;
  receiver: UserDto;
  class: ClassDto;
  notificationStatus: 'Pending' | 'Approved' | 'Rejected';
  type: 'JoinRequest';
};


export type GlobalSearch = {
 id: string; 
    type: 'User' | 'Class'; 
    title: string;
    subTitle: string;
    
};

export type UserDto ={
  userId: string;
  fullName: string; // பயனர் பெயரைக் காட்ட இதை பயன்படுத்துகிறோம்
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
     classes?: {
    classId: string;
    className: string;
    description?: string;
  }[];
}

export type Asset = {
  assetId: string;
  type: string; 
  title: string;
  description: string;
  url: string; 
  ocrPdfs?: { chunkId: number; chunk: string }[];    
}


