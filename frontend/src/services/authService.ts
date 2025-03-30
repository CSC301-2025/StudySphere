
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

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
      console.error(`API request failed: ${endpoint}`, errorData);
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

// MOCK DATA for demonstration purposes
const MOCK_USER: User = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "555-123-4567",
  recoveryEmail: "recovery@example.com",
  roles: [{ id: "1", name: "Student" }]
};

const MOCK_TOKEN = "mock-jwt-token";
const MOCK_REFRESH = "mock-refresh-token";

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // For demonstration, return mock data instead of making an API call
      console.log("Mock login with:", credentials);
      
      // Store tokens in localStorage
      localStorage.setItem("accessToken", MOCK_TOKEN);
      localStorage.setItem("refreshToken", MOCK_REFRESH);
      
      const mockResponse: AuthResponse = {
        accessToken: MOCK_TOKEN,
        refreshToken: MOCK_REFRESH,
        userDto: MOCK_USER,
        message: "Login successful"
      };
      
      return mockResponse;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Register new user
  register: async (userData: RegisterData): Promise<void> => {
    try {
      // For demonstration, just log the registration attempt
      console.log("Mock register with:", userData);
      
      // In a real app, you would call the API here
      // await fetchApi<{ success: boolean; message: string }>("/register", "POST", userData);
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

      // For demonstration, return mock data instead of making an API call
      console.log("Mock token refresh with:", tokenData);
      
      const mockResponse: AuthResponse = {
        accessToken: MOCK_TOKEN,
        refreshToken: MOCK_REFRESH,
        userDto: MOCK_USER,
        message: "Token refresh successful"
      };
      
      return mockResponse;
    } catch (error) {
      // If refresh fails, logout the user
      authService.logout();
      console.error("Token refresh error:", error);
      throw error;
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    try {
      // For demonstration, return mock user data
      console.log("Getting current user from mock data");
      return MOCK_USER;
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
