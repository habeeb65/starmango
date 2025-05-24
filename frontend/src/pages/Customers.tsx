import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Customers() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customer Management</h2>
        <p className="text-muted-foreground">
          Manage your customers and track their orders.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input placeholder="Search customers..." className="w-[300px]" />
          <Button variant="outline">Filter</Button>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              From 18 customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$284,750</div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,450</div>
            <p className="text-xs text-muted-foreground">
              From 8 customers
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            Manage your customer relationships and track orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[
              {
                name: "Metro Supermarket",
                contact: "Alice Brown",
                email: "alice@metro.com",
                status: "Active",
                orders: 45,
                revenue: 125000,
                outstanding: 0,
              },
              {
                name: "Fresh Market Ltd",
                contact: "Bob Wilson",
                email: "bob@freshmarket.com",
                status: "Active",
                orders: 32,
                revenue: 85000,
                outstanding: 12500,
              },
              {
                name: "City Grocers",
                contact: "Carol Davis",
                email: "carol@citygrocers.com",
                status: "Inactive",
                orders: 18,
                revenue: 42000,
                outstanding: 8200,
              },
            ].map((customer) => (
              <div key={customer.email} className="flex items-center">
                <div className="w-[250px]">
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.contact}</p>
                </div>
                <div className="w-[200px] text-sm text-muted-foreground">
                  {customer.email}
                </div>
                <div className="w-[100px]">
                  <Badge variant={customer.status === "Active" ? "outline" : "secondary"}>
                    {customer.status}
                  </Badge>
                </div>
                <div className="w-[100px] text-center">
                  {customer.orders} orders
                </div>
                <div className="w-[150px] text-right">
                  ${customer.revenue.toLocaleString()}
                </div>
                <div className="flex-1 text-right">
                  {customer.outstanding > 0 ? (
                    <span className="text-destructive">
                      ${customer.outstanding.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}