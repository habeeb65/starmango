import {
  Tenant,
  User,
  Product,
  Vendor,
  Customer,
  Purchase,
  PurchaseItem,
  Sale,
  SaleItem,
  DamageReport,
  Transaction,
  FinancialSummary,
} from "@/types";

import {
  DjangoTenant,
  DjangoUser,
  DjangoProduct,
  DjangoVendor,
  DjangoCustomer,
  DjangoPurchase,
  DjangoPurchaseItem,
  DjangoSale,
  DjangoSaleItem,
  DjangoDamageReport,
  DjangoTransaction,
  DjangoFinancialSummary,
} from "@/types/django";

// Convert Django models to frontend models
export const adaptTenant = (djangoTenant: DjangoTenant): Tenant => ({
  id: djangoTenant.id,
  name: djangoTenant.name,
  logo: djangoTenant.logo || undefined,
  primaryColor: djangoTenant.primary_color || undefined,
  active: djangoTenant.is_active,
});

export const adaptUser = (djangoUser: DjangoUser): User => ({
  id: djangoUser.id,
  email: djangoUser.email,
  name: djangoUser.name,
  role: djangoUser.role as "admin" | "manager" | "staff",
  tenantId: djangoUser.tenant,
  avatar: djangoUser.avatar || undefined,
});

export const adaptProduct = (djangoProduct: DjangoProduct): Product => ({
  id: djangoProduct.id,
  name: djangoProduct.name,
  description: djangoProduct.description || undefined,
  sku: djangoProduct.sku,
  price: djangoProduct.price,
  cost: djangoProduct.cost,
  quantity: djangoProduct.quantity,
  tenantId: djangoProduct.tenant,
  lotNumber: djangoProduct.lot_number || undefined,
  damageCount: djangoProduct.damage_count || undefined,
  createdAt: djangoProduct.created_at,
  updatedAt: djangoProduct.updated_at,
});

export const adaptVendor = (djangoVendor: DjangoVendor): Vendor => ({
  id: djangoVendor.id,
  name: djangoVendor.name,
  email: djangoVendor.email || undefined,
  phone: djangoVendor.phone || undefined,
  address: djangoVendor.address || undefined,
  tenantId: djangoVendor.tenant,
});

export const adaptCustomer = (djangoCustomer: DjangoCustomer): Customer => ({
  id: djangoCustomer.id,
  name: djangoCustomer.name,
  email: djangoCustomer.email || undefined,
  phone: djangoCustomer.phone || undefined,
  address: djangoCustomer.address || undefined,
  creditLimit: djangoCustomer.credit_limit,
  currentCredit: djangoCustomer.current_credit,
  tenantId: djangoCustomer.tenant,
});

export const adaptPurchaseItem = (
  djangoPurchaseItem: DjangoPurchaseItem,
): PurchaseItem => ({
  productId: djangoPurchaseItem.product,
  quantity: djangoPurchaseItem.quantity,
  unitPrice: djangoPurchaseItem.unit_price,
  lotNumber: djangoPurchaseItem.lot_number,
});

export const adaptPurchase = (djangoPurchase: DjangoPurchase): Purchase => ({
  id: djangoPurchase.id,
  vendorId: djangoPurchase.vendor,
  products: djangoPurchase.items.map(adaptPurchaseItem),
  totalAmount: djangoPurchase.total_amount,
  paymentStatus: djangoPurchase.payment_status,
  paymentMethod: djangoPurchase.payment_method || undefined,
  notes: djangoPurchase.notes || undefined,
  tenantId: djangoPurchase.tenant,
  createdAt: djangoPurchase.created_at,
});

export const adaptSaleItem = (djangoSaleItem: DjangoSaleItem): SaleItem => ({
  productId: djangoSaleItem.product,
  quantity: djangoSaleItem.quantity,
  unitPrice: djangoSaleItem.unit_price,
  lotNumber: djangoSaleItem.lot_number,
});

export const adaptSale = (djangoSale: DjangoSale): Sale => ({
  id: djangoSale.id,
  customerId: djangoSale.customer,
  products: djangoSale.items.map(adaptSaleItem),
  totalAmount: djangoSale.total_amount,
  paymentStatus: djangoSale.payment_status,
  paymentMethod: djangoSale.payment_method || undefined,
  notes: djangoSale.notes || undefined,
  tenantId: djangoSale.tenant,
  createdAt: djangoSale.created_at,
});

