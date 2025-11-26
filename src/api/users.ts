import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import {
  APIResponse,
  CreateUserRequest,
  GetTransactionsRequest,
  GetUsersByIdsRequest,
  ProfileQuestion,
  ReVerifyRequest,
  ReVerifyResponse,
  Team,
  Transaction,
  UpdateUserRequest,
  User,
} from './types';

export class UsersAPI {
  /**
   * Create a new user
   */
  static async createUser(data: CreateUserRequest): Promise<APIResponse<User>> {
    try {
      const response = await apiClient.post<User>(
        API_ENDPOINTS.USERS.CREATE,
        data
      );

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'User created successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to create user',
      };
    } catch (error) {
      console.error('Create User Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

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
   * Get users by IDs
   */
  static async getUsersByIds(data: GetUsersByIdsRequest): Promise<APIResponse<User[]>> {
    try {
      const response = await apiClient.post<User[]>(
        API_ENDPOINTS.USERS.GET_BY_IDS,
        data
      );

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Users retrieved successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to get users',
      };
    } catch (error) {
      console.error('Get Users Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  /**
   * Get all users
   */
  static async getAllUsers(): Promise<APIResponse<User[]>> {
    try {
      const response = await apiClient.get<User[]>(API_ENDPOINTS.USERS.GET_ALL);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Users retrieved successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to get users',
      };
    } catch (error) {
      console.error('Get All Users Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  /**
   * Get all users with association
   */
  static async getAllUsersWithAssociation(association: string, page: number = 1, limit: number = 10): Promise<APIResponse<User[]>> {
    try {
      const endpoint = `${API_ENDPOINTS.USERS.GET_ALL}?association=${encodeURIComponent(association)}&page=${page}&limit=${limit}`;
      const response = await apiClient.get<User[]>(endpoint);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Users retrieved successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to get users',
      };
    } catch (error) {
      console.error('Get Users With Association Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  /**
  * Search users by query
  */
  static async searchUsers(query: string, page: number = 1, limit: number = 10): Promise<APIResponse<User[]>> {
    try {
      const endpoint = `${API_ENDPOINTS.USERS.GET_ALL}?association=friend&query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
      const response = await apiClient.get<User[]>(endpoint);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Users searched successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to search users',
      };
    } catch (error) {
      console.error('Search Users Error:', error);
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

  /**
 * Delete user
 */
  static async deleteUser(userId: string): Promise<APIResponse<any>> {
    try {
      const endpoint = API_ENDPOINTS.USERS.DELETE.replace(':userId', userId);
      const response = await apiClient.delete(endpoint);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'User deleted successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to delete user',
      };
    } catch (error) {
      console.error('Delete User Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }


  /**
   * Get profile questions
   */
  static async getProfileQuestions(): Promise<APIResponse<ProfileQuestion[]>> {
    try {
      const response = await apiClient.get<ProfileQuestion[]>(
        API_ENDPOINTS.USERS.PROFILE_QUESTIONS
      );

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Profile questions retrieved successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to get profile questions',
      };
    } catch (error) {
      console.error('Get Profile Questions Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  /**
   * Get user teams
   */
  static async getUserTeams(userId: string): Promise<APIResponse<Team[]>> {
    try {
      const endpoint = API_ENDPOINTS.USERS.GET_TEAMS.replace(':userId', userId);
      const response = await apiClient.get<Team[]>(endpoint);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'User teams retrieved successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to get user teams',
      };
    } catch (error) {
      console.error('Get User Teams Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  // Add to UsersAPI class
  static async reVerifyResend(): Promise<APIResponse<any>> {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.AUTH.RE_VERIFY_RESEND
      );

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Re-verification sent successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to send re-verification',
      };
    } catch (error) {
      console.error('Re-verify Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  static async getUserTransactions(params?: GetTransactionsRequest): Promise<APIResponse<Transaction[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `${API_ENDPOINTS.USERS.GET_TRANSACTIONS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<Transaction[]>(endpoint);

      if (response.success) {
        return {
          success: true,
          data: response.data?.data?.transactions || [],
          message: 'Transactions retrieved successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to get transactions',
      };
    } catch (error) {
      console.error('Get Transactions Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  /**
   * Re-verify email or phone
   */
  static async reVerify(data: ReVerifyRequest): Promise<APIResponse<ReVerifyResponse>> {
    try {
      const endpoint = API_ENDPOINTS.AUTH.RE_VERIFY
        .replace(':type', data.type)
        .replace(':action', data.action);

      // Build request body with only required fields (not type/action)
      let requestBody: any = {};

      if (data.type === 'email') {
        requestBody.email = data.email;
      } else if (data.type === 'phone') {
        requestBody.phone = data.phone;
      }

      if (data.action === 'verify' && data.otp) {
        requestBody.otp = data.otp;
      }

      const response = await apiClient.post<ReVerifyResponse>(endpoint, requestBody);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Re-verification processed successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to process re-verification',
      };
    } catch (error) {
      console.error('Re-verify Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }


}