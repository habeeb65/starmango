import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus } from "lucide-react";

type DamageReport = {
  id: string;
  productName: string;
  quantity: number;
  reason: string;
  lotNumber: string;
  reportedBy: string;
  reportedAt: string;
};

// Mock data
const mockDamageReports: DamageReport[] = [
  {
    id: "1",
    productName: "Alphonso Mangoes",
    quantity: 12,
    reason: "Transportation damage",
    lotNumber: "LOT-2023-05-A",
    reportedBy: "John Smith",
    reportedAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    productName: "Kesar Mangoes",
    quantity: 8,
    reason: "Quality issues",
    lotNumber: "LOT-2023-05-B",
    reportedBy: "Sarah Johnson",
    reportedAt: "2023-05-16T14:45:00Z",
  },
  {
    id: "3",
    productName: "Banganapalli Mangoes",
    quantity: 15,
    reason: "Ripening issues",
    lotNumber: "LOT-2023-05-C",
    reportedBy: "Mike Davis",
    reportedAt: "2023-05-18T09:15:00Z",
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

export default function DamageReportPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Damage Reports</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Damage Reports</CardTitle>
          <CardDescription>
            Track and manage product damage across inventory lots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDamageReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="font-medium">{report.productName}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lot: {report.lotNumber} | {formatDate(report.reportedAt)}
                  </p>
                  <p className="text-sm">Reason: {report.reason}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="destructive">{report.quantity} units</Badge>
                  <p className="text-xs text-muted-foreground">
                    Reported by: {report.reportedBy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
