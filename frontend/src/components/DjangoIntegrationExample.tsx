import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import {
  productService,
  vendorService,
  customerService,
  purchaseService,
  saleService,
  analyticsService,
} from "@/services/api";

import {
  adaptProduct,
  adaptVendor,
  adaptCustomer,
  adaptPurchase,
  adaptSale,
  adaptFinancialSummary,
} from "@/utils/djangoAdapter";

import type {
  DjangoProduct,
  DjangoVendor,
  DjangoCustomer,
  DjangoPurchase,
  DjangoSale,
  DjangoFinancialSummary,
} from "@/types/django";

interface ApiExampleProps {
  tenantId: string;
}

export default function DjangoIntegrationExample({
  tenantId = "default-tenant-id",
}: ApiExampleProps) {
  const [activeTab, setActiveTab] = useState<string>("products");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[] | null>(null);
  const [summaryData, setSummaryData] = useState<any | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    setSummaryData(null);

    try {
      let response;

      switch (activeTab) {
        case "products":
          response = await productService.getProducts(tenantId);
          setData(response.map((item: DjangoProduct) => adaptProduct(item)));
          break;
        case "vendors":
          response = await vendorService.getVendors(tenantId);
          setData(response.map((item: DjangoVendor) => adaptVendor(item)));
          break;
        case "customers":
          response = await customerService.getCustomers(tenantId);
          setData(response.map((item: DjangoCustomer) => adaptCustomer(item)));
          break;
        case "purchases":
          response = await purchaseService.getPurchases(tenantId);
          setData(response.map((item: DjangoPurchase) => adaptPurchase(item)));
          break;
        case "sales":
          response = await saleService.getSales(tenantId);
          setData(response.map((item: DjangoSale) => adaptSale(item)));
          break;
        case "analytics":
          response = await analyticsService.getFinancialSummary(tenantId);
          setSummaryData(
            adaptFinancialSummary(response as DjangoFinancialSummary),
          );
          break;
        default:
          setError("Invalid tab selection");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail || err.message || "An error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Optional: Auto-fetch on tab change
    // fetchData();
  }, [activeTab]);

  const renderDataDisplay = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading data...</span>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!data && !summaryData) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Click "Fetch Data" to load information from the Django backend
        </div>
      );
    }

    if (activeTab === "analytics" && summaryData) {
      return (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Sales:</span>
                  <span className="font-medium">
                    ${summaryData.totalSales.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Purchases:</span>
                  <span className="font-medium">
                    ${summaryData.totalPurchases.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Outstanding Receivables:</span>
                  <span className="font-medium">
                    ${summaryData.outstandingReceivables.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Outstanding Payables:</span>
                  <span className="font-medium">
                    ${summaryData.outstandingPayables.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Margin:</span>
                  <span className="font-medium">
                    {summaryData.profitMargin.toFixed(2)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryData.dailyTransactions.length > 0 ? (
                <div className="space-y-2">
                  {summaryData.dailyTransactions
                    .slice(0, 5)
                    .map((transaction: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <div className="font-medium">{transaction.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(
                              transaction.createdAt,
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="font-medium">
                          ${transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No recent transactions
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-2 text-left font-medium">ID</th>
                <th className="p-2 text-left font-medium">Name</th>
                {activeTab === "products" && (
                  <>
                    <th className="p-2 text-left font-medium">SKU</th>
                    <th className="p-2 text-left font-medium">Price</th>
                    <th className="p-2 text-left font-medium">Quantity</th>
                  </>
                )}
                {(activeTab === "vendors" || activeTab === "customers") && (
                  <>
                    <th className="p-2 text-left font-medium">Email</th>
                    <th className="p-2 text-left font-medium">Phone</th>
                  </>
                )}
                {(activeTab === "purchases" || activeTab === "sales") && (
                  <>
                    <th className="p-2 text-left font-medium">Total</th>
                    <th className="p-2 text-left font-medium">Status</th>
                    <th className="p-2 text-left font-medium">Date</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.id}</td>
                    <td className="p-2">
                      {activeTab === "products" && item.name}
                      {activeTab === "vendors" && item.name}
                      {activeTab === "customers" && item.name}
                      {activeTab === "purchases" &&
                        `Purchase #${item.id.substring(0, 8)}`}
                      {activeTab === "sales" &&
                        `Sale #${item.id.substring(0, 8)}`}
                    </td>
                    {activeTab === "products" && (
                      <>
                        <td className="p-2">{item.sku}</td>
                        <td className="p-2">${item.price.toFixed(2)}</td>
                        <td className="p-2">{item.quantity}</td>
                      </>
                    )}
                    {(activeTab === "vendors" || activeTab === "customers") && (
                      <>
                        <td className="p-2">{item.email || "-"}</td>
                        <td className="p-2">{item.phone || "-"}</td>
                      </>
                    )}
                    {(activeTab === "purchases" || activeTab === "sales") && (
                      <>
                        <td className="p-2">${item.totalAmount.toFixed(2)}</td>
                        <td className="p-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${item.paymentStatus === "paid" ? "bg-green-100 text-green-700" : item.paymentStatus === "partial" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                          >
                            {item.paymentStatus}
                          </span>
                        </td>
                        <td className="p-2">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-muted-foreground"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle>Django Backend Integration Example</CardTitle>
        <CardDescription>
          This component demonstrates how to connect to your Django backend
          using the API services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Integration Guide</h3>
            <div className="text-sm text-muted-foreground mb-4">
              <p>
                This example shows how to fetch and display data from your
                Django backend.
              </p>
              <p>
                The component uses the API services from{" "}
                <code>src/services/api.ts</code> and adapters from{" "}
                <code>src/utils/djangoAdapter.ts</code>.
              </p>
            </div>

            <Alert className="mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Connection Setup</AlertTitle>
              <AlertDescription>
                <p>
                  Your API is configured to connect to:{" "}
                  <code>
                    {import.meta.env.VITE_API_URL ||
                      "http://localhost:8000/api"}
                  </code>
                </p>
                <p className="mt-1">
                  Authentication is handled via Bearer token stored in
                  localStorage.
                </p>
              </AlertDescription>
            </Alert>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h4 className="font-medium">
                Current Tab:{" "}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h4>
              <p className="text-sm text-muted-foreground">
                {activeTab === "products" &&
                  "Fetches product inventory data from your Django backend."}
                {activeTab === "vendors" &&
                  "Retrieves vendor information from your Django backend."}
                {activeTab === "customers" &&
                  "Gets customer data from your Django backend."}
                {activeTab === "purchases" &&
                  "Loads purchase orders from your Django backend."}
                {activeTab === "sales" &&
                  "Retrieves sales transactions from your Django backend."}
                {activeTab === "analytics" &&
                  "Fetches financial summary data from your Django backend."}
              </p>
            </div>
          </div>

          <Button onClick={fetchData} disabled={isLoading} className="mb-4">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Fetch Data
          </Button>

          {renderDataDisplay()}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          <p>Tenant ID: {tenantId}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setData(null);
            setSummaryData(null);
            setError(null);
          }}
        >
          Clear Results
        </Button>
      </CardFooter>
    </Card>
  );
}
