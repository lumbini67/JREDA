import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  Download,
  RefreshCw,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  User,
} from "lucide-react";

const paymentSummary = {
  totalDisbursed: 45678900,
  pendingDisbursement: 8234500,
  thisMonth: 5670000,
  successRate: 98.5,
};

const recentPayments = [
  {
    id: "PAY-2024-5678",
    beneficiary: "Ramesh Kumar",
    district: "Ranchi",
    type: "State Subsidy",
    amount: 75000,
    status: "success",
    date: "2024-12-30T10:30:00",
    txnId: "TXN123456789",
  },
  {
    id: "PAY-2024-5679",
    beneficiary: "Sita Devi",
    district: "Hazaribagh",
    type: "CFA Subsidy",
    amount: 25000,
    status: "success",
    date: "2024-12-30T09:15:00",
    txnId: "TXN123456790",
  },
  {
    id: "PAY-2024-5680",
    beneficiary: "Mohan Prasad",
    district: "Dhanbad",
    type: "State Subsidy",
    amount: 75000,
    status: "pending",
    date: "2024-12-30T08:45:00",
    txnId: null,
  },
  {
    id: "PAY-2024-5681",
    beneficiary: "Lakshmi Oraon",
    district: "Bokaro",
    type: "Vendor Payment",
    amount: 125000,
    status: "success",
    date: "2024-12-29T16:20:00",
    txnId: "TXN123456791",
  },
  {
    id: "PAY-2024-5682",
    beneficiary: "Solar Tech Solutions",
    district: "Ranchi",
    type: "Vendor Payment",
    amount: 450000,
    status: "failed",
    date: "2024-12-29T14:10:00",
    txnId: null,
  },
];

const subsidyBreakdown = [
  { type: "State Subsidy (~72%)", amount: 32889210, count: 438 },
  { type: "CFA Subsidy (~25%)", amount: 11419725, count: 438 },
  { type: "Beneficiary Contribution (~3%)", amount: 1370015, count: 438 },
];

const vendorPayments = [
  { vendor: "Solar Tech Solutions", pending: 2500000, cleared: 15600000, installations: 156 },
  { vendor: "Green Energy Systems", pending: 1800000, cleared: 12400000, installations: 124 },
  { vendor: "Jharkhand Solar Corp", pending: 1200000, cleared: 9800000, installations: 98 },
];

const statusStyles: Record<string, string> = {
  success: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  failed: "bg-destructive/10 text-destructive",
};

const Payments = () => {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString("en-IN")}`;
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payment Gateway</h1>
            <p className="text-muted-foreground mt-1">
              Real-time payment integration and subsidy disbursement tracking
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Sync Payments
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-8 h-8 text-success" />
              <ArrowUpRight className="w-4 h-4 text-success" />
            </div>
            <p className="text-2xl font-bold">{formatCurrency(paymentSummary.totalDisbursed)}</p>
            <p className="text-sm text-muted-foreground">Total Disbursed</p>
          </CardContent>
        </Card>
        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-warning" />
              <span className="text-xs text-warning font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(paymentSummary.pendingDisbursement)}</p>
            <p className="text-sm text-muted-foreground">Pending Disbursement</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <IndianRupee className="w-8 h-8 text-primary" />
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <p className="text-2xl font-bold">{formatCurrency(paymentSummary.thisMonth)}</p>
            <p className="text-sm text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
        <Card className="bg-info/5 border-info/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-info" />
              <span className="text-xs text-success font-medium">+2.1%</span>
            </div>
            <p className="text-2xl font-bold">{paymentSummary.successRate}%</p>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="subsidy">Subsidy Breakdown</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Payments</TabsTrigger>
          <TabsTrigger value="integration">Gateway Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Recent Payment Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Beneficiary</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                      <TableCell className="font-medium">{payment.beneficiary}</TableCell>
                      <TableCell>{payment.district}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.type}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{payment.amount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusStyles[payment.status]}>{payment.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {payment.txnId || "--"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subsidy">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>PM-KUSUM Component-B Subsidy Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subsidyBreakdown.map((item) => (
                  <div key={item.type} className="p-4 rounded-xl bg-secondary/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.type}</span>
                      <span className="text-lg font-bold">{formatCurrency(item.amount)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.count} beneficiaries processed
                    </p>
                  </div>
                ))}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total Subsidy Disbursed</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(subsidyBreakdown.reduce((a, b) => a + b.amount, 0))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disbursement Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Application Approved</p>
                      <p className="text-sm text-muted-foreground">Verified by JREDA officer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                    <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center text-info font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Installation Complete</p>
                      <p className="text-sm text-muted-foreground">JCR/PCR verified with geo-tag</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Payment Initiated</p>
                      <p className="text-sm text-muted-foreground">Real-time gateway integration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-success/5 border border-success/20">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Disbursement Complete</p>
                      <p className="text-sm text-muted-foreground">Instant notification to beneficiary</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Empanelled Agency Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorPayments.map((vendor) => (
                  <div key={vendor.vendor} className="p-6 rounded-xl border border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{vendor.vendor}</h4>
                        <p className="text-sm text-muted-foreground">{vendor.installations} installations completed</p>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                        <p className="text-xs text-muted-foreground mb-1">Cleared Amount</p>
                        <p className="text-xl font-bold text-success">{formatCurrency(vendor.cleared)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                        <p className="text-xs text-muted-foreground mb-1">Pending Amount</p>
                        <p className="text-xl font-bold text-warning">{formatCurrency(vendor.pending)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Integration Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-success/5 border border-success/20">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-8 h-8 text-success" />
                    <div>
                      <h4 className="font-semibold">Primary Gateway</h4>
                      <p className="text-sm text-muted-foreground">NPCI / UPI Integration</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <Badge className="bg-success/10 text-success">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Heartbeat</span>
                      <span className="text-sm text-muted-foreground">2 seconds ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Success Rate (24h)</span>
                      <span className="text-sm font-semibold text-success">99.2%</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-secondary/30 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-8 h-8 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold">Fallback Gateway</h4>
                      <p className="text-sm text-muted-foreground">NEFT/RTGS Integration</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <Badge variant="outline">Standby</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Used</span>
                      <span className="text-sm text-muted-foreground">3 days ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Success Rate</span>
                      <span className="text-sm font-semibold">98.8%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-info/5 border border-info/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-info" />
                  Real-Time Features (As per SOW)
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Instant transaction status updates and notifications</li>
                  <li>• Automatic refund processing for failed transactions</li>
                  <li>• Real-time payment analytics dashboard</li>
                  <li>• SMS/WhatsApp notification on payment success/failure</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Payments;
