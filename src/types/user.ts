
export type UserResponse = {
  user: User,
  student?: { classes?: Class[] },
  teacher?: any
  token: string
  role: string;
}

export type User = {
  id: string;
  fullName: string;
  displayName: string;
  username: string;
  token?: string;
   role: string;
  classes?: Class[];
};

// Update Payload-க்கான ஒரு interface-ஐ உருவாக்குதல்
export type UpdateUserPayload = {
  fullName: string;
  displayName: string;
  newUsername: string; // Backend-ன் 'UpdateUserCommand'-க்கு ஏற்றவாறு
}


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
 

export type Repository={
  repoId: string;
  repoName: string;
  description: string;
  certification: string;
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


