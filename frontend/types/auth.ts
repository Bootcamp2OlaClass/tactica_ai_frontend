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
};

export type CurrentUser = {
  id: number;
  email: string;
  fullName: string;
  role: string;
  emailVerified: boolean;
};

export type ForgotPasswordFieldErrors = {
  email?: string;
};

export type ResetPasswordFieldErrors = {
  password?: string;
  confirmPassword?: string;
};