export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export type LoginResponse = {
  accessToken: string;
};