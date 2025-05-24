import { supabase } from "@/lib/supabase";
import { Tenant, User, Product, Purchase, Sale } from "@/types";

// Tenant service
export const tenantService = {
  getTenants: async () => {
    const { data, error } = await supabase.from("tenants").select("*");

    if (error) throw error;

    return data.map(
      (tenant): Tenant => ({
        id: tenant.id,
        name: tenant.name,
        logo: tenant.logo || undefined,
        primaryColor: tenant.primary_color || undefined,
        active: tenant.is_active,
      }),
    );
  },

  getTenantById: async (id: string) => {
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      logo: data.logo || undefined,
      primaryColor: data.primary_color || undefined,
      active: data.is_active,
    } as Tenant;
  },

  createTenant: async (tenantData: Partial<Tenant>) => {
    const { data, error } = await supabase
      .from("tenants")
      .insert({
        name: tenantData.name,
        logo: tenantData.logo,
        primary_color: tenantData.primaryColor,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      logo: data.logo || undefined,
      primaryColor: data.primary_color || undefined,
      active: data.is_active,
    } as Tenant;
  },

  updateTenant: async (id: string, tenantData: Partial<Tenant>) => {
    const { data, error } = await supabase
      .from("tenants")
      .update({
        name: tenantData.name,
        logo: tenantData.logo,
        primary_color: tenantData.primaryColor,
        is_active: tenantData.active,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      logo: data.logo || undefined,
      primaryColor: data.primary_color || undefined,
      active: data.is_active,
    } as Tenant;
  },
};

// Product service
export const productService = {
  getProducts: async (tenantId: string) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("tenant_id", tenantId);

    if (error) throw error;

    return data.map(
      (product): Product => ({
        id: product.id,
        name: product.name,
        description: product.description || undefined,
        sku: product.sku,
        price: product.price,
        cost: product.cost,
        quantity: product.quantity,
        tenantId: product.tenant_id,
        lotNumber: product.lot_number || undefined,
        damageCount: product.damage_count || undefined,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      }),
    );
  },

  createProduct: async (productData: Partial<Product>) => {
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: productData.name,
        description: productData.description,
        sku: productData.sku,
        price: productData.price,
        cost: productData.cost,
        quantity: productData.quantity,
        tenant_id: productData.tenantId,
        lot_number: productData.lotNumber,
        damage_count: productData.damageCount,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      sku: data.sku,
      price: data.price,
      cost: data.cost,
      quantity: data.quantity,
      tenantId: data.tenant_id,
      lotNumber: data.lot_number || undefined,
      damageCount: data.damage_count || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Product;
  },

  updateProduct: async (id: string, productData: Partial<Product>) => {
    const { data, error } = await supabase
      .from("products")
      .update({
        name: productData.name,
        description: productData.description,
        sku: productData.sku,
        price: productData.price,
        cost: productData.cost,
        quantity: productData.quantity,
        tenant_id: productData.tenantId,
        lot_number: productData.lotNumber,
        damage_count: productData.damageCount,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      sku: data.sku,
      price: data.price,
      cost: data.cost,
      quantity: data.quantity,
      tenantId: data.tenant_id,
      lotNumber: data.lot_number || undefined,
      damageCount: data.damage_count || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Product;
  },

  deleteProduct: async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
  },
};

// Purchase service
export const purchaseService = {
  getPurchases: async (tenantId: string) => {
    const { data, error } = await supabase
      .from("purchases")
      .select("*")
      .eq("tenant_id", tenantId);

    if (error) throw error;

    return data;
  },
};

// Sale service
export const saleService = {
  getSales: async (tenantId: string) => {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("tenant_id", tenantId);

    if (error) throw error;

    return data;
  },
};
