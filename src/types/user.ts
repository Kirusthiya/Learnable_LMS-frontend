export type UserResponse = {
  user: User,
  student?: { classes?: Class[] },
  teacher?: any
  token: string
}

export type User = {
  id: string;
  fullName: string;
  displayName: string;
  username: string;
  token?: string;
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
  };
 

// Normal login creds
export type LoginCreds = {
  email: string;            // backend expects email
  password: string;
};

// Register creds
export type RegisterCreds = {
  username: string;          // displayName → fullName
  email: string;
  password: string;
  otp?: string;              // OTP required for registration
};


