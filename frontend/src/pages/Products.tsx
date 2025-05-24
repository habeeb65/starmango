import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Products() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Product Management</h2>
        <p className="text-muted-foreground">
          Manage your product catalog and pricing.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input placeholder="Search products..." className="w-[300px]" />
          <Button variant="outline">Filter</Button>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              In 8 categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98</div>
            <p className="text-xs text-muted-foreground">
              Currently in stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Below threshold
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">
              Needs reordering
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            Manage your product catalog and inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[
              {
                name: "Alphonso Mangoes",
                sku: "MNG-ALP-001",
                category: "Mangoes",
                price: 24.99,
                stock: 120,
                status: "In Stock",
              },
              {
                name: "Kesar Mangoes",
                sku: "MNG-KSR-002",
                category: "Mangoes",
                price: 19.99,
                stock: 45,
                status: "Low Stock",
              },
              {
                name: "Banganapalli Mangoes",
                sku: "MNG-BNG-003",
                category: "Mangoes",
                price: 18.50,
                stock: 0,
                status: "Out of Stock",
              },
            ].map((product) => (
              <div key={product.sku} className="flex items-center">
                <div className="w-[250px]">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sku}</p>
                </div>
                <div className="w-[150px] text-sm text-muted-foreground">
                  {product.category}
                </div>
                <div className="w-[100px]">
                  <Badge 
                    variant={
                      product.status === "In Stock" 
                        ? "outline" 
                        : product.status === "Low Stock" 
                        ? "secondary" 
                        : "destructive"
                    }
                  >
                    {product.status}
                  </Badge>
                </div>
                <div className="w-[100px] text-right">
                  ${product.price}
                </div>
                <div className="flex-1 text-right">
                  {product.stock} units
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}