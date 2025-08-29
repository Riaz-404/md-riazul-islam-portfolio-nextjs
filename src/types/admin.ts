export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export interface AdminSession {
  email: string;
  isAdmin: boolean;
}
