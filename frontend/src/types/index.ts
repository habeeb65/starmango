export interface Tenant {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  active: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "staff";
  tenantId: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  cost: number;
  quantity: number;
  tenantId: string;
  lotNumber?: string;
  damageCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  tenantId: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  creditLimit: number;
  currentCredit: number;
  tenantId: string;
}

export interface Purchase {
  id: string;
  vendorId: string;
  products: PurchaseItem[];
  totalAmount: number;
  paymentStatus: "paid" | "partial" | "unpaid";
  paymentMethod?: "cash" | "credit" | "bank_transfer";
  notes?: string;
  tenantId: string;
  createdAt: string;
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  lotNumber: string;
}

export interface Sale {
  id: string;
  customerId: string;
  products: SaleItem[];
  totalAmount: number;
  paymentStatus: "paid" | "partial" | "unpaid";
  paymentMethod?: "cash" | "credit" | "bank_transfer";
  notes?: string;
  tenantId: string;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  lotNumber: string;
}

export interface DamageReport {
  id: string;
  productId: string;
  quantity: number;
  reason: string;
  lotNumber: string;
  tenantId: string;
  createdAt: string;
}

export interface FinancialSummary {
  totalSales: number;
  totalPurchases: number;
  outstandingPayables: number;
  outstandingReceivables: number;
  profitMargin: number;
  dailyTransactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: "sale" | "purchase" | "payment_received" | "payment_made";
  amount: number;
  relatedId: string;
  tenantId: string;
  createdAt: string;
}
