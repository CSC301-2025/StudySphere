
export interface UserRole {
  id: string;
  name: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  recoveryEmail?: string;
  roles: UserRole[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  recoveryEmail?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
}
