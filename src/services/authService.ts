import { LoginCredentials, RegisterData, AuthResponse, TokenData, User } from "@/types/auth";

// Use environment variable for the base URL, and append '/auth' if that’s your auth endpoint
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api";

async function fetchApi<T>(
  endpoint: string,
  method: string = "GET",
  data?: unknown
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("accessToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const fetchOptions: RequestInit = {
      method,
      headers,
      credentials: "include"
    };

    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    if (response.status === 204) {
      return {} as T;
    }

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return {} as T;
    }

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! Status: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Call the actual Spring Boot login endpoint
      const response = await fetchApi<{success: boolean; message: string; data: AuthResponse}>("/login", "POST", credentials);
      
      if (response.success && response.data) {
        // Store tokens in localStorage
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        
        // Store user ID for request identification
        if (response.data.userDto && response.data.userDto.id) {
          localStorage.setItem("userId", response.data.userDto.id.toString());
        }
        
        return response.data;
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Register new user
  register: async (userData: RegisterData): Promise<void> => {
    try {
      // Call the actual Spring Boot register endpoint
      const response = await fetchApi<{success: boolean; message: string}>("/register", "POST", userData);
      
      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
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

      // Call the actual Spring Boot refresh token endpoint
      const response = await fetchApi<{success: boolean; message: string; data: AuthResponse}>("/refresh", "POST", tokenData);
      
      if (response.success && response.data) {
        // Update tokens in localStorage
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        
        return response.data;
      } else {
        throw new Error(response.message || "Token refresh failed");
      }
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
      // Call the actual Spring Boot user profile endpoint
      const response = await fetchApi<{success: boolean; message: string; data: User}>("/me", "GET");
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to get user profile");
      }
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  },

  // Update user profile
  updateUser: async (userId: string, userData: Partial<User>): Promise<User> => {
    try {
      // Call the backend update user endpoint
      const response = await fetchApi<{success: boolean; message: string; data: User}>(`/${userId}`, "PUT", userData);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update user profile");
      }
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  },

  // Check if user is authenticated based on local storage tokens
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },

  // Validate tokens
  validateTokens: async (): Promise<AuthResponse> => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!accessToken || !refreshToken) {
      throw new Error("No tokens available");
    }

    try {
      const tokenData: TokenData = {
        accessToken,
        refreshToken,
      };

      // Call the actual Spring Boot validate tokens endpoint
      const response = await fetchApi<{success: boolean; message: string; data: AuthResponse}>("/validateTokens", "POST", tokenData);
      
      if (response.success && response.data) {
        // Update tokens in localStorage if they changed
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        
        return response.data;
      } else {
        throw new Error(response.message || "Token validation failed");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      throw error;
    }
  }
};
