import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginCredentials, RegisterData, AuthResponse } from "@/types/auth";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAttempts: number;
  isLoginBlocked: boolean;
  blockUntil: Date | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  resetLoginAttempts: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  loginAttempts: 0,
  isLoginBlocked: false,
  blockUntil: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  resetLoginAttempts: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Constants for login attempt tracking
const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION_MINUTES = 5;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [blockUntil, setBlockUntil] = useState<Date | null>(null);
  const { toast } = useToast();

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
        localStorage.removeItem('loginAttempts');
        setLoginAttempts(0);
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
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Check if login is currently blocked
  const isLoginBlocked = !!blockUntil && blockUntil > new Date();

  // Reset login attempts counter
  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    setBlockUntil(null);
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('blockUntil');
  };

  // Increment login attempts and potentially block login
  const incrementLoginAttempts = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    localStorage.setItem('loginAttempts', newAttempts.toString());
    
    // If max attempts reached, block login
    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      const blockTime = new Date();
      blockTime.setMinutes(blockTime.getMinutes() + BLOCK_DURATION_MINUTES);
      setBlockUntil(blockTime);
      localStorage.setItem('blockUntil', blockTime.toISOString());
      
      toast({
        title: "Account temporarily locked",
        description: `Too many failed login attempts. Please try again after ${BLOCK_DURATION_MINUTES} minutes.`,
        variant: "destructive",
      });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    // Check if login is blocked
    if (isLoginBlocked) {
      const minutes = Math.ceil((blockUntil!.getTime() - new Date().getTime()) / 60000);
      toast({
        title: "Login temporarily disabled",
        description: `Too many failed attempts. Please try again after ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response: AuthResponse = await authService.login(credentials);
      setUser(response.userDto);
      // Reset login attempts on successful login
      resetLoginAttempts();
      toast({
        title: response.message,
        description: `Welcome back, ${response.userDto.firstName}!`,
      });
    } catch (error) {
      // Increment failed login attempts
      incrementLoginAttempts();
      
      const attemptsLeft = MAX_LOGIN_ATTEMPTS - loginAttempts - 1;
      let errorMessage = error instanceof Error ? error.message : "Invalid credentials";
      
      if (attemptsLeft > 0 && attemptsLeft < MAX_LOGIN_ATTEMPTS) {
        errorMessage += `. ${attemptsLeft} ${attemptsLeft === 1 ? 'attempt' : 'attempts'} left before temporary lockout.`;
      }
      
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
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginAttempts,
        isLoginBlocked,
        blockUntil,
        login,
        register,
        logout,
        resetLoginAttempts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
