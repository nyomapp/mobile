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
    startDate?: string;
    endDate?: string;
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
      if (filters.startDate && filters.startDate.trim()) {
        endpoint += `&startDate=${encodeURIComponent(filters.startDate.trim())}`;
      }
      if (filters.endDate && filters.endDate.trim()) {
        endpoint += `&endDate=${encodeURIComponent(filters.endDate.trim())}`;
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
export const downloadCombineAadhaar  = async (frameNumber: any) => {
try {
    const url = API_ENDPOINTS.DELIVERIES_HOME.DOWNLOAD_COMBINED_AADHAAR.replace("{frameNumber}", frameNumber);
    const fullUrl = apiClient.baseURL + url;
    const res = await fetch(fullUrl, { method: 'GET' });
    if (!res.ok) {
      throw new Error('Failed to download Combined Aadhaar PDF');
    }
    const blob = await res.blob();
    return blob;
} catch (error) {
  throw error;
}
};
export const downloadCombineForm20  = async (frameNumber: any) => {
try {
    const url = API_ENDPOINTS.DELIVERIES_HOME.DOWNLOAD_COMBINED_FORM20.replace("{frameNumber}", frameNumber);
    const fullUrl = apiClient.baseURL + url;
    const res = await fetch(fullUrl, { method: 'GET' });
    if (!res.ok) {
      throw new Error('Failed to download Combined Form 20 PDF');
    }
    const blob = await res.blob();
    return blob;
} catch (error) {
  throw error;
}
};
export const downloadCombineZip  = async (frameNumber: any,customerName:any, createdAt:any) => {
try {
      const url = API_ENDPOINTS.DELIVERIES_HOME.DOWNLOAD_ALL_ZIP
        .replace("{frameNumber}", frameNumber)
        .replace("{customerName}", customerName)
        .replace("{date}", createdAt);
    const fullUrl = apiClient.baseURL + url;
    const res = await fetch(fullUrl, { method: 'GET' });
    if (!res.ok) {
      let errText: string | null = null;
      try {
        errText = await res.text();
      } catch (e) {
        // ignore
      }
      if (errText) {
        try {
          const parsed = JSON.parse(errText);
          errText = parsed?.message || errText;
        } catch (e) {
          // not JSON, keep text
        }
      }
      throw new Error(errText || `HTTP ${res.status}: ${res.statusText}`);
    }
    const blob = await res.blob();
    return blob;
} catch (error) {
  throw error;
}
};
export const generatePdfUrl  = async (url: any) => {
try {
    const response=await apiClient.get(API_ENDPOINTS.DELIVERIES_HOME.GENERATE_PDF_URL.replace("{url}", url));
    // Check if the API client returned an error response
    if (!response.success || response.error) {
      throw new Error(response.error || "API request failed");
    }
    return response.data;
} catch (error) {
  throw error
}
};