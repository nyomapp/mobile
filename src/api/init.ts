import { TokenStorage } from './tokenStorage';

/**
 * Initialize API configuration
 * This should be called when the app starts
 */
export const initializeAPI = async (): Promise<void> => {
  try {
    // Load stored token and set it in the API client
    await TokenStorage.getToken();
    console.log('API initialized successfully');
  } catch (error) {
    console.error('Failed to initialize API:', error);
  }
};