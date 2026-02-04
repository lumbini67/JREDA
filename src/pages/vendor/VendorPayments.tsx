import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  CreditCard,
  Building2,
  TrendingUp,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

// Dummy payments data
const dummyPayments = [
  { id: "PAY-2024-001", applicationId: "APP-2024-001", farmerName: "Ramesh Kumar", district: "Ranchi", amount: 45000, paymentMode: "NEFT", status: "completed", date: "2024-01-15", reference: "REF123456" },
  { id: "PAY-2024-002", applicationId: "APP-2024-002", farmerName: "Suresh Singh", district: "Ranchi", amount: 65000, paymentMode: "RTGS", status: "completed", date: "2024-01-14", reference: "REF123457" },
  { id: "PAY-2024-003", applicationId: "APP-2024-003", farmerName: "Ajay Kumar", district: "Dhanbad", amount: 45000, paymentMode: "Cheque", status: "pending", date: "2024-01-16", reference: "REF123458" },
  { id: "PAY-2024-004", applicationId: "APP-2024-004", farmerName: "Deepak Sharma", district: "Bokaro", amount: 85000, paymentMode: "NEFT", status: "completed", date: "2024-01-13", reference: "REF123459" },
  { id: "PAY-2024-005", applicationId: "APP-2024-005", farmerName: "Vikram Patel", district: "Ranchi", amount: 65000, paymentMode: "UPI", status: "completed", date: "2024-01-12", reference: "REF123460" },
  { id: "PAY-2024-006", applicationId: "APP-2024-006", farmerName: "Anil Kumar", district: "Ranchi", amount: 45000, paymentMode: "NEFT", status: "processing", date: "2024-01-17", reference: "REF123461" },
  { id: "PAY-2024-007", applicationId: "APP-2024-007", farmerName: "Pradeep Singh", district: "Dhanbad", amount: 120000, paymentMode: "RTGS", status: "completed", date: "2024-01-11", reference: "REF123462" },
  { id: "PAY-2024-008", applicationId: "APP-2024-008", farmerName: "Santosh Kumar", district: "Bokaro", amount: 65000, paymentMode: "Cheque", status: "failed", date: "2024-01-10", reference: "REF123463" },
  { id: "PAY-2024-009", applicationId: "APP-2024-009", farmerName: "Rajesh Kumar", district: "Ranchi", amount: 45000, paymentMode: "NEFT", status: "completed", date: "2024-01-09", reference: "REF123464" },
  { id: "PAY-2024-010", applicationId: "APP-2024-010", farmerName: "Manoj Kumar", district: "Hazaribagh", amount: 85000, paymentMode: "UPI", status: "completed", date: "2024-01-08", reference: "REF123465" },
];

const paymentModes = ["all", "NEFT", "RTGS", "UPI", "Cheque"];

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; color: string; bgColor: string }> = {
  completed: { label: "Completed", icon: CheckCircle, color: "text-success", bgColor: "bg-success/10" },
  pending: { label: "Pending", icon: Clock, color: "text-warning", bgColor: "bg-warning/10" },
  processing: { label: "Processing", icon: AlertCircle, color: "text-info", bgColor: "bg-info/10" },
  failed: { label: "Failed", icon: AlertCircle, color: "text-destructive", bgColor: "bg-destructive/10" },
};

const VendorPayments = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentModeFilter, setPaymentModeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const filteredPayments = dummyPayments.filter((payment) => {
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesMode = paymentModeFilter === "all" || payment.paymentMode === paymentModeFilter;
    return matchesStatus && matchesMode;
  });

  const totalReceived = dummyPayments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = dummyPayments.filter(p => p.status === "pending" || p.status === "processing").reduce((sum, p) => sum + p.amount, 0);
  const totalFailed = dummyPayments.filter(p => p.status === "failed").reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status];
    return (
      <Badge className={config.bgColor + " " + config.color + " border-0"}>
        <config.icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "NEFT": return <Building2 className="w-4 h-4" />;
      case "RTGS": return <Building2 className="w-4 h-4" />;
      case "UPI": return <CreditCard className="w-4 h-4" />;
      case "Cheque": return <DollarSign className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payments</h1>
            <p className="text-muted-foreground mt-1">
              Payments received from JREDA
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="text-3xl font-bold text-success">₹{(totalReceived / 100000).toFixed(2)}L</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {dummyPayments.filter(p => p.status === "completed").length} transactions
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-warning">₹{(totalPending / 100000).toFixed(2)}L</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {dummyPayments.filter(p => p.status === "pending" || p.status === "processing").length} transactions
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-3xl font-bold text-destructive">₹{(totalFailed / 100000).toFixed(2)}L</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {dummyPayments.filter(p => p.status === "failed").length} transactions
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentModeFilter} onValueChange={setPaymentModeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Payment Mode" />
              </SelectTrigger>
              <SelectContent>
                {paymentModes.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode === "all" ? "All Modes" : mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Application ID</TableHead>
              <TableHead>Farmer Name</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments
              .filter(p => activeTab === "all" || p.status === activeTab)
              .map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-mono">{payment.id}</TableCell>
                <TableCell className="font-mono">{payment.applicationId}</TableCell>
                <TableCell className="font-medium">{payment.farmerName}</TableCell>
                <TableCell>{payment.district}</TableCell>
                <TableCell className="font-semibold">₹{payment.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getModeIcon(payment.paymentMode)}
                    <span>{payment.paymentMode}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell className="text-muted-foreground">{payment.reference}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredPayments.filter(p => activeTab === "all" || p.status === activeTab).length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No payments found matching your filters.</p>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default VendorPayments;
