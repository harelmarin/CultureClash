export type LoginData = {
  username: string;
  password: string;
};

export type RegisterData = {
  username: string;
  email: string;
  password: string;
};

export type UserSession = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

export type LoginResponse = {
  user: UserSession;
  message: string;
};

export type AuthContext = {
  isAuthenticated: boolean;
  checkSession: () => Promise<void>;
};
