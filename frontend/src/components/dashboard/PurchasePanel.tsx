import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Purchase } from "@/types";
import { FileText, Plus } from "lucide-react";

// Mock data
const mockPurchases: Purchase[] = [
  {
    id: "1",
    vendorId: "201",
    products: [
      {
        productId: "1",
        quantity: 100,
        unitPrice: 18.5,
        lotNumber: "LOT-2023-05-A",
      },
    ],
    totalAmount: 1850.0,
    paymentStatus: "paid",
    paymentMethod: "bank_transfer",
    notes: "Regular vendor shipment",
    tenantId: "1",
    createdAt: "2023-05-10T09:30:00Z",
  },
  {
    id: "2",
    vendorId: "202",
    products: [
      {
        productId: "2",
        quantity: 80,
        unitPrice: 14.75,
        lotNumber: "LOT-2023-05-B",
      },
      {
        productId: "3",
        quantity: 120,
        unitPrice: 13.25,
        lotNumber: "LOT-2023-05-C",
      },
    ],
    totalAmount: 2770.0,
    paymentStatus: "partial",
    paymentMethod: "credit",
    notes: "Partial payment made",
    tenantId: "1",
    createdAt: "2023-05-12T11:15:00Z",
  },
  {
    id: "3",
    vendorId: "203",
    products: [
      {
        productId: "4",
        quantity: 50,
        unitPrice: 12.5,
        lotNumber: "LOT-2023-05-D",
      },
    ],
    totalAmount: 625.0,
    paymentStatus: "unpaid",
    notes: "Payment due in 30 days",
    tenantId: "1",
    createdAt: "2023-05-18T14:45:00Z",
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

export default function PurchasePanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Recent Purchases</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Purchase
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>
            Recent purchase orders and payment status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">PO #{purchase.id}</p>
                  <p className="text-sm text-muted-foreground">
                    Vendor ID: {purchase.vendorId} |{" "}
                    {formatDate(purchase.createdAt)}
                  </p>
                  <p className="text-sm">
                    {purchase.products.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}{" "}
                    units |
                    {purchase.paymentMethod &&
                      ` ${purchase.paymentMethod.replace("_", " ")}`}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-medium">
                    ${purchase.totalAmount.toFixed(2)}
                  </p>
                  {getStatusBadge(purchase.paymentStatus)}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
