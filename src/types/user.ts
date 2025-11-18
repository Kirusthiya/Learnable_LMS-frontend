// User type
export type User = {
  id: string;               // User ID from backend
  fullName: string;         // displayName → backend uses fullName
  email: string;
  token?: string;           // JWT token (optional, after login/register)
      
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


