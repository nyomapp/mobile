import { apiClient } from "./client";
import { API_ENDPOINTS } from "./config";

export const getDeliveriesData = async (
  status: any,
  page: number = 1,
  limit: number = 10,
  filters?: {
    frameNumber?: string;
    mobileNumber?: string;
    modelRef?: string;
  }
) => {
  try {
    let endpoint =
      API_ENDPOINTS.DELIVERIES_HOME.GET.replace("{STATUS}", status) +
      `&page=${page}&limit=${limit}`;
    
    // Add filter parameters if provided
    if (filters) {
      if (filters.frameNumber && filters.frameNumber.trim()) {
        endpoint += `&chassisNo=${encodeURIComponent(filters.frameNumber.trim())}`;
      }
      if (filters.mobileNumber && filters.mobileNumber.trim()) {
        endpoint += `&mobileNumber=${encodeURIComponent(filters.mobileNumber.trim())}`;
      }
      if (filters.modelRef && filters.modelRef.trim()) {
        endpoint += `&modelRef=${encodeURIComponent(filters.modelRef.trim())}`;
      }
    }
    
    console.log("API Endpoint with filters:", endpoint);
    
    const response = await apiClient.get(endpoint);
    // Check if the API client returned an error response
    if (!response.success || response.error) {
      throw new Error(response.error || "API request failed");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteDeliveryById = async (id: any) => {
  try {
    const response = await apiClient.delete(
      API_ENDPOINTS.DELIVERIES_HOME.DELETE.replace(":deliveryId", id)
    );
    // Check if the API client returned an error response
    if (!response.success || response.error) {
      throw new Error(response.error || "API request failed");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateDeliveryById = async (id: any, data: any) => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.DELIVERIES_HOME.UPDATE.replace(":deliveryId", id),
      data
    );
    // Check if the API client returned an error response
    if (!response.success || response.error) {
      throw new Error(response.error || "API request failed");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
