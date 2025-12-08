import React, { createContext, useContext, useState } from 'react';
import { UsersAPI } from '../api';
import { User, UpdateUserRequest } from '../api/types';

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  getUserById: (userId: string) => Promise<User | null>;
  updateUser: (userId: string, data: UpdateUserRequest) => Promise<User | null>;
  setCurrentUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // const createUser = async (data: CreateUserRequest): Promise<User | null> => {
  //   setIsLoading(true);
  //   try {
  //     const response = await UsersAPI.createUser(data);
  //     if (response.success && response.data) {
  //       setCurrentUser(response.data);
  //       return response.data;
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error('Create user error:', error);
  //     return null;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const getUserById = async (userId: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const response = await UsersAPI.getUserById(userId);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userId: string, data: UpdateUserRequest): Promise<User | null> => {
    setIsLoading(true);
    try {
      const response = await UsersAPI.updateUser(userId, data);
      if (response.success && response.data) {
        if (currentUser?.id === userId) {
          setCurrentUser(response.data);
        }
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Update user error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

 
  const value = {
    currentUser,
    isLoading,
   
    getUserById,
    updateUser,
    setCurrentUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};