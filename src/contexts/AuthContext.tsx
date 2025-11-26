import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI, TokenStorage, initializeAPI } from "../api";
import { RequestOTPRequest, User, VerifyOTPRequest } from "../api/types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  requestOTP: (
    data: RequestOTPRequest
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyOTP: (
    data: VerifyOTPRequest
  ) => Promise<{ success: boolean; message?: string; error?: string; }>;
  updateUser: (userData: User) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log("Initializing auth...");
      await initializeAPI();
      const isAuth = await TokenStorage.isAuthenticated();
      console.log("Is authenticated:", isAuth);
      setIsAuthenticated(isAuth);

      if (isAuth) {
        const userData = await TokenStorage.getUser();
        console.log("Loaded user data:", userData);
        setUser(userData);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      console.log("Auth initialization complete");
      setIsLoading(false);
    }
  };

  const requestOTP = async (data: RequestOTPRequest) => {
    try {
      const response = await AuthAPI.requestOTP(data);
      return {
        success: response.success,
        message: response.message,
        error: response.error,
      };
    } catch (error) {
      console.error("Request OTP Error:", error);
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  };

  const verifyOTP = async (data: VerifyOTPRequest) => {
    try {
      const response = await AuthAPI.verifyOTP(data);
      console.log("VerifyOTP response:", response);

      if (response.success && response.data?.data) {
        const responseData = response.data.data;
        console.log("Response data:", responseData);

        // Handle token
        const token = responseData.token;
        if (token) {
          console.log("Setting token:", token);
          await TokenStorage.setToken(token);
        }

        // Handle user
        const user = responseData.user;
        if (user) {
          console.log("Setting user:", user);
          await TokenStorage.setUser(user);
          setUser(user);
        }

        setIsAuthenticated(true);
      }

      return {
        success: response.success,
        message: response.data?.message || response.message,
        error: response.error,
      };
    } catch (error) {
      console.error("Verify OTP Error:", error);
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  };

  const updateUser = async (userData: User) => {
    try {
      await TokenStorage.setUser(userData);
      setUser(userData);
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await TokenStorage.removeToken();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    requestOTP,
    verifyOTP,
    updateUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
