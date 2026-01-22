import { apiClient } from "./client";
import { API_ENDPOINTS } from "./config";

export const getFinanciers = async () => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.DEALAR_DASHBOARD.GET_FINANCIERS,
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
export const getExecutives = async () => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.DEALAR_DASHBOARD.GET_EXECUTIVES,
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
