//import DeviceInfo from 'react-native-device-info';
import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import {
  APIResponse,
  LoginRequest,
  LoginResponse,
} from './types';

export class AuthAPI {
  


  /**
   * Verify OTP and complete authentication
   */
  static async LoginIn(data: LoginRequest): Promise<APIResponse<LoginResponse>> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.Login,
        data
      );

      // console.error('Verify OTP Response 1:', response);
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Login successful',
        };
      }

      return {
        success: false,
        error: response.error || 'Invalid OTP',
      };
    } catch (error) {
      console.error('Verify OTP Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

}