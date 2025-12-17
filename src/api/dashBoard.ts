import { apiClient } from "./client";
import { API_ENDPOINTS } from "./config";

export const getDashBoardData = async (
) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.DashBoard.GET_DATA);
    // Check if the API client returned an error response
    if (!response.success || response.error) {
      throw new Error(response.error || "API request failed");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

