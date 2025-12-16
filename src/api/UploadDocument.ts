import { apiClient } from "./client";
import { API_ENDPOINTS } from "./config";

export const uploadDocument = async (formData: any) => {
    try {
        console.log("=== uploadDocument called with ===");
        console.log("Endpoint:", API_ENDPOINTS.ADD_DELIVERY.Upload_Documents);
        console.log("Payload:", JSON.stringify(formData, null, 2));
        console.log("=================================");

        const response = await apiClient.post(
            API_ENDPOINTS.ADD_DELIVERY.Upload_Documents,
            formData
        );

        // Check if the API client returned an error response
        if (!response.success || response.error) {      
            throw new Error(response.error || "API request failed");
        }

        console.log("Upload response success:", response.data);
        return response.data;
    } catch (error) {
        console.error("uploadDocument error:", error);
        throw error;
    }
}
export const updateDeliveryById = async (id: any, downloadDocuments: any) => {
  try {
    const payload = { downloadDocuments };
    // console.log("=== updateDeliveryById called ===");
    // console.log("Delivery ID:", id);
    // console.log("Payload:", JSON.stringify(payload, null, 2));
    // console.log("Endpoint:", API_ENDPOINTS.DELIVERIES_HOME.UPDATE.replace(":deliveryId", id));
    // console.log("================================");

    const response = await apiClient.patch(
      API_ENDPOINTS.DELIVERIES_HOME.UPDATE.replace(":deliveryId", id),
      payload
    );
    // Check if the API client returned an error response
    if (!response.success || response.error) {
      throw new Error(response.error || "API request failed");
    }
    return response.data;
  } catch (error) {
    console.error("updateDeliveryById error:", error);
    throw error;
  }
};