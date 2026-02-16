import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth, MachineType } from "@/context/AuthContext";
import { useGrievance, TicketStatus, Ticket } from "@/context/GrievanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Ticket as TicketIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Search,
  FileText,
  FileSpreadsheet,
  BarChart3,
  TrendingUp,
  Target,
} from "lucide-react";

const typeConfig: Record<MachineType, { label: string; icon: string }> = {
  solar_pump: { label: "Solar Pump", icon: "☀️" },
  mini_grid: { label: "Mini Grid", icon: "⚡" },
  rooftop_solar: { label: "Rooftop Solar", icon: "🏠" },
};

const ITEMS_PER_PAGE = 10;

// Helper function to generate report data from real tickets
const generateReportData = (tickets: Ticket[], reportType: "daily" | "weekly" | "monthly") => {
  const now = new Date();
  
  if (reportType === "daily") {
    // Last 7 days
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayTickets = tickets.filter(t => t.created_date.startsWith(dateStr));
      dailyData.push({
        date: dateStr,
        total: dayTickets.length,
        resolved: dayTickets.filter(t => t.current_status === "resolved" || t.current_status === "closed").length,
        pending: dayTickets.filter(t => t.current_status === "pending" || t.current_status === "escalated").length,
        inProgress: dayTickets.filter(t => t.current_status === "in_progress").length,
      });
    }
    return dailyData;
  } else if (reportType === "weekly") {
    // Last 4 weeks
    const weeklyData = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekTickets = tickets.filter(t => {
        const ticketDate = new Date(t.created_date);
        return ticketDate >= weekStart && ticketDate <= weekEnd;
      });
      
      weeklyData.push({
        week: `Week ${4 - i} (${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}-${weekEnd.toLocaleDateString("en-US", { day: "numeric" })})`,
        total: weekTickets.length,
        resolved: weekTickets.filter(t => t.current_status === "resolved" || t.current_status === "closed").length,
        pending: weekTickets.filter(t => t.current_status === "pending" || t.current_status === "escalated").length,
        inProgress: weekTickets.filter(t => t.current_status === "in_progress").length,
      });
    }
    return weeklyData;
  } else {
    // Last 4 months
    const monthlyData = [];
    for (let i = 3; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthTickets = tickets.filter(t => {
        const ticketDate = new Date(t.created_date);
        return ticketDate >= monthStart && ticketDate <= monthEnd;
      });
      
      monthlyData.push({
        month: monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        total: monthTickets.length,
        resolved: monthTickets.filter(t => t.current_status === "resolved" || t.current_status === "closed").length,
        pending: monthTickets.filter(t => t.current_status === "pending" || t.current_status === "escalated").length,
        inProgress: monthTickets.filter(t => t.current_status === "in_progress").length,
      });
    }
    return monthlyData;
  }
};

