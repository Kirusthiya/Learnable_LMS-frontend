// User type
export type User = {
  id: string;            // Backend UUID
  fullName: string;      // Full name
  displayName: string;   // display name
  username: string;      // Email / username
  token?: string;        // JWT token
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


