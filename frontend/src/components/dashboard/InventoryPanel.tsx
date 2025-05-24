import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { useDjangoApi } from "@/hooks/useDjangoApi";
import { useTenant } from "@/context/TenantContext";

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Alphonso Mangoes",
    description: "Premium quality Alphonso mangoes",
    sku: "MNG-ALP-001",
    price: 24.99,
    cost: 18.5,
    quantity: 120,
    tenantId: "1",
    lotNumber: "LOT-2023-05-A",
    damageCount: 3,
    createdAt: "2023-05-10T10:00:00Z",
    updatedAt: "2023-05-10T10:00:00Z",
  },
  {
    id: "2",
    name: "Kesar Mangoes",
    description: "Sweet Kesar mangoes from Gujarat",
    sku: "MNG-KSR-002",
    price: 19.99,
    cost: 14.75,
    quantity: 85,
    tenantId: "1",
    lotNumber: "LOT-2023-05-B",
    damageCount: 5,
    createdAt: "2023-05-12T10:00:00Z",
    updatedAt: "2023-05-12T10:00:00Z",
  },
  {
    id: "3",
    name: "Banganapalli Mangoes",
    description: "Juicy Banganapalli mangoes",
    sku: "MNG-BNG-003",
    price: 18.5,
    cost: 13.25,
    quantity: 210,
    tenantId: "1",
    lotNumber: "LOT-2023-05-C",
    damageCount: 8,
    createdAt: "2023-05-15T10:00:00Z",
    updatedAt: "2023-05-15T10:00:00Z",
  },
  {
    id: "4",
    name: "Dasheri Mangoes",
    description: "Aromatic Dasheri mangoes",
    sku: "MNG-DSH-004",
    price: 16.99,
    cost: 12.5,
    quantity: 45,
    tenantId: "1",
    lotNumber: "LOT-2023-05-D",
    damageCount: 2,
    createdAt: "2023-05-18T10:00:00Z",
    updatedAt: "2023-05-18T10:00:00Z",
  },
];

const getStockStatus = (quantity: number) => {
  if (quantity <= 20) return { label: "Critical", color: "destructive" };
  if (quantity <= 50) return { label: "Low", color: "warning" };
  return { label: "Good", color: "success" };
};

export default function InventoryPanel() {
  const { currentTenant } = useTenant();
  const { data: products, loading, error, fetchData } = useDjangoApi<Product[]>();
  
  useEffect(() => {
    if (currentTenant?.id) {
      fetchData('/products/', { tenant_id: currentTenant.id });
    }
  }, [currentTenant]);

  const lowStockThreshold = 50;
  const productList = products || mockProducts;
  const lowStockItems = productList.filter(
    (product) => product.quantity <= lowStockThreshold,
  );
  const totalValue = productList.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">Loading inventory data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-red-600">Error loading inventory: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {lowStockItems.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
          <CardDescription>
            Overview of all products in stock for {currentTenant?.name || 'current tenant'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productList.map((product) => {
              const stockStatus = getStockStatus(product.quantity);
              const stockPercentage = Math.min(product.quantity, 200) / 2; // Max at 100%

              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <Badge
                        variant={
                          stockStatus.color as
                            | "default"
                            | "secondary"
                            | "destructive"
                            | "outline"
                        }
                      >
                        {stockStatus.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      SKU: {product.sku} | Lot: {product.lotNumber}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Price: ${product.price}</span>
                      <span>Cost: ${product.cost}</span>
                      {product.damageCount > 0 && (
                        <span className="text-red-600">
                          Damaged: {product.damageCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <div className="text-lg font-semibold mb-1">
                      {product.quantity} units
                    </div>
                    <Progress value={stockPercentage} className="w-20" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
