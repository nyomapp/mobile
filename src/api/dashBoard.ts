import { apiClient } from "./client";
import { API_ENDPOINTS } from "./config";

export const getDashBoardData = async (filters?: any) => {
  try {
    let endPoint: string = API_ENDPOINTS.DashBoard.GET_DATA;

    // Build query parameters from filters object
    if (filters && Object.keys(filters).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        endPoint = `${endPoint}?${queryString}`;
      }
    }

    const response = await apiClient.get(endPoint);
    // Check if the API client returned an error response
    if (!response.success || response.error) {
      throw new Error(response.error || "API request failed");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
