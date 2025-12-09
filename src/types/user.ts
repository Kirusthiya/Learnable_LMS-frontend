
export interface UserResponse {
  id:string;
  user: {
    userId: string;
    email: string;
    username: string;
    displayName: string;
    fullName: string;
    role: string;
    token: string;
  };

  teacher?: {
    profileId: string;
    userId: string;
    dateOfBirth: string;
    contactPhone: string;
    bio: string;
    avatarUrl: string | null;
    lastUpdatedAt: string;
    displayName: string;
    fullName: string;
    username: string;
    email: string;
    classes: Class[];
  };

  student?: {
    userId: string;
    email: string;
    username: string;
    displayName: string;
    fullName: string;
    classes: Class[];
    token?: string;
  };

  class?: any;
}

export type User = {
  userId: string;
  fullName: string;
  displayName: string;
  username: string;
  token?: string;
  role: string;
  classes?: Class[];
};

export type Class = {
      classId: string,
      className: string,
      classJoinName: string,
      description: string,
      createdAt: string,
      teacherId: string,
      status: string
      repositories?: Repository[];
  };

export type UpdateUserPayload = {
  fullName: string;
  displayName: string;
  newUsername: string; 
}


  
 

export type Repository={
  repoId: string;
  classId: string;           // The class this repo belongs to
  fileName: string;          // Repository file name
  repoDescription: string;   // Description of the repository
  repoCertification?: string; // Optional certification info
  createdAt?: string;  
}

// Normal login creds
export type LoginCreds = {
  email: string;           
  password: string;
};

// Register creds
export type RegisterCreds = {
  username: string;          
  email: string;
  password: string;
  otp?: string;  
      
};


export type RepositoryDto={
   classId: string,
  repoName: string,          
  repoDescription: string ,
  repoCertification: string 
};