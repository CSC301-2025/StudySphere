import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginCredentials, RegisterData, AuthResponse } from "@/types/auth";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAttempts: number;
  isLoginBlocked: boolean;
  requiresCaptcha: boolean;
  blockUntil: Date | null;
  login: (credentials: LoginCredentials, captchaToken?: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  resetLoginAttempts: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  loginAttempts: 0,
  isLoginBlocked: false,
  requiresCaptcha: false,
  blockUntil: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  resetLoginAttempts: () => {},
  updateUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Constants for login attempt tracking
const MAX_LOGIN_ATTEMPTS = 10;
const CAPTCHA_THRESHOLD = 5;
const BLOCK_THRESHOLD = 10; // New constant for when to start blocking
const BLOCK_DURATION_BASE_MINUTES = 1;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [blockUntil, setBlockUntil] = useState<Date | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check for stored login attempts on mount
  useEffect(() => {
    const storedAttempts = localStorage.getItem('loginAttempts');
    const storedBlockUntil = localStorage.getItem('blockUntil');
    
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts, 10));
    }
    
    if (storedBlockUntil) {
      const blockDate = new Date(storedBlockUntil);
      if (blockDate > new Date()) {
        setBlockUntil(blockDate);
      } else {
        // Clear expired block
        localStorage.removeItem('blockUntil');
      }
    }
    
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          // Reset login attempts on successful auth check
          resetLoginAttempts();
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
        // If there's an error (like expired token), clear the tokens
        authService.logout();
        // Invalidate all queries to ensure stale data is cleared
        queryClient.invalidateQueries();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [queryClient]);
  
  // Check if login is currently blocked
  const isLoginBlocked = !!blockUntil && blockUntil > new Date();

  // Check if captcha is required (5+ attempts)
  const requiresCaptcha = loginAttempts >= CAPTCHA_THRESHOLD;

  // Reset login attempts counter
  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    setBlockUntil(null);
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('blockUntil');
  };

  // Calculate exponential backoff time in minutes
  const calculateLockDuration = (attempts: number) => {
    // Only calculate duration for attempts beyond BLOCK_THRESHOLD
    const attemptsOverThreshold = attempts - BLOCK_THRESHOLD;
    if (attemptsOverThreshold <= 0) return 0;
    
    // Exponential increase: 1, 2, 4, 8, 16 minutes...
    return BLOCK_DURATION_BASE_MINUTES * Math.pow(2, attemptsOverThreshold - 1);
  };

  // Increment login attempts and potentially block login
  const incrementLoginAttempts = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    localStorage.setItem('loginAttempts', newAttempts.toString());
    
    // Only implement temporary lock after reaching BLOCK_THRESHOLD
    if (newAttempts >= BLOCK_THRESHOLD) {
      const blockDurationMinutes = calculateLockDuration(newAttempts);
      
      if (blockDurationMinutes > 0) {
        const blockTime = new Date();
        blockTime.setMinutes(blockTime.getMinutes() + blockDurationMinutes);
        setBlockUntil(blockTime);
        localStorage.setItem('blockUntil', blockTime.toISOString());
        
        toast({
          title: "Too many failed attempts",
          description: `Your account is temporarily locked. Please try again later.`,
          variant: "destructive",
        });
      }
    }
    
    // Still show CAPTCHA required toast at CAPTCHA_THRESHOLD
    if (newAttempts === CAPTCHA_THRESHOLD) {
      toast({
        title: "CAPTCHA required",
        description: "Please complete the CAPTCHA verification to continue.",
        variant: "destructive",
      });
    }
  };

  const login = async (credentials: LoginCredentials, captchaToken?: string) => {
    // Check if login is temporarily blocked
    if (isLoginBlocked) {
      return;
    }
    
    // Check if CAPTCHA is required but not provided
    if (requiresCaptcha && !captchaToken) {
      toast({
        title: "CAPTCHA required",
        description: "Please complete the CAPTCHA verification to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Before login, clear all query cache to prevent data leakage between accounts
      queryClient.clear();
      
      const response: AuthResponse = await authService.login(credentials);
      setUser(response.userDto);
      // Reset login attempts on successful login
      resetLoginAttempts();
      
      // Invalidate all queries to force refetch with new credentials
      queryClient.invalidateQueries();
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.userDto.firstName}!`,
      });
    } catch (error) {
      // Increment failed login attempts
      incrementLoginAttempts();
      
      let errorMessage = error instanceof Error ? error.message : "Invalid credentials";
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      toast({
        title: "Registration successful",
        description: "You can now log in with your credentials",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    
    // Clear all query cache on logout to prevent data leakage
    queryClient.clear();
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  // Add updateUser method
  const updateUser = async (userData: Partial<User>) => {
    if (!user || !user.id) {
      throw new Error("User not authenticated");
    }

    setIsLoading(true);
    try {
      const updatedUser = await authService.updateUser(user.id, userData);
      setUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Could not update profile",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginAttempts,
        isLoginBlocked,
        requiresCaptcha,
        blockUntil,
        login,
        register,
        logout,
        resetLoginAttempts,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
