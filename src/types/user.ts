export type User = {
  id: string;
  displayName: string;
  email: string;
  token: string;
  imageUrl?: string;
};

export type LoginCreds = {
  username: string;
  password: string;
};

export type RegisterCreds = {
  username: string;
  displayName: string;
  password: string;
};
