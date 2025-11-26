import React, { createContext, useContext, useState } from 'react';
import { UsersAPI } from '../api';
import { User, CreateUserRequest, UpdateUserRequest, ProfileQuestion, Team } from '../api/types';

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  createUser: (data: CreateUserRequest) => Promise<User | null>;
  getUserById: (userId: string) => Promise<User | null>;
  updateUser: (userId: string, data: UpdateUserRequest) => Promise<User | null>;
  getProfileQuestions: () => Promise<ProfileQuestion[]>;
  getUserTeams: (userId: string) => Promise<Team[]>;
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

  const createUser = async (data: CreateUserRequest): Promise<User | null> => {
    setIsLoading(true);
    try {
      const response = await UsersAPI.createUser(data);
      if (response.success && response.data) {
        setCurrentUser(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Create user error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

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

  const getProfileQuestions = async (): Promise<ProfileQuestion[]> => {
    try {
      const response = await UsersAPI.getProfileQuestions();
      return response.success && response.data ? response.data : [];
    } catch (error) {
      console.error('Get profile questions error:', error);
      return [];
    }
  };

  const getUserTeams = async (userId: string): Promise<Team[]> => {
    try {
      const response = await UsersAPI.getUserTeams(userId);
      return response.success && response.data ? response.data : [];
    } catch (error) {
      console.error('Get user teams error:', error);
      return [];
    }
  };

  const value = {
    currentUser,
    isLoading,
    createUser,
    getUserById,
    updateUser,
    getProfileQuestions,
    getUserTeams,
    setCurrentUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};