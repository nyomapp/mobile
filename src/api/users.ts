import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import {
  APIResponse,
  UpdateUserRequest,
  User,
} from './types';

export class UsersAPI {
  
  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<APIResponse<User>> {
    try {
      const endpoint = API_ENDPOINTS.USERS.GET_BY_ID.replace(':userId', userId);
      const response = await apiClient.get<User>(endpoint);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'User retrieved successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to get user',
      };
    } catch (error) {
      console.error('Get User Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  
  /**
   * Update user
   */
  static async updateUser(userId: string, data: UpdateUserRequest): Promise<APIResponse<User>> {
    try {
      const endpoint = API_ENDPOINTS.USERS.UPDATE.replace(':userId', userId);
      const response = await apiClient.put<User>(endpoint, data);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'User updated successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to update user',
      };
    } catch (error) {
      console.error('Update User Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }



}