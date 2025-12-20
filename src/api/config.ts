// API Configuration
export const API_CONFIG = {
  BASE_URL: "https://nyomx.com/api/v1/",
  // BASE_URL: "http://localhost:3000/v1/",
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    "Content-Type": "application/json",
    "x-request-channel": "mobile",
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  DashBoard: {
    GET_DATA: "deliveries/dashboard",
  },
  DELIVERIES_HOME: {
    GET: "deliveries?status={STATUS}",
    DELETE: "deliveries/:deliveryId",
    UPDATE: "deliveries/:deliveryId",
  },
  MasterData: {
    GET: "master",
  },
  FINANCIERDATA: {
    GET: "/financer",
  },
  ADD_DELIVERY: {
    CREATE: "/deliveries",
    GET_MODELS: "/models?makeId={makeId}",
    Upload_Documents: "upload/generate-upload-url",
  },
  PREVIEW: {
    GET_PDF_URL: "upload/generate-download-url/:fileKey",
  },
  SEARCH: {
    GET_SEARCHED_DATA: "/certificates/search?chassisNumber={chassisNumber}",
  },
  AUTH: {
    Login: "/auth/login",
  },
  USERS: {
    GET_BY_ID: "/users/:userId",
    UPDATE: "/users/:userId",
    CHANGE_PASSWORD: "auth/change-password",
  },
} as const;
