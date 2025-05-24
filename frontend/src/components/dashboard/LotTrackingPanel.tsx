import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type LotInfo = {
  lotNumber: string;
  productName: string;
  initialQuantity: number;
  currentQuantity: number;
  receivedDate: string;
  expiryDate: string;
  vendorName: string;
  qualityScore: number;
};

// Mock data
const mockLots: LotInfo[] = [
  {
    lotNumber: "LOT-2023-05-A",
    productName: "Alphonso Mangoes",
    initialQuantity: 200,
    currentQuantity: 120,
    receivedDate: "2023-05-10",
    expiryDate: "2023-05-25",
    vendorName: "Ratnagiri Farms",
    qualityScore: 95,
  },
  {
    lotNumber: "LOT-2023-05-B",
    productName: "Kesar Mangoes",
    initialQuantity: 150,
    currentQuantity: 85,
    receivedDate: "2023-05-12",
    expiryDate: "2023-05-27",
    vendorName: "Gujarat Orchards",
    qualityScore: 88,
  },
  {
    lotNumber: "LOT-2023-05-C",
    productName: "Banganapalli Mangoes",
    initialQuantity: 300,
    currentQuantity: 210,
    receivedDate: "2023-05-15",
    expiryDate: "2023-05-30",
    vendorName: "Andhra Farms",
    qualityScore: 92,
  },
  {
    lotNumber: "LOT-2023-05-D",
    productName: "Dasheri Mangoes",
    initialQuantity: 100,
    currentQuantity: 45,
    receivedDate: "2023-05-18",
    expiryDate: "2023-06-02",
    vendorName: "UP Growers",
    qualityScore: 85,
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

const getDaysRemaining = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getExpiryStatus = (expiryDate: string) => {
  const daysRemaining = getDaysRemaining(expiryDate);

  if (daysRemaining < 0) return { label: "Expired", variant: "destructive" };
  if (daysRemaining <= 3) return { label: "Critical", variant: "destructive" };
  if (daysRemaining <= 7) return { label: "Warning", variant: "warning" };
  return { label: "Good", variant: "outline" };
};

const getQualityBadge = (score: number) => {
  if (score >= 90) return { label: "Excellent", variant: "default" };
  if (score >= 80) return { label: "Good", variant: "secondary" };
  if (score >= 70) return { label: "Average", variant: "outline" };
  return { label: "Poor", variant: "destructive" };
};

export default function LotTrackingPanel() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Lot Tracking</h3>
        <div className="flex gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search lots..."
              className="w-full pl-8"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lot Inventory</CardTitle>
          <CardDescription>
            Track inventory by lot number with expiry dates and quality metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockLots.map((lot) => {
              const expiryStatus = getExpiryStatus(lot.expiryDate);
              const qualityBadge = getQualityBadge(lot.qualityScore);
              const usagePercentage =
                (lot.currentQuantity / lot.initialQuantity) * 100;

              return (
                <div key={lot.lotNumber} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{lot.productName}</h4>
                        <Badge variant="outline">{lot.lotNumber}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Vendor: {lot.vendorName}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={qualityBadge.variant}>
                        Quality: {qualityBadge.label} ({lot.qualityScore}%)
                      </Badge>
                      <Badge variant={expiryStatus.variant}>
                        {expiryStatus.label} - {formatDate(lot.expiryDate)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>
                        Usage: {lot.currentQuantity} of {lot.initialQuantity}{" "}
                        units
                      </span>
                      <span>{usagePercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Received: {formatDate(lot.receivedDate)}</span>
                    <span>
                      {getDaysRemaining(lot.expiryDate) > 0
                        ? `${getDaysRemaining(lot.expiryDate)} days remaining`
                        : "Expired"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
