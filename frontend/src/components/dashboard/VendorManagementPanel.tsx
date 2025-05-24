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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Star,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";

type Vendor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  status: "active" | "inactive";
  productsSupplied: string[];
  lastOrderDate: string;
  paymentTerms: string;
};

// Mock data
const mockVendors: Vendor[] = [
  {
    id: "v1",
    name: "Ratnagiri Farms",
    email: "contact@ratnagirifarms.com",
    phone: "+91 98765 43210",
    address: "123 Coastal Highway, Ratnagiri, Maharashtra, India",
    rating: 4.8,
    status: "active",
    productsSupplied: ["Alphonso Mangoes", "Coconuts", "Cashews"],
    lastOrderDate: "2023-05-15",
    paymentTerms: "Net 30",
  },
  {
    id: "v2",
    name: "Gujarat Orchards",
    email: "info@gujaratorchards.com",
    phone: "+91 95555 12345",
    address: "456 Farm Road, Junagadh, Gujarat, India",
    rating: 4.5,
    status: "active",
    productsSupplied: ["Kesar Mangoes", "Chikoo", "Pomegranates"],
    lastOrderDate: "2023-05-12",
    paymentTerms: "Net 15",
  },
  {
    id: "v3",
    name: "Andhra Farms",
    email: "orders@andhrafarms.com",
    phone: "+91 87654 32109",
    address: "789 Coastal Road, Vijayawada, Andhra Pradesh, India",
    rating: 4.7,
    status: "active",
    productsSupplied: ["Banganapalli Mangoes", "Guavas", "Papayas"],
    lastOrderDate: "2023-05-18",
    paymentTerms: "Net 45",
  },
  {
    id: "v4",
    name: "UP Growers Association",
    email: "contact@upgrowers.org",
    phone: "+91 77777 88888",
    address: "101 Mango Lane, Lucknow, Uttar Pradesh, India",
    rating: 4.2,
    status: "inactive",
    productsSupplied: ["Dasheri Mangoes", "Langra Mangoes", "Guavas"],
    lastOrderDate: "2023-04-25",
    paymentTerms: "Advance Payment",
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

const renderRatingStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`full-${i}`}
        className="h-4 w-4 fill-yellow-400 text-yellow-400"
      />,
    );
  }

  if (hasHalfStar) {
    stars.push(
      <div key="half" className="relative">
        <Star className="h-4 w-4 text-yellow-400" />
        <div className="absolute inset-0 overflow-hidden w-[50%]">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        </div>
      </div>,
    );
  }

  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />);
  }

  return <div className="flex">{stars}</div>;
};

export default function VendorManagementPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredVendors = mockVendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.productsSupplied.some((product) =>
        product.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active")
      return matchesSearch && vendor.status === "active";
    if (activeTab === "inactive")
      return matchesSearch && vendor.status === "inactive";
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Vendor Management</h3>
        <div className="flex gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search vendors..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Directory</CardTitle>
          <CardDescription>
            Manage your suppliers and track performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="all">All Vendors</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredVendors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No vendors found matching your criteria
                  </p>
                </div>
              ) : (
                filteredVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{vendor.name}</h4>
                          <Badge
                            variant={
                              vendor.status === "active"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {vendor.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {renderRatingStars(vendor.rating)}
                          <span className="text-sm ml-1">
                            {vendor.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Order History
                        </Button>
                        <Button size="sm">New Order</Button>
                      </div>
                    </div>

                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${vendor.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {vendor.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${vendor.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {vendor.phone}
                        </a>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>{vendor.address}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {vendor.productsSupplied.map((product, index) => (
                          <Badge key={index} variant="secondary">
                            {product}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap justify-between text-sm text-muted-foreground">
                        <span>
                          Last Order: {formatDate(vendor.lastOrderDate)}
                        </span>
                        <span>Payment Terms: {vendor.paymentTerms}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