export const adaptDamageReport = (
  djangoDamageReport: DjangoDamageReport,
): DamageReport => ({
  id: djangoDamageReport.id,
  productId: djangoDamageReport.product,
  quantity: djangoDamageReport.quantity,
  reason: djangoDamageReport.reason,
  lotNumber: djangoDamageReport.lot_number,
  tenantId: djangoDamageReport.tenant,
  createdAt: djangoDamageReport.created_at,
});

export const adaptTransaction = (
  djangoTransaction: DjangoTransaction,
): Transaction => ({
  id: djangoTransaction.id,
  type: djangoTransaction.type,
  amount: djangoTransaction.amount,
  relatedId: djangoTransaction.related_id,
  tenantId: djangoTransaction.tenant,
  createdAt: djangoTransaction.created_at,
});

export const adaptFinancialSummary = (
  djangoFinancialSummary: DjangoFinancialSummary,
): FinancialSummary => ({
  totalSales: djangoFinancialSummary.total_sales,
  totalPurchases: djangoFinancialSummary.total_purchases,
  outstandingPayables: djangoFinancialSummary.outstanding_payables,
  outstandingReceivables: djangoFinancialSummary.outstanding_receivables,
  profitMargin: djangoFinancialSummary.profit_margin,
  dailyTransactions:
    djangoFinancialSummary.daily_transactions.map(adaptTransaction),
});

// Convert frontend models to Django models for sending to API
export const prepareTenantForDjango = (tenant: Partial<Tenant>) => ({
  name: tenant.name,
  logo: tenant.logo || null,
  primary_color: tenant.primaryColor || null,
  is_active: tenant.active !== undefined ? tenant.active : true,
});

export const prepareProductForDjango = (product: Partial<Product>) => ({
  name: product.name,
  description: product.description || null,
  sku: product.sku,
  price: product.price,
  cost: product.cost,
  quantity: product.quantity,
  tenant: product.tenantId,
  lot_number: product.lotNumber || null,
  damage_count: product.damageCount || null,
});

export const prepareVendorForDjango = (vendor: Partial<Vendor>) => ({
  name: vendor.name,
  email: vendor.email || null,
  phone: vendor.phone || null,
  address: vendor.address || null,
  tenant: vendor.tenantId,
});

export const prepareCustomerForDjango = (customer: Partial<Customer>) => ({
  name: customer.name,
  email: customer.email || null,
  phone: customer.phone || null,
  address: customer.address || null,
  credit_limit: customer.creditLimit,
  current_credit: customer.currentCredit,
  tenant: customer.tenantId,
});

export const preparePurchaseItemForDjango = (item: PurchaseItem) => ({
  product: item.productId,
  quantity: item.quantity,
  unit_price: item.unitPrice,
  lot_number: item.lotNumber,
});

export const preparePurchaseForDjango = (purchase: Partial<Purchase>) => ({
  vendor: purchase.vendorId,
  items: purchase.products?.map(preparePurchaseItemForDjango),
  total_amount: purchase.totalAmount,
  payment_status: purchase.paymentStatus,
  payment_method: purchase.paymentMethod || null,
  notes: purchase.notes || null,
  tenant: purchase.tenantId,
});

export const prepareSaleItemForDjango = (item: SaleItem) => ({
  product: item.productId,
  quantity: item.quantity,
  unit_price: item.unitPrice,
  lot_number: item.lotNumber,
});

export const prepareSaleForDjango = (sale: Partial<Sale>) => ({
  customer: sale.customerId,
  items: sale.products?.map(prepareSaleItemForDjango),
  total_amount: sale.totalAmount,
  payment_status: sale.paymentStatus,
  payment_method: sale.paymentMethod || null,
  notes: sale.notes || null,
  tenant: sale.tenantId,
});

export const prepareDamageReportForDjango = (
  damageReport: Partial<DamageReport>,
) => ({
  product: damageReport.productId,
  quantity: damageReport.quantity,
  reason: damageReport.reason,
  lot_number: damageReport.lotNumber,
  tenant: damageReport.tenantId,
});
