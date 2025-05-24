import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Purchases() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Purchase Orders</h2>
        <p className="text-muted-foreground">
          Manage your purchase orders and vendor transactions.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input placeholder="Search purchases..." className="w-[300px]" />
          <Button variant="outline">Filter</Button>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Purchase Order
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,563.12</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Awaiting delivery
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,231.89</div>
            <p className="text-xs text-muted-foreground">
              Due this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Purchase Orders</CardTitle>
          <CardDescription>
            Track and manage your recent purchase orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[
              {
                id: "PO-2024-001",
                vendor: "Fresh Farms Ltd",
                amount: 12500,
                status: "Delivered",
                payment: "Paid",
                date: "2024-05-15",
              },
              {
                id: "PO-2024-002",
                vendor: "Global Fruits Co",
                amount: 8750,
                status: "Pending",
                payment: "Unpaid",
                date: "2024-05-14",
              },
              {
                id: "PO-2024-003",
                vendor: "Organic Produce Inc",
                amount: 15200,
                status: "Processing",
                payment: "Partial",
                date: "2024-05-13",
              },
            ].map((order) => (
              <div key={order.id} className="flex items-center">
                <div className="w-[200px]">
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.vendor}</p>
                </div>
                <div className="w-[150px]">
                  <Badge variant="outline">{order.status}</Badge>
                </div>
                <div className="w-[150px]">
                  <Badge 
                    variant={
                      order.payment === "Paid" 
                        ? "outline" 
                        : order.payment === "Partial" 
                        ? "secondary" 
                        : "destructive"
                    }
                  >
                    {order.payment}
                  </Badge>
                </div>
                <div className="flex-1 text-right">
                  ${order.amount.toLocaleString()}
                </div>
                <div className="ml-4 w-[100px] text-right text-sm text-muted-foreground">
                  {new Date(order.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}