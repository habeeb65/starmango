import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Vendors() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Vendor Management</h2>
        <p className="text-muted-foreground">
          Manage your suppliers and track vendor relationships.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input placeholder="Search vendors..." className="w-[300px]" />
          <Button variant="outline">Filter</Button>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              With 5 vendors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,750</div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">
              To 3 vendors
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor List</CardTitle>
          <CardDescription>
            Manage your vendor relationships and track performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[
              {
                name: "Fresh Farms Ltd",
                contact: "John Smith",
                email: "john@freshfarms.com",
                status: "Active",
                orders: 12,
                spend: 45000,
              },
              {
                name: "Global Fruits Co",
                contact: "Sarah Johnson",
                email: "sarah@globalfruits.com",
                status: "Active",
                orders: 8,
                spend: 32000,
              },
              {
                name: "Organic Produce Inc",
                contact: "Mike Wilson",
                email: "mike@organicproduce.com",
                status: "Inactive",
                orders: 0,
                spend: 28000,
              },
            ].map((vendor) => (
              <div key={vendor.email} className="flex items-center">
                <div className="w-[250px]">
                  <p className="font-medium">{vendor.name}</p>
                  <p className="text-sm text-muted-foreground">{vendor.contact}</p>
                </div>
                <div className="w-[200px] text-sm text-muted-foreground">
                  {vendor.email}
                </div>
                <div className="w-[100px]">
                  <Badge variant={vendor.status === "Active" ? "outline" : "secondary"}>
                    {vendor.status}
                  </Badge>
                </div>
                <div className="w-[100px] text-center">
                  {vendor.orders} orders
                </div>
                <div className="flex-1 text-right">
                  ${vendor.spend.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}