const MISReport = ({ tickets }: { tickets: Ticket[] }) => {
  const { machineType } = useAuth();
  const typeInfo = machineType ? typeConfig[machineType] : typeConfig.solar_pump;

  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  // Generate report data from real tickets
  const currentData = generateReportData(tickets, reportType);
  const totalGrievances = currentData.reduce((sum, row) => sum + row.total, 0);
  const totalResolved = currentData.reduce((sum, row) => sum + row.resolved, 0);
  const totalPending = currentData.reduce((sum, row) => sum + row.pending, 0);
  const totalInProgress = currentData.reduce((sum, row) => sum + (row as any).inProgress, 0);

  const handleExportPDF = () => {
    alert("Exporting MIS Report as PDF...");
  };

  const handleExportExcel = () => {
    alert("Exporting MIS Report as Excel...");
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={(val: "daily" | "weekly" | "monthly") => setReportType(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Report</SelectItem>
                  <SelectItem value="weekly">Weekly Report</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Select {reportType === "daily" ? "Date" : reportType === "weekly" ? "Week" : "Month"}</Label>
              <Input
                type={reportType === "monthly" ? "month" : "date"}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
                <FileText className="w-4 h-4" />
                Export PDF
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MIS Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <p className="text-2xl font-bold mt-1">{totalGrievances}</p>
          </CardContent>
        </Card>
        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <p className="text-2xl font-bold mt-1">{totalPending}</p>
          </CardContent>
        </Card>
        <Card className="bg-info/5 border-info/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-info" />
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <p className="text-2xl font-bold mt-1">{totalInProgress}</p>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <p className="text-xs text-muted-foreground">Resolved</p>
            </div>
            <p className="text-2xl font-bold mt-1">{totalResolved}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Closed</p>
            </div>
            <p className="text-2xl font-bold mt-1">{Math.floor(totalResolved * 0.2)}</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <p className="text-xs text-muted-foreground">Resolution Rate</p>
            </div>
            <p className="text-2xl font-bold mt-1">{((totalResolved / totalGrievances) * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Grievance Redressal Report - {typeInfo.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{reportType === "daily" ? "Date" : reportType === "weekly" ? "Week" : "Month"}</TableHead>
                <TableHead className="text-right">Total Grievances</TableHead>
                <TableHead className="text-right">Resolved</TableHead>
                <TableHead className="text-right">Pending</TableHead>
                <TableHead className="text-right">Resolution Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row) => (
                <TableRow key={row.date || row.week || row.month}>
                  <TableCell className="font-medium">{row.date || row.week || row.month}</TableCell>
                  <TableCell className="text-right">{row.total}</TableCell>
                  <TableCell className="text-right text-success">{row.resolved}</TableCell>
                  <TableCell className="text-right text-warning">{row.pending}</TableCell>
                  <TableCell className="text-right">{((row.resolved / row.total) * 100).toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">2.5 days</p>
            <p className="text-xs text-muted-foreground">Target: 3 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Escalation Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-warning">3</p>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">{((totalResolved / totalGrievances) * 100).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Target: 90%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ManagerGrievances = () => {
  const { machineType } = useAuth();
  const { tickets, getTicketsByMachineType } = useGrievance();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get tickets filtered by manager's machine type
  const filteredByType = machineType 
    ? getTicketsByMachineType(machineType)
    : tickets;

  const filteredTickets = filteredByType.filter((ticket) => {
    const matchesSearch =
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.grievance_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.farmer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.pump_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.current_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4 text-warning" />;
      case "in_progress": return <AlertCircle className="w-4 h-4 text-info" />;
      case "resolved": return <CheckCircle className="w-4 h-4 text-success" />;
      case "closed": return <XCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    const variants: Record<TicketStatus, string> = {
      pending: "bg-warning/10 text-warning border-warning/30",
      in_progress: "bg-info/10 text-info border-info/30",
      resolved: "bg-success/10 text-success border-success/30",
      closed: "bg-muted text-muted-foreground border-border",
      escalated: "bg-destructive/10 text-destructive border-destructive/30",
    };
    return (
      <Badge variant="outline" className={variants[status]}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status === "in_progress" ? "In Progress" : status}</span>
      </Badge>
    );
  };

  const getEscalationBadge = (level: number) => {
    const variants = [
      "bg-muted text-muted-foreground",
      "bg-warning/10 text-warning",
      "bg-destructive/10 text-destructive",
    ];
    const labels = ["Level 0", "Level 1", "Level 2"];
    return <Badge className={variants[level] || variants[0]}>{labels[level] || labels[0]}</Badge>;
  };

  const ticketStats = {
    total: filteredTickets.length,
    pending: filteredTickets.filter((t) => t.current_status === "pending").length,
    inProgress: filteredTickets.filter((t) => t.current_status === "in_progress").length,
    escalated: filteredTickets.filter((t) => t.current_status === "escalated").length,
    resolved: filteredTickets.filter((t) => t.current_status === "resolved").length,
    closed: filteredTickets.filter((t) => t.current_status === "closed").length,
  };

  const typeInfo = machineType ? typeConfig[machineType] : typeConfig.solar_pump;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {typeInfo.icon} {typeInfo.label} Grievances
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage grievances for {typeInfo.label.toLowerCase()} devices
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="grievances">
        <TabsList className="mb-6">
          <TabsTrigger value="grievances" className="gap-2">
            <TicketIcon className="w-4 h-4" />
            Grievances
          </TabsTrigger>
          <TabsTrigger value="mis" className="gap-2">
            <FileText className="w-4 h-4" />
            MIS Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grievances">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TicketIcon className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{ticketStats.total}</p>
                    <p className="text-xs text-muted-foreground">All</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">{ticketStats.pending}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                  <div>
                    <p className="text-2xl font-bold">{ticketStats.escalated}</p>
                    <p className="text-xs text-muted-foreground">Escalated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-info" />
                  <div>
                    <p className="text-2xl font-bold">{ticketStats.inProgress}</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">{ticketStats.resolved}</p>
                    <p className="text-xs text-muted-foreground">Resolved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{ticketStats.closed}</p>
                    <p className="text-xs text-muted-foreground">Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by grievance ID, farmer ID, pump ID, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as TicketStatus | "all")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grievance ID</TableHead>
                    <TableHead>Farmer ID</TableHead>
                    <TableHead>Pump ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>SLA Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Vendor</TableHead>
                    <TableHead>Expected Resolution</TableHead>
                    <TableHead>Escalation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        No tickets found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTickets.map((ticket) => (
                      <TableRow key={ticket.grievance_id}>
                        <TableCell className="font-mono text-sm">{ticket.grievance_id}</TableCell>
                        <TableCell>{ticket.farmer_id}</TableCell>
                        <TableCell className="font-mono text-sm">{ticket.pump_id}</TableCell>
                        <TableCell className="max-w-xs truncate">{ticket.category}</TableCell>
                        <TableCell>{ticket.created_date ? new Date(ticket.created_date).toLocaleDateString() : "-"}</TableCell>
                        <TableCell>{ticket.sla_hours}h</TableCell>
                        <TableCell>{getStatusBadge(ticket.current_status)}</TableCell>
                        <TableCell>{ticket.assigned_vendor}</TableCell>
                        <TableCell>{ticket.expected_resolution_date ? new Date(ticket.expected_resolution_date).toLocaleDateString() : "-"}</TableCell>
                        <TableCell>{getEscalationBadge(ticket.escalation_level)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTickets.length)} of {filteredTickets.length} tickets
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Clock className="h-4 w-4 rotate-180" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => goToPage(page)}
                    className="w-8 h-8"
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="mis">
          <MISReport tickets={filteredTickets} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ManagerGrievances;
