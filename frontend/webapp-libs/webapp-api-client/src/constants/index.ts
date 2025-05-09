export const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    REFRESH: '/auth/refresh/',
  },
  VENDOR: {
    LIST: '/vendor/',
    DETAIL: (id: number) => `/vendor/${id}/`,
    INVOICES: (id: number) => `/vendor/${id}/invoices/`,
  },
  CUSTOMER: {
    LIST: '/customer/',
    DETAIL: (id: number) => `/customer/${id}/`,
    INVOICES: (id: number) => `/customer/${id}/invoices/`,
  },
  INVOICE: {
    LIST: '/invoice/',
    DETAIL: (id: number) => `/invoice/${id}/`,
    PDF: (id: number) => `/invoice/${id}/pdf/`,
  },
  INVENTORY: {
    LIST: '/inventory/',
    DETAIL: (id: number) => `/inventory/${id}/`,
  },
  PAYMENT: {
    VENDOR_BULK: '/payment/vendor/bulk/',
    CUSTOMER_BULK: '/payment/customer/bulk/',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const PAYMENT_MODES = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  CHEQUE: 'cheque',
  UPI: 'upi',
} as const;

export const INVOICE_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
} as const; 