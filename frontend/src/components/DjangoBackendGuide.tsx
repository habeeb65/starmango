import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code } from "@/components/ui/code";
import { InfoIcon } from "lucide-react";

export default function DjangoBackendGuide() {
  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle>Django Backend Integration Guide</CardTitle>
        <CardDescription>
          Complete guide for connecting your React frontend to the Django backend
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="data">Data Fetching</TabsTrigger>
            <TabsTrigger value="mutations">Mutations</TabsTrigger>
            <TabsTrigger value="adapters">Adapters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">API Setup</h3>
            <p className="text-sm text-muted-foreground">
              Your project is already configured with an Axios instance in <code>src/services/api.ts</code> that points to your Django backend.
            </p>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Configuration</AlertTitle>
              <AlertDescription>
                <p>The API is configured to use the <code>VITE_API_URL</code> environment variable or defaults to <code>http://localhost:8000/api</code>.</p>
                <p className="mt-2">Make sure your Django backend is running and CORS is properly configured to accept requests from your frontend.</p>
              </AlertDescription>
            </Alert>
            
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">Django CORS Configuration</h4>
              <p className="text-sm mb-2">In your Django project, install django-cors-headers:</p>
              <pre className="bg-slate-800 text-slate-50 p-2 rounded text-sm overflow-x-auto">
                pip install django-cors-headers
              </pre>
              
              <p className="text-sm mt-4 mb-2">Add it to INSTALLED_APPS in settings.py:</p>
              <pre className="bg-slate-800 text-slate-50 p-2 rounded text-sm overflow-x-auto">
{`INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]`}
              </pre>
              
              <p className="text-sm mt-4 mb-2">Add the middleware:</p>
              <pre className="bg-slate-800 text-slate-50 p-2 rounded text-sm overflow-x-auto">
{`MIDDLEWARE = [
    # ...
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ...
]`}
              </pre>
              
              <p className="text-sm mt-4 mb-2">Configure CORS settings:</p>
              <pre className="bg-slate-800 text-slate-50 p-2 rounded text-sm overflow-x-auto">
{`# For development
CORS_ALLOW_ALL_ORIGINS = True  # Only in development!

# For production
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]

# Allow credentials if needed
CORS_ALLOW_CREDENTIALS = True`}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="auth" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Authentication</h3>
            <p className="text-sm text-muted-foreground">
              The API service is configured to handle JWT authentication with your Django backend.
            </p>
            
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">Login Example</h4>
              <pre className="bg-slate-800 text-slate-50 p-2 rounded text-sm overflow-x-auto">
{`import { authService } from "@/services/api";

const handleLogin = async (email, password, tenantId) => {
  try {
    const response = await authService.login(email, password, tenantId);
    
    // Store the token and user data
    localStorage.setItem("erp_token", response.token);
    localStorage.setItem("erp_user", JSON.stringify(response.user));
    
    // Redirect or update state
    // ...
  } catch (error) {
    console.error("Login failed:", error);
    // Handle error
  }
};`}
              </pre>
              
              <h4 className="font-medium mb-2 mt-4">Logout Example</h4>
              <pre className="bg-slate-800 text-slate-50 p-2 rounded text-sm overflow-x-auto">
{`import { authService } from "@/services/api";

const handleLogout = () => {
  authService.logout();
  // Redirect to login page
  window.location.href = "/login";
};`}
              </pre>
              
              <h4 className="font-medium mb-2 mt-4">Token Handling</h4>
              <p className="text-sm mb-2">The API service automatically:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Adds the token to all requests</li>
                <li>Redirects to login if a 401 error is received</li>
                <li>Clears stored credentials on logout</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Data Fetching</h3>
            <p className="text-sm text-muted-foreground">
              Use the service functions to fetch data from your Django backend.
            </p>
            
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">Fetching Products Example</h4>
              <pre className="bg-slate-800 text-slate-50 p-2 rounded text-sm overflow-x-auto">
{`import { useState, useEffect } from "react";
import { productService } from "@/services/api";
import { adaptProduct } from "@/utils/djangoAdapter";

function ProductList({ tenantId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getProducts(tenantId);
        // Use the adapter to convert Django format to frontend format
        const adaptedProducts = response.map(product => adaptProduct(product));
        setProducts(adaptedProducts);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [tenantId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
}`}
              </pre>
              
              <h4 className="font-medium mb-2 mt-4">Handling Pagination</h4>
              <p className="text-sm mb-2">If your Django API uses pagination:</p>
              <pre className="bg-slate-800 text-slate-50 p-2 rounded text-sm overflow-x-auto">
{`import { useState, useEffect } from "react";
import { productService } from "@/services/api";
import { adaptProduct } from "@/utils/djangoAdapter";
import type { PaginatedResponse } from "@/types/django";

function PaginatedProductList({ tenantId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Assuming your API supports pagination parameters
        const response = await api.get(
          `/products/?tenant=${tenantId}&page=${page}`
        );
        const paginatedData = response.data as PaginatedResponse<any>;
        
        // Use the adapter to convert Django format to frontend format
        const adaptedProducts = paginatedData.results.map(product => 
          adaptProduct(product)
        );
        
        setProducts(prev => [...prev, ...adaptedProducts]);
        setHasMore(!!paginatedData.next);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [tenantId, page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Component rendering
}`}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="mutations" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Creating and Updating Data</h3>
            <p className="text-sm text-muted-foreground">
              Use the service functions to create, update, or delete data in your Django backend.
            </p>
            
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">Creating a Product</h4>
              <pre className="bg-slate-800 text-slate-50 p-2 rounded text-sm overflow-x-auto">
{`import { useState } from "react";
import { productService } from "@/services/api";
import { prepareProductForDjango } from "@/utils/djangoAdapter";

function CreateProduct({ tenantId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert frontend format to Django format
      const productData = prepareProductForDjango({
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        quantity: parseInt(formData.quantity),
        tenantId: tenantId
      });
      
      const response = await productService.createProduct(productData);
      onSuccess(response);
    } catch (err) {
      setError(err.response?.data || err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  // Form rendering
}`}
              </pre>
              
              <h4 className="font-medium mb-2 mt-4">Updating a Product</h4>
              <pre className="bg-slate-800 text-slate-50 p-2 rounded text-sm overflow-x-auto">
{`import { useState } from "react";
import { productService } from "@/services/api";
import { prepareProductForDjango } from "@/utils/djangoAdapter";

function UpdateProduct({ product, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert frontend format to Django format
      const productData = prepareProductForDjango({
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        quantity: parseInt(formData.quantity),
        tenantId: product.tenantId
      });
      
      const response = await productService.updateProduct(product.id, productData);
      onSuccess(response);
    } catch (err) {
      setError(err.response?.data || err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  // Form rendering
}`}
              </pre>
              
              <h4 className="font-medium mb-2 mt-4">Deleting a Product</h4>
              <pre className="bg-slate-800 text-slate-50 p-2 rounded text-sm overflow-x-auto">
{`import { useState } from "react";
import { productService } from "@/services/api";

function DeleteProduct({ productId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await productService.deleteProduct(productId);
      onSuccess();
    } catch (err) {
      setError(err.response?.data || err.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  // Confirmation dialog and button rendering
}`}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="adapters" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Data Adapters</h3>
            <p className="text-sm text-muted-foreground">
              The project includes adapter functions in <code>src/utils/djangoAdapter.ts</code> to convert between Django and frontend data formats.
            </p>
            
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">Using Adapters</h4>
              <p className="text-sm mb-2">When receiving data from the API:</p>
              <pre className="bg-slate-800 text-slate-50 p-2 rounded text-sm overflow-x-auto">
{`import { adaptProduct } from "@/utils/djangoAdapter";

// Django format from API
const djangoProduct = {
  id: "123",
  name: "Mango",
  description: "Fresh mangoes",
  sku: "MNG-001",
  price: 2.99,
  cost: 1.50,
  quantity: 100,
  tenant: "tenant-123",
  lot_number: "LOT-2023-05",
  damage_count: 2,
  created_at: "2023-05-15T10:30:00Z",
  updated_at: "2023-05-15T10:30:00Z"
};

// Convert to frontend format
const product = adaptProduct(djangoProduct);

// Result:
// {
//   id: "123",
//   name: "Mango",
//   description: "Fresh mangoes",
//   sku: "MNG-001",
//   price: 2.99,
//   cost: 1.50,
//   quantity: 100,
//   tenantId: "tenant-123",
//   lotNumber: "LOT-2023-05",
//   damageCount: 2,
//   createdAt: "2023-05-15T10:30:00Z",
//   updatedAt: "2023-05-15T10:30:00Z"
// }`}
              </pre>
              
              <p className="text-sm mb-2 mt-4">When sending data to the API:</p>
              <pre className="bg-slate-800 text-slate-50 p-2 rounded text-sm overflow-x-auto">
{`import { prepareProductForDjango } from "@/utils/djangoAdapter";

// Frontend format
const product = {
  name: "Mango",
  description: "Fresh mangoes",
  sku: "MNG-001",
  price: 2.99,
  cost: 1.50,
  quantity: 100,
  tenantId: "tenant-123",
  lotNumber: "LOT-2023-05"
};

// Convert to Django format
const djangoProduct = prepareProductForDjango(product);

// Result:
// {
//   name: "Mango",
//   description: "Fresh mangoes",
//   sku: "MNG-001",
//   price: 2.99,
//   cost: 1.50,
//   quantity: 100,
//   tenant: "tenant-123",
//   lot_number: "LOT-2023-05",
//   damage_count: null
// }`}
              </pre>
              
              <h4 className="font-medium mb-2 mt-4">Available Adapters</h4>
              <p className="text-sm">The project includes adapters for:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Products</li>
                <li>Vendors</li>
                <li>Customers</li>
                <li>Purchases</li>
                <li>Sales</li>
                <li>Damage Reports</li>
                <li>Transactions</li>
                <li>Financial Summaries</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
