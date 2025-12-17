import { apiClient } from "./client";
import { API_ENDPOINTS } from "./config";

export const getAllSearchedData = async (data?: any) => {
  try {

    const response = await apiClient.get(
      API_ENDPOINTS.SEARCH.GET_SEARCHED_DATA.replace("{chassisNumber}", data)
    );

    // Check if the API client returned an error response
    if (!response.success || response.error) {      
      throw new Error(response.error || "API request failed");
    }

    return response.data;
  } catch (error) {
    // Re-throw the error to ensure it reaches the component
    throw error;
  }
};
