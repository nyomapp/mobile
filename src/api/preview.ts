import { apiClient } from "./client";
import { API_ENDPOINTS } from "./config";

export const getPdfUrl = async (makeId?: any) => {
  try {
    const id = makeId || "1";

    const response = await apiClient.get(
      API_ENDPOINTS.PREVIEW.GET_PDF_URL.replace(":fileKey", id)
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
