// Common types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Vendor types
export interface Vendor {
  id: number;
  name: string;
  contact_number: string;
  area: string;
  total_purchases?: number;
  outstanding_amount?: number;
}

// Customer types
export interface Customer {
  id: number;
  name: string;
  contact_number: string;
  area: string;
  total_sales?: number;
  outstanding_amount?: number;
}

// Invoice types
export interface Invoice {
  id: number;
  invoice_number: string;
  date: string;
  vendor_name?: string;
  customer_name?: string;
  net_total: number;
  status: 'paid' | 'pending' | 'overdue';
  due_date?: string;
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Inventory types
export interface Product {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  category: string;
  sku: string;
}

// Payment types
export interface Payment {
  id: number;
  amount: number;
  date: string;
  payment_mode: string;
  reference_number?: string;
  notes?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  tenantName: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    tenant: {
      id: number;
      name: string;
    };
  };
} 