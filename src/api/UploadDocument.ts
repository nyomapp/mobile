import { apiClient } from "./client";
import { API_ENDPOINTS } from "./config";

export const uploadDocument= async (formData:any) => {
    try {
        const response = await apiClient.post(API_ENDPOINTS.ADD_DELIVERY.Upload_Documents,formData)
            // Check if the API client returned an error response
    if (!response.success || response.error) {      
      throw new Error(response.error || "API request failed");
    }
    return response.data;
    }
    catch (error) {
        throw error;
    }
}