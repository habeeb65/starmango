// Django REST Framework pagination response type
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Django REST Framework error response type
export interface DjangoError {
  detail?: string;
  non_field_errors?: string[];
  [key: string]: any;
}

// Django authentication token response
export interface AuthTokenResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId: string;
  };
}

// Django model timestamps
export interface DjangoTimestamps {
  created_at: string;
  updated_at: string;
}

// Django model with ID
export interface DjangoModel {
  id: string;
}

// Django tenant model
export interface DjangoTenant extends DjangoModel, DjangoTimestamps {
  name: string;
  logo: string | null;
  primary_color: string | null;
  is_active: boolean;
  owner: string;
}

// Django user model
export interface DjangoUser extends DjangoModel, DjangoTimestamps {
  email: string;
  name: string;
  role: string;
  tenant: string;
  avatar: string | null;
  is_active: boolean;
}

// Django product model
export interface DjangoProduct extends DjangoModel, DjangoTimestamps {
  name: string;
  description: string | null;
  sku: string;
  price: number;
  cost: number;
  quantity: number;
  tenant: string;
  lot_number: string | null;
  damage_count: number | null;
}

// Django vendor model
export interface DjangoVendor extends DjangoModel, DjangoTimestamps {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  tenant: string;
}

// Django customer model
export interface DjangoCustomer extends DjangoModel, DjangoTimestamps {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  credit_limit: number;
  current_credit: number;
  tenant: string;
}

// Django purchase item model
export interface DjangoPurchaseItem extends DjangoModel {
  purchase: string;
  product: string;
  quantity: number;
  unit_price: number;
  lot_number: string;
}

// Django purchase model
export interface DjangoPurchase extends DjangoModel, DjangoTimestamps {
  vendor: string;
  items: DjangoPurchaseItem[];
  total_amount: number;
  payment_status: "paid" | "partial" | "unpaid";
  payment_method: "cash" | "credit" | "bank_transfer" | null;
  notes: string | null;
  tenant: string;
}

// Django sale item model
export interface DjangoSaleItem extends DjangoModel {
  sale: string;
  product: string;
  quantity: number;
  unit_price: number;
  lot_number: string;
}

// Django sale model
export interface DjangoSale extends DjangoModel, DjangoTimestamps {
  customer: string;
  items: DjangoSaleItem[];
  total_amount: number;
  payment_status: "paid" | "partial" | "unpaid";
  payment_method: "cash" | "credit" | "bank_transfer" | null;
  notes: string | null;
  tenant: string;
}

// Django damage report model
export interface DjangoDamageReport extends DjangoModel, DjangoTimestamps {
  product: string;
  quantity: number;
  reason: string;
  lot_number: string;
  tenant: string;
}

// Django transaction model
export interface DjangoTransaction extends DjangoModel, DjangoTimestamps {
  type: "sale" | "purchase" | "payment_received" | "payment_made";
  amount: number;
  related_id: string;
  tenant: string;
}

// Django financial summary response
export interface DjangoFinancialSummary {
  total_sales: number;
  total_purchases: number;
  outstanding_payables: number;
  outstanding_receivables: number;
  profit_margin: number;
  daily_transactions: DjangoTransaction[];
}
