import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Sales() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sales Management</h2>
        <p className="text-muted-foreground">
          Track sales, manage invoices, and monitor revenue.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input placeholder="Search sales..." className="w-[300px]" />
          <Button variant="outline">Filter</Button>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,250</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>
            Track and manage your recent sales and invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[
              {
                id: "INV-2024-001",
                customer: "Metro Supermarket",
                amount: 8500,
                status: "Paid",
                date: "2024-05-15",
              },
              {
                id: "INV-2024-002",
                customer: "Fresh Market Ltd",
                amount: 12750,
                status: "Pending",
                date: "2024-05-14",
              },
              {
                id: "INV-2024-003",
                customer: "City Grocers",
                amount: 6200,
                status: "Overdue",
                date: "2024-05-13",
              },
            ].map((sale) => (
              <div key={sale.id} className="flex items-center">
                <div className="w-[200px]">
                  <p className="font-medium">{sale.id}</p>
                  <p className="text-sm text-muted-foreground">{sale.customer}</p>
                </div>
                <div className="w-[150px]">
                  <Badge 
                    variant={
                      sale.status === "Paid" 
                        ? "outline" 
                        : sale.status === "Pending" 
                        ? "secondary" 
                        : "destructive"
                    }
                  >
                    {sale.status}
                  </Badge>
                </div>
                <div className="flex-1 text-right">
                  ${sale.amount.toLocaleString()}
                </div>
                <div className="ml-4 w-[100px] text-right text-sm text-muted-foreground">
                  {new Date(sale.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}