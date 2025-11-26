/**
 * API Usage Examples
 * 
 * This file contains examples of how to use the API services
 * in your React Native components.
 */

import { 
  AuthAPI, 
  UsersAPI, 
  TeamsAPI, 
  TokenStorage,
  initializeAPI,
  CreateUserRequest,
  UpdateUserRequest,
  CreateTeamRequest
} from './index';

// Initialize API on app start
export const initApp = async () => {
  await initializeAPI();
};

// Authentication Examples
export const authExamples = {
  // Request OTP
  requestOTP: async (email: string) => {
    const response = await AuthAPI.requestOTP({ email });
    if (response.success) {
      console.log('OTP sent successfully');
      return response.data;
    } else {
      console.error('Failed to send OTP:', response.error);
      throw new Error(response.error);
    }
  },

  // Verify OTP and login
  verifyOTP: async (email: string, otp: string) => {
    const response = await AuthAPI.verifyOTP({ email, otp });
    if (response.success && response.data?.token) {
      // Store token for future requests
      await TokenStorage.setToken(response.data.token);
      console.log('Login successful');
      return response.data;
    } else {
      console.error('Failed to verify OTP:', response.error);
      throw new Error(response.error);
    }
  },

  // Logout
  logout: async () => {
    await TokenStorage.removeToken();
    console.log('Logged out successfully');
  },

  // Check if user is authenticated
  checkAuth: async () => {
    return await TokenStorage.isAuthenticated();
  }
};

// Users API Examples
export const usersExamples = {
  // Create a new user
  createUser: async (userData: CreateUserRequest) => {
    const response = await UsersAPI.createUser(userData);
    if (response.success) {
      console.log('User created:', response.data);
      return response.data;
    } else {
      console.error('Failed to create user:', response.error);
      throw new Error(response.error);
    }
  },

  // Get user by ID
  getUser: async (userId: string) => {
    const response = await UsersAPI.getUserById(userId);
    if (response.success) {
      console.log('User retrieved:', response.data);
      return response.data;
    } else {
      console.error('Failed to get user:', response.error);
      throw new Error(response.error);
    }
  },

  // Update user
  updateUser: async (userId: string, updateData: UpdateUserRequest) => {
    const response = await UsersAPI.updateUser(userId, updateData);
    if (response.success) {
      console.log('User updated:', response.data);
      return response.data;
    } else {
      console.error('Failed to update user:', response.error);
      throw new Error(response.error);
    }
  },

  // Get all users
  getAllUsers: async () => {
    const response = await UsersAPI.getAllUsers();
    if (response.success) {
      console.log('Users retrieved:', response.data);
      return response.data;
    } else {
      console.error('Failed to get users:', response.error);
      throw new Error(response.error);
    }
  },

  // Get users by IDs
  getUsersByIds: async (userIds: string[]) => {
    const response = await UsersAPI.getUsersByIds({ ids: userIds });
    if (response.success) {
      console.log('Users retrieved:', response.data);
      return response.data;
    } else {
      console.error('Failed to get users:', response.error);
      throw new Error(response.error);
    }
  },

  // Get profile questions
  getProfileQuestions: async () => {
    const response = await UsersAPI.getProfileQuestions();
    if (response.success) {
      console.log('Profile questions retrieved:', response.data);
      return response.data;
    } else {
      console.error('Failed to get profile questions:', response.error);
      throw new Error(response.error);
    }
  },

  // Get user teams
  getUserTeams: async (userId: string) => {
    const response = await UsersAPI.getUserTeams(userId);
    if (response.success) {
      console.log('User teams retrieved:', response.data);
      return response.data;
    } else {
      console.error('Failed to get user teams:', response.error);
      throw new Error(response.error);
    }
  }
};

// Teams API Examples
export const teamsExamples = {
  // Get all teams
  getAllTeams: async () => {
    const response = await TeamsAPI.getAllTeams();
    if (response.success) {
      console.log('Teams retrieved:', response.data);
      return response.data;
    } else {
      console.error('Failed to get teams:', response.error);
      throw new Error(response.error);
    }
  },

  // Get team by ID
  getTeam: async (teamId: string) => {
    const response = await TeamsAPI.getTeamById(teamId);
    if (response.success) {
      console.log('Team retrieved:', response.data);
      return response.data;
    } else {
      console.error('Failed to get team:', response.error);
      throw new Error(response.error);
    }
  },

  // Create a new team
  createTeam: async (teamData: CreateTeamRequest) => {
    const response = await TeamsAPI.createTeam(teamData);
    if (response.success) {
      console.log('Team created:', response.data);
      return response.data;
    } else {
      console.error('Failed to create team:', response.error);
      throw new Error(response.error);
    }
  }
};

// React Hook Examples
export const useAPIHooks = {
  // Example of using API in a React component
  exampleComponent: `
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { authExamples, usersExamples } from '../api/examples';

const ExampleComponent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const isAuth = await authExamples.checkAuth();
      if (isAuth) {
        const userData = await usersExamples.getUser('user-id');
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      await authExamples.requestOTP('user@example.com');
      // Handle OTP verification...
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>{user ? \`Welcome \${user.firstName}\` : 'Not logged in'}</Text>
      <Button title="Login" onPress={handleLogin} disabled={loading} />
    </View>
  );
};

export default ExampleComponent;
  `
};