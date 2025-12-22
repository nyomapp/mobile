import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI, TokenStorage, initializeAPI } from "../api";
import { LoginRequest, User } from "../api/types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (
    data: LoginRequest
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
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


  const login = async (data: LoginRequest) => {
    try {
      console.log("Attempting login with data:", data.email);
      const response = await AuthAPI.LoginIn(data);
      console.log("Login API response:", response);

      if (response.success && response.data) {
        const responseData = response.data;
        console.log("Response data keys:", Object.keys(responseData));

        // Handle token
        const token = responseData.tokens?.access?.token;
        if (token) {
          console.log("Setting token from response");
          await TokenStorage.setToken(token);
        } else {
          console.warn("No token found in response data");
          return {
            success: false,
            error: "No authentication token received",
          };
        }

        // Handle user
        const user = responseData.user;
        if (user) {
          console.log("Setting user:", user.id);
          await TokenStorage.setUser(user);
          setUser(user);
        }

        setIsAuthenticated(true);
      }

      return {
        success: response.success,
        message: (response.data as any)?.message || response.message,
        error: response.error,
      };
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      return {
        success: false,
        error: errorMessage,
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
    login,
    updateUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
