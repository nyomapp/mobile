import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './client';
import { User } from './types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export class TokenStorage {
  /**
   * Store authentication token
   */
  static async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      apiClient.setAuthToken(token);
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  }

  /**
   * Store user data
   */
  static async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  }

  /**
   * Get stored user data
   */
  static async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  /**
   * Get stored authentication token
   */
  static async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        apiClient.setAuthToken(token);
      }
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  /**
   * Remove authentication token and user data
   */
  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      apiClient.setAuthToken(null);
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  }

  /**
 * Clear all stored data
 */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      apiClient.setAuthToken(null);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }


  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await TokenStorage.getToken();
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
}