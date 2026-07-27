import { apiClient } from "./client";
import { API_ENDPOINTS } from "./config";

export const getAllSearchedData = async (data?: any) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.SEARCH.GET_SEARCHED_DATA.replace("{chassisNumber}", data),
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

export const searchByCertificateNumber = async (certificateNumber: string) => {
  const response = await apiClient.get(
    API_ENDPOINTS.QR_SCAN.SEARCH_BY_CERT_NUMBER.replace(
      "{certificateNumber}",
      certificateNumber,
    ),
  );
  if (!response.success || response.error)
    throw new Error(response.error || "API request failed");
  return response.data;
};

export const searchByChassisNumber = async (chassisNumber: string) => {
  const response = await apiClient.get(
    API_ENDPOINTS.QR_SCAN.SEARCH_BY_CHASSIS.replace(
      "{chassisNumber}",
      chassisNumber,
    ),
  );
  if (!response.success || response.error)
    throw new Error(response.error || "API request failed");
  return response.data;
};

export const searchByMobileNumber = async (mobileNumber: string) => {
  const response = await apiClient.get(
    API_ENDPOINTS.QR_SCAN.SEARCH_BY_MOBILE.replace(
      "{mobileNumber}",
      mobileNumber,
    ),
  );
  if (!response.success || response.error)
    throw new Error(response.error || "API request failed");
  return response.data;
};

export const mapQRCodeToCertificate = async (
  qrCode: string,
  certificateId: string,
) => {
  const response = await apiClient.post(API_ENDPOINTS.QR_SCAN.MAP_QR, {
    qrCode,
    certificateId,
  });
  if (!response.success || response.error) {
    const err: any = new Error(response.error || "API request failed");
    err.isAlreadyMapped =
      (response.error || "").includes("502") ||
      (response.error || "").includes("already");
    throw err;
  }
  return response.data;
};
