import { apiClient } from "./client";
import { API_ENDPOINTS } from "./config";

export const changePassword = async (
  formData: any, id: any
) => {
  try {
    
    const response = await apiClient.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD.replace(":userId", id), formData);
    // Check if the API client returned an error response
    if (!response.success || response.error) {
      throw new Error(response.error || "API request failed");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
