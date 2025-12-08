// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
}
// User Types
export interface User {
  role: string;
  userType: string;
  permissions: string[];
  mainDealerRef: {
    name: string;
    email: string;
    tradeName: string;
    oemRef: {
      _id: string;
      name: string;
    };
    stateRef: {
      _id: string;
      name: string;
      code: string;
    };
    code: string;
    id: string;
  };
  dealerRef: any;
  status: boolean;
  isEmailVerified: boolean;
  isInvoiceEnabled: boolean;
  isCombo: boolean;
  name: string;
  email: string;
  contactPersonMobile: string;
  locationRef: {
    code: string;
    title: string;
    id: string;
  };
  adhaar: string;
  id: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  zipcode?: string;
  country?: string;
  firstTimeRewardClaimed?: boolean;
  gameCoins?: number;
  preferredLanguage?: string;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Error Types
export class APIError extends Error {
  status?: number;
  code?: string;

  constructor({
    message,
    status,
    code,
  }: {
    message: string;
    status?: number;
    code?: string;
  }) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.code = code;
  }
}
