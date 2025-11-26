// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://staging.services.opinionx.ai',
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'x-request-channel': 'mobile',
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REQUEST_OTP: '/auth/request-otp',
    VERIFY_OTP: '/auth/verify-otp',
    RE_VERIFY_RESEND: '/auth/phone/re-verify/resend',
    RE_VERIFY: '/auth/:type/re-verify/:action',
  },
  USERS: {
    CREATE: '/users',
    GET_ALL: '/users',
    GET_BY_ID: '/users/:userId',
    GET_BY_IDS: '/users/list',
    UPDATE: '/users/:userId',
    DELETE: '/users/:userId',
    PROFILE_QUESTIONS: '/users/profile-questions',
    GET_TEAMS: '/users/:userId/teams',
    GET_TRANSACTIONS: '/users/transactions',
  },
  TEAMS: {
    GET_ALL: '/teams',
    GET_BY_ID: '/teams/:id',
    CREATE: '/teams',
    UPDATE: '/teams/:id',
  },
  MATCH_MAKING: {
    POST_UPDATES: '/match/updates/webhook',
    CREATE_REQUEST: '/match-requests/create',
    CHECK_ASSIGNMENT: '/match-requests/:id/assign',
    CANCEL_REQUEST: '/match-requests/:id/cancel',
    START_MATCH: '/matches/:id/start',
    GET_STATUS: '/matches/:id/status',
  },
  SETUP: {
    GET_AVATARS: '/setup/avatars/:type',
    GET_COUNTRIES: '/setup/countries',
  },
  LEADERBOARD: {
    GET_RANKINGS: '/leaderboard/rankings',
  },
  FRIENDS: {
    LIST: '/friends',
    SEND_REQUEST: '/friends/requests',
    GET_REQUESTS: '/friends/requests',
    GET_BLOCKED: '/friends/blocked',
    ACCEPT_REQUEST: '/friends/requests/:id/accept',
    DECLINE_REQUEST: '/friends/requests/:id/decline',
    DELETE_REQUEST: '/friends/requests/:id/remove',
    UNFRIEND: '/friends/:userId/unfriend',
    BLOCK: '/friends/:userId/block',
    UNBLOCK: '/friends/:userId/block',
  },
  NOTIFICATIONS: {
    GET_ALL: '/notifications',
    MARK_READ: '/notifications/:id/read',
    DELETE: '/notifications/:id',
    REGISTER_DEVICE: '/notifications/devices/register',
    UNREGISTER_DEVICE: '/notifications/devices/unregister',
  },
} as const;