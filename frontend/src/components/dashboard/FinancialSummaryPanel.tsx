import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowDownToLine, ArrowUpRight, DollarSign } from "lucide-react";

type FinancialMetric = {
  label: string;
  value: number;
  previousValue: number;
  percentChange: number;
};

const mockFinancialMetrics: FinancialMetric[] = [
  {
    label: "Outstanding Receivables",
    value: 12450.75,
    previousValue: 10200.5,
    percentChange: 22.1,
  },
  {
    label: "Outstanding Payables",
    value: 8750.25,
    previousValue: 9200.0,
    percentChange: -4.9,
  },
  {
    label: "Cash Flow",
    value: 3700.5,
    previousValue: 1000.5,
    percentChange: 270.0,
  },
];

type Transaction = {
  id: string;
  type: "sale" | "purchase" | "payment_received" | "payment_made";
  amount: number;
  entity: string;
  date: string;
};

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "sale",
    amount: 2499.5,
    entity: "Fresh Mart",
    date: "2023-05-22T10:30:00Z",
  },
  {
    id: "2",
    type: "payment_received",
    amount: 1850.0,
    entity: "Fruit World",
    date: "2023-05-22T13:45:00Z",
  },
  {
    id: "3",
    type: "purchase",
    amount: 3750.0,
    entity: "Mango Farms Inc.",
    date: "2023-05-22T15:20:00Z",
  },
  {
    id: "4",
    type: "payment_made",
    amount: 2500.0,
    entity: "Tropical Fruits Co.",
    date: "2023-05-22T16:10:00Z",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "sale":
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    case "payment_received":
      return <DollarSign className="h-4 w-4 text-green-500" />;
    case "purchase":
      return <ArrowUpRight className="h-4 w-4 text-red-500 rotate-180" />;
    case "payment_made":
      return <DollarSign className="h-4 w-4 text-red-500" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
};

const getTransactionLabel = (type: string) => {
  switch (type) {
    case "sale":
      return "Sale";
    case "payment_received":
      return "Payment Received";
    case "purchase":
      return "Purchase";
    case "payment_made":
      return "Payment Made";
    default:
      return "Transaction";
  }
};

export default function FinancialSummaryPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Financial Summary</h3>
        <Button size="sm" variant="outline">
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {mockFinancialMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(metric.value)}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`text-xs ${metric.percentChange >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {metric.percentChange >= 0 ? "+" : ""}
                  {metric.percentChange.toFixed(1)}%
                </span>
                <Progress
                  value={50 + metric.percentChange / 2}
                  className="h-1"
                />
                <span className="text-xs text-muted-foreground">
                  vs. last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Transactions</CardTitle>
          <CardDescription>
            Real-time financial activity for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-2">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {getTransactionLabel(transaction.type)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.entity} • {formatTime(transaction.date)}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-medium ${transaction.type === "sale" || transaction.type === "payment_received" ? "text-green-600" : "text-red-600"}`}
                >
                  {transaction.type === "sale" ||
                  transaction.type === "payment_received"
                    ? "+"
                    : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
