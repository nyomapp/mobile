import { apiClient } from "./client";
import { API_ENDPOINTS } from "./config";

export const getModalsData = async (makeId?: any) => {
  try {
    const id = makeId || "1";

    const response = await apiClient.get(
      API_ENDPOINTS.ADD_DELIVERY.GET_MODELS.replace("{makeId}", id)
    );

    // Check if the API client returned an error response
    if (!response.success || response.error) {
      // console.log('API: Error detected in response, throwing error...');
      throw new Error(response.error || "API request failed");
    }

    return response.data;
  } catch (error) {
    // Re-throw the error to ensure it reaches the component
    throw error;
  }
};
export const getAllMasterData = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.MasterData.GET);

    // Check if the API client returned an error response
    if (!response.success || response.error) {
      // console.log('API: Error detected in response, throwing error...');
      throw new Error(response.error || "API request failed");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllFinancierData = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.FINANCIERDATA.GET);

    // Check if the API client returned an error response
    if (!response.success || response.error) {
      // console.log('API: Error detected in response, throwing error...');
      throw new Error(response.error || "API request failed");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createDelivery = async (data: any) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.ADD_DELIVERY.CREATE, data);

    // Check if the API client returned an error response
    if (!response.success || response.error) {
      // console.log('API: Error detected in response, throwing error...');
      throw new Error(response.error || "API request failed");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
