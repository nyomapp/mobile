import { API_CONFIG } from './config';
import { APIError, APIResponse } from './types';

class APIClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = API_CONFIG.HEADERS;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError({
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        });
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Request Error:', error);

      if (error instanceof APIError) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout. Please check your internet connection.',
        };
      }

      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<APIResponse<T>> {
    // If data is undefined/null, don't include Content-Type
    if (data === undefined || data === null) {
      // Create headers without Content-Type
      const requestHeaders: Record<string, string> = {
        'x-request-channel': 'mobile',
      };

      // Add auth token if available
      if (this.authToken) {
        requestHeaders.Authorization = `Bearer ${this.authToken}`;
      }

      // Add any custom headers, but filter out undefined values
      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            requestHeaders[key] = value;
          }
        });
      }

      // Make request without Content-Type
      const url = `${this.baseURL}${endpoint}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          method: 'POST',
          headers: requestHeaders,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          // Extract error message from different possible structures
          let errorMessage = errorData.message || errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;

          // Handle the specific case where error is nested
          if (errorData.error && typeof errorData.error === 'string') {
            errorMessage = errorData.error;
          }

          throw new APIError({
            message: errorMessage,
            status: response.status,
          });
        }


        const responseData = await response.json();
        return {
          success: true,
          data: responseData,
        };
      } catch (error) {
        console.error('API Request Error:', error);

        if (error instanceof APIError) {
          return {
            success: false,
            error: error.message,
          };
        }

        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout. Please check your internet connection.',
          };
        }

        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
        };
      }
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    });
  }




  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<APIResponse<T>> {
    // Create headers without Content-Type for DELETE requests
    const requestHeaders: Record<string, string> = {
      'x-request-channel': 'mobile',
    };

    if (this.authToken) {
      requestHeaders.Authorization = `Bearer ${this.authToken}`;
    }

    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          requestHeaders[key] = value;
        }
      });
    }

    const url = `${this.baseURL}${endpoint}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError({
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        });
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Request Error:', error);

      if (error instanceof APIError) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout. Please check your internet connection.',
        };
      }

      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

}

export const apiClient = new APIClient();