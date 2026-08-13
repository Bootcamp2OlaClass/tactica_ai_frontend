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

export type RegisterCredentials = {
  fullName: string;
  email: string;
  password: string;
};

export type RegisterFieldErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
};

export type RegisterResponse = {
  accessToken: string;
};