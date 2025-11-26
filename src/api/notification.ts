import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import { APIResponse } from './types';

export interface NotificationParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'sent' | 'failed' | 'read';
  type?: 'inApp' | 'mobilePush' | 'webPush';
}

export interface DeviceRegistration {
  deviceToken: string;
  platform: 'android' | 'ios';
  deviceName: string;
  appVersion: string;
}

export interface DeviceUnregistration {
  deviceToken: string;
}

export class NotificationAPI {
  /**
   * Get notifications
   */
  static async getNotifications(params?: NotificationParams): Promise<APIResponse<any>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.GET_ALL, { params });

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Notifications retrieved successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to get notifications',
      };
    } catch (error) {
      console.error('Get Notifications Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: string): Promise<APIResponse<any>> {
    try {
      const endpoint = API_ENDPOINTS.NOTIFICATIONS.MARK_READ.replace(':id', id);
      const response = await apiClient.post(endpoint);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Notification marked as read',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to mark notification as read',
      };
    } catch (error) {
      console.error('Mark As Read Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  /**
   * Register device for push notifications
   */
  static async registerDevice(data: DeviceRegistration): Promise<APIResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.REGISTER_DEVICE, data);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Device registered successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to register device',
      };
    } catch (error) {
      console.error('Register Device Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(id: string): Promise<APIResponse<any>> {
    try {
      const endpoint = API_ENDPOINTS.NOTIFICATIONS.DELETE.replace(':id', id);
      const response = await apiClient.delete(endpoint);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Notification deleted successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to delete notification',
      };
    } catch (error) {
      console.error('Delete Notification Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  /**
   * Unregister device from push notifications
   */
  static async unregisterDevice(data: DeviceUnregistration): Promise<APIResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.UNREGISTER_DEVICE, data);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'Device unregistered successfully',
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to unregister device',
      };
    } catch (error) {
      console.error('Unregister Device Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }
}