
import { LoginCredentials, RegisterData, AuthResponse, TokenData, User } from "@/types/auth";

// Base API URL - should be updated based on your backend configuration
const API_BASE_URL = "http://localhost:8080/api/auth"; // Update this with your actual API URL

// Helper function for making API requests
async function fetchApi<T>(
  endpoint: string,
  method: string = "GET",
  data?: unknown
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add authorization header if user is logged in
  const token = localStorage.getItem("accessToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  // Check if the response is successful
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetchApi<{ success: boolean; message: string; data: AuthResponse }>(
        "/login",
        "POST",
        credentials
      );
      
      // Store tokens in localStorage
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Register new user
  register: async (userData: RegisterData): Promise<void> => {
    try {
      await fetchApi<{ success: boolean; message: string }>(
        "/register",
        "POST",
        userData
      );
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const tokenData: TokenData = {
        accessToken: localStorage.getItem("accessToken") || "",
        refreshToken,
      };

      const response = await fetchApi<{ success: boolean; message: string; data: AuthResponse }>(
        "/refresh",
        "POST",
        tokenData
      );
      
      // Update tokens in localStorage
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      
      return response.data;
    } catch (error) {
      // If refresh fails, logout the user
      this.logout();
      console.error("Token refresh error:", error);
      throw error;
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await fetchApi<{ success: boolean; message: string; data: User }>(
        "/me"
      );
      return response.data;
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  },

  // Check if user is authenticated based on local storage tokens
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },
};

