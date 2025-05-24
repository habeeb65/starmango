import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types";
import { FileText, Plus } from "lucide-react";
import { useDjangoApi } from "@/hooks/useDjangoApi";
import { useTenant } from "@/context/TenantContext";

// Mock data
const mockSales: Sale[] = [
  {
    id: "1",
    customerId: "101",
    products: [
      {
        productId: "1",
        quantity: 50,
        unitPrice: 24.99,
        lotNumber: "LOT-2023-05-A",
      },
      {
        productId: "2",
        quantity: 30,
        unitPrice: 19.99,
        lotNumber: "LOT-2023-05-B",
      },
    ],
    totalAmount: 1849.2,
    paymentStatus: "paid",
    paymentMethod: "bank_transfer",
    notes: "Regular customer order",
    tenantId: "1",
    createdAt: "2023-05-20T14:30:00Z",
  },
  {
    id: "2",
    customerId: "102",
    products: [
      {
        productId: "3",
        quantity: 40,
        unitPrice: 18.5,
        lotNumber: "LOT-2023-05-C",
      },
    ],
    totalAmount: 740.0,
    paymentStatus: "partial",
    paymentMethod: "credit",
    notes: "Partial payment received",
    tenantId: "1",
    createdAt: "2023-05-21T10:15:00Z",
  },
  {
    id: "3",
    customerId: "103",
    products: [
      {
        productId: "1",
        quantity: 25,
        unitPrice: 24.99,
        lotNumber: "LOT-2023-05-A",
      },
      {
        productId: "4",
        quantity: 15,
        unitPrice: 16.99,
        lotNumber: "LOT-2023-05-D",
      },
    ],
    totalAmount: 879.6,
    paymentStatus: "unpaid",
    notes: "New customer order",
    tenantId: "1",
    createdAt: "2023-05-22T16:45:00Z",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-green-500">Paid</Badge>;
    case "partial":
      return <Badge className="bg-yellow-500">Partial</Badge>;
    case "unpaid":
      return <Badge className="bg-red-500">Unpaid</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function SalesPanel() {
  const { currentTenant } = useTenant();
  const { data: sales, loading, error, fetchData } = useDjangoApi<Sale[]>();
  
  useEffect(() => {
    if (currentTenant?.id) {
      fetchData('/sales/', { tenant_id: currentTenant.id });
    }
  }, [currentTenant]);

  const salesList = sales || mockSales;
  const totalSales = salesList.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0,
  );
  const paidSales = salesList.filter(
    (sale) => sale.paymentStatus === "paid",
  ).length;
  const pendingSales = salesList.filter(
    (sale) => sale.paymentStatus === "pending",
  ).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">Loading sales data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-red-600">Error loading sales: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidSales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingSales}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Sales
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Sale
            </Button>
          </CardTitle>
          <CardDescription>Latest sales transactions for {currentTenant?.name || 'current tenant'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesList.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">Sale #{sale.id}</h4>
                    <Badge
                      variant={
                        sale.paymentStatus === "paid"
                          ? "default"
                          : sale.paymentStatus === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {sale.paymentStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Customer: {sale.customerId} | Method: {sale.paymentMethod}
                  </p>
                  <div className="text-sm">
                    Products: {sale.products.length} items
                    {sale.notes && (
                      <span className="ml-2 text-muted-foreground">
                        • {sale.notes}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    ${sale.totalAmount.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-2">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
