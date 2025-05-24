import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Download,
  FileText,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ReportType = "inventory" | "sales" | "purchases" | "financial" | "damage";
type ReportFormat = "pdf" | "excel" | "csv";
type DateRange = { from: Date | undefined; to: Date | undefined };

export default function ReportGenerator() {
  const [reportType, setReportType] = useState<ReportType>("inventory");
  const [reportFormat, setReportFormat] = useState<ReportFormat>("pdf");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Generator</CardTitle>
        <CardDescription>
          Generate detailed reports for your wholesale business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="standard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="standard">Standard Reports</TabsTrigger>
            <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="standard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select
                  value={reportType}
                  onValueChange={(value) => setReportType(value as ReportType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inventory">Inventory Status</SelectItem>
                    <SelectItem value="sales">Sales Summary</SelectItem>
                    <SelectItem value="purchases">Purchase Orders</SelectItem>
                    <SelectItem value="financial">
                      Financial Statement
                    </SelectItem>
                    <SelectItem value="damage">Damage Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <Select
                  value={reportFormat}
                  onValueChange={(value) =>
                    setReportFormat(value as ReportFormat)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex flex-wrap gap-4">
                <div className="grid gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[240px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{
                          from: dateRange.from,
                          to: dateRange.to,
                        }}
                        onSelect={(range) => {
                          setDateRange({
                            from: range?.from,
                            to: range?.to,
                          });
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const today = new Date();
                      const lastMonth = new Date();
                      lastMonth.setMonth(today.getMonth() - 1);
                      setDateRange({ from: lastMonth, to: today });
                    }}
                  >
                    Last 30 Days
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const today = new Date();
                      const lastWeek = new Date();
                      lastWeek.setDate(today.getDate() - 7);
                      setDateRange({ from: lastWeek, to: today });
                    }}
                  >
                    Last 7 Days
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" className="gap-2">
                <Printer className="h-4 w-4" />
                Print Preview
              </Button>
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating || !dateRange.from}
                className="gap-2"
              >
                {isGenerating ? (
                  "Generating..."
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Custom Report Builder</h4>
                  <p className="text-sm text-muted-foreground">
                    Design your own reports with specific fields and filters
                  </p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Advanced reporting features available in the Enterprise plan
                </p>
                <Button variant="outline">Upgrade to Enterprise</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Recent Reports</h4>
          <div className="space-y-2">
            {[
              {
                name: "Monthly Inventory Summary",
                date: "May 22, 2023",
                type: "pdf",
              },
              {
                name: "Q2 Sales Analysis",
                date: "May 15, 2023",
                type: "excel",
              },
              {
                name: "Vendor Performance Report",
                date: "May 10, 2023",
                type: "pdf",
              },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.date}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
