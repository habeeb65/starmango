import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  AlertCircle,
} from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
  currentCredit: number;
  status: "active" | "inactive";
  lastOrderDate: string;
  totalOrders: number;
  totalSpent: number;
  paymentStatus: "good" | "warning" | "overdue";
};

// Mock data
const mockCustomers: Customer[] = [
  {
    id: "c1",
    name: "Fresh Mart Supermarket",
    email: "orders@freshmart.com",
    phone: "+91 98765 12345",
    address: "123 Market Street, Mumbai, Maharashtra, India",
    creditLimit: 50000,
    currentCredit: 32500,
    status: "active",
    lastOrderDate: "2023-05-20",
    totalOrders: 28,
    totalSpent: 245000,
    paymentStatus: "good",
  },
  {
    id: "c2",
    name: "Fruit World",
    email: "purchasing@fruitworld.com",
    phone: "+91 87654 56789",
    address: "456 Retail Avenue, Delhi, India",
    creditLimit: 30000,
    currentCredit: 27500,
    status: "active",
    lastOrderDate: "2023-05-18",
    totalOrders: 15,
    totalSpent: 175000,
    paymentStatus: "warning",
  },
  {
    id: "c3",
    name: "Organic Foods Co.",
    email: "supply@organicfoods.com",
    phone: "+91 76543 21098",
    address: "789 Green Street, Bangalore, Karnataka, India",
    creditLimit: 25000,
    currentCredit: 25000,
    status: "active",
    lastOrderDate: "2023-05-15",
    totalOrders: 12,
    totalSpent: 120000,
    paymentStatus: "overdue",
  },
  {
    id: "c4",
    name: "City Grocers",
    email: "info@citygrocers.com",
    phone: "+91 65432 10987",
    address: "101 Urban Plaza, Chennai, Tamil Nadu, India",
    creditLimit: 40000,
    currentCredit: 15000,
    status: "inactive",
    lastOrderDate: "2023-04-30",
    totalOrders: 8,
    totalSpent: 95000,
    paymentStatus: "good",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getCreditStatusColor = (status: string) => {
  switch (status) {
    case "good":
      return "bg-green-500";
    case "warning":
      return "bg-yellow-500";
    case "overdue":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export default function CustomerManagementPanel() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Customer Management</h3>
        <div className="flex gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>
            Manage your customers and track credit limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No customers found matching your search
                </p>
              </div>
            ) : (
              filteredCustomers.map((customer) => {
                const creditUsagePercent =
                  (customer.currentCredit / customer.creditLimit) * 100;

                return (
                  <div
                    key={customer.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{customer.name}</h4>
                          <Badge
                            variant={
                              customer.status === "active"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {customer.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </Badge>
                          {customer.paymentStatus === "overdue" && (
                            <Badge
                              variant="destructive"
                              className="flex items-center gap-1"
                            >
                              <AlertCircle className="h-3 w-3" />
                              Overdue
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {customer.totalOrders} orders •{" "}
                          {formatCurrency(customer.totalSpent)} lifetime value
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Order History
                        </Button>
                        <Button size="sm">New Invoice</Button>
                      </div>
                    </div>

                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${customer.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {customer.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${customer.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {customer.phone}
                        </a>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>{customer.address}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Credit Usage
                        </span>
                        <span className="text-sm ml-auto">
                          {formatCurrency(customer.currentCredit)} /{" "}
                          {formatCurrency(customer.creditLimit)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <Progress
                          value={creditUsagePercent}
                          className="h-2"
                          indicatorClassName={getCreditStatusColor(
                            customer.paymentStatus,
                          )}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Last Order: {formatDate(customer.lastOrderDate)}
                          </span>
                          <span>
                            {customer.paymentStatus === "good" &&
                              "Good Standing"}
                            {customer.paymentStatus === "warning" &&
                              "Approaching Limit"}
                            {customer.paymentStatus === "overdue" &&
                              "Payment Overdue"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
