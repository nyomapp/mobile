// Auth Types
export interface RequestOTPRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface RequestOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  data: {
    success: boolean;
    message: string;
    token?: string;
    user?: User;
  }

}

// User Types
export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  level?: {
    solo: number;
    team: number;
    pvp: number;
  };
  currentConsecutiveWins?: number;
  longestConsecutiveWins?: number;
  currentConsecutiveLosses?: number;
  longestConsecutiveLosses?: number;
  totalMatches?: number;
  totalWins?: number;
  streak?: number;
  gameCoins?: number;
  spentCoins?: number;
  earnedCoins?: number;
  firstTimeRewardClaimed?: boolean;
  verifiedEmail?: boolean;
  verifiedPhone?: boolean;
  emailVerificationToken?: string;
  phoneVerificationToken?: string;
  createdAt?: string;
  updatedAt?: string;
  profileData?: ProfileData[];
  deleted?: boolean;
  country?: string;
  isInMatch?: boolean;
  age?: string;
  preferences?: {
    language: string;
    notifications: {
      email: boolean;
      web: boolean;
      sms: boolean;
      mobile: boolean;
      inApp: boolean;
    };
    audio: boolean;
  };
  profileCompletion?: number;
  cash?: number;
  zipcode?: string;
  preferredLanguage?: string;
}

export interface ProfileData {
  question: string;
  questionId: string;
  answer: string;
  answerId?: string;
  type: 'input' | 'dropdown';
  question_shorthand: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipcode: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  zipcode?: string;
  country?: string;
  profileData?: ProfileData[];
  firstTimeRewardClaimed?: boolean;
  gameCoins?: number;
  preferredLanguage?: string;
}

export interface GetUsersByIdsRequest {
  ids: string[];
}

export interface ProfileQuestion {
  id: string;
  question: string;
  type: string;
  options?: string[];
}

export interface ProfileQuestionResponse {
  success: boolean;
  data: {
    success: boolean;
    country: string;
    sections: {
      questions: {
        questionId: string;
        question: string;
        question_shorthand: string;
        type: 'input' | 'dropdown';
        answers: {
          id: string;
          answer: string;
        }[];
      }[];
    }[];
  };
}

export interface FormData {
  [questionId: string]: {
    questionId: string;
    question: string;
    question_shorthand: string;
    answer: string;
    answerId?: string;
    type: 'input' | 'dropdown';
  };
}


export interface Transaction {
  id: string;
  userId: string;
  gameCoinsBefore: number;
  gameCoinsAfter: number;
  amount: number;
  gameType: 'solo' | 'pvp' | 'team';
  matchId?: string;
  type: 'debit' | 'credit' | 'redeem';
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}


export interface GetTransactionsRequest {
  gameType?: string;
  type?: string;
  status?: string;
  matchId?: string;
  sortBy?: 'createdAt' | 'amount' | 'type' | 'status' | 'gameType';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ReVerifyRequest {
  type: 'email' | 'phone';
  action: 'resend' | 'verify';
  email?: string;
  phone?: string;
  otp?: string;
}

export interface ReVerifyResponse {
  success: boolean;
  message: string;
}


// Team Types
export interface Team {
  id: string;
  name: string;
  description?: string;
  members?: User[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTeamRequest {
  name?: string;
  userIds: string[];
}

export interface UpdateTeamRequest {
  name?: string;
  userIds?: string[];
}

// Match Making Types
export interface CreateMatchRequest {
  loi: number;
  type: 'pvp' | 'team' | 'solo';
  entryCoins: number;
  teamId?: string;
  scheduledTimestamp?: string;
}

export interface MatchUpdate {
  transactionId: string;
  matchId: string;
  status: string;
  userId: string;
  rewards: string;
}

export interface MatchRequest {
  userId: string;
  teamId?: string;
  scheduledTimestamp?: string;
  loi: number;
  rank: number;
  level: number;
  country: string;
  type?: 'pvp' | 'team' | 'solo';
}

// Setup Types
export interface Avatar {
  id: string;
  type: 'male' | 'female' | 'group';
  url: string;
  name?: string;
}

export interface AvatarResponse {
  success: boolean;
  data: {
    success: boolean;
    avatars: string[];
  };
}


export interface Country {
  code: string;
  name: string;
}

export interface CountriesResponse {
  success: boolean;
  data: {
    countries: Country[];
  };
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

  constructor({ message, status, code }: { message: string; status?: number; code?: string }) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}