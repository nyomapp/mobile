//import DeviceInfo from 'react-native-device-info';
import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import {
  APIResponse,
  RequestOTPRequest,
  RequestOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from './types';

export class AuthAPI {
  /**
   * Request OTP for email verification
   */
  static async requestOTP(data: RequestOTPRequest): Promise<APIResponse<RequestOTPResponse>> {
    try {
      const response = await apiClient.post<RequestOTPResponse>(
        API_ENDPOINTS.AUTH.REQUEST_OTP,
        data
      );

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'OTP sent successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to send OTP',
      };
    } catch (error) {
      console.error('Request OTP Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }


  /**
   * Verify OTP and complete authentication
   */
  static async verifyOTP(data: VerifyOTPRequest): Promise<APIResponse<VerifyOTPResponse>> {
    try {
      const response = await apiClient.post<VerifyOTPResponse>(
        API_ENDPOINTS.AUTH.VERIFY_OTP,
        data
      );

      console.error('Verify OTP Response 1:', response);
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'OTP verified successfully',
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