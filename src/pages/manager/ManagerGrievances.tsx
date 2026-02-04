import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth, MachineType } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TicketStatus, Priority, useGrievance } from "@/context/GrievanceContext";

const typeConfig: Record<MachineType, { label: string; icon: string }> = {
  solar_pump: { label: "Solar Pump", icon: "☀️" },
  mini_grid: { label: "Mini Grid", icon: "⚡" },
  rooftop_solar: { label: "Rooftop Solar", icon: "🏠" },
};

// Dummy tickets filtered by machine type
const getDummyTickets = (type: MachineType) => {
  const tickets = {
    solar_pump: [
      { id: "SP-T001", userName: "Ramesh Kumar", district: "Ranchi", site: "Kanke Village", issueDescription: "Solar pump not starting in morning", priority: "high" as Priority, status: "pending" as TicketStatus, createdAt: "2024-01-15T10:30:00Z" },
      { id: "SP-T002", userName: "Suresh Singh", district: "Ranchi", site: "Ratu Block", issueDescription: "Low water output from pump", priority: "medium" as Priority, status: "in_progress" as TicketStatus, createdAt: "2024-01-14T14:20:00Z" },
      { id: "SP-T003", userName: "Ajay Kumar", district: "Ranchi", site: "Ormanjhi", issueDescription: "Sensor malfunction alert", priority: "low" as Priority, status: "resolved" as TicketStatus, createdAt: "2024-01-10T09:15:00Z" },
      { id: "SP-T004", userName: "Deepak Sharma", district: "Ranchi", site: "Kanke Block", issueDescription: "Panel cleaning required", priority: "medium" as Priority, status: "pending" as TicketStatus, createdAt: "2024-01-16T08:00:00Z" },
      { id: "SP-T005", userName: "Vikram Patel", district: "Ranchi", site: "Ranchi Sadar", issueDescription: "Inverter fault detected", priority: "high" as Priority, status: "in_progress" as TicketStatus, createdAt: "2024-01-15T16:45:00Z" },
    ],
    mini_grid: [
      { id: "MG-T001", userName: "Gram Pradhan", district: "Ranchi", site: "Lapra Village", issueDescription: "Mini grid power fluctuation", priority: "high" as Priority, status: "pending" as TicketStatus, createdAt: "2024-01-15T11:00:00Z" },
      { id: "MG-T002", userName: "Village Sarpanch", district: "Ranchi", site: "Tati Village", issueDescription: "Battery not charging properly", priority: "medium" as Priority, status: "in_progress" as TicketStatus, createdAt: "2024-01-14T13:30:00Z" },
      { id: "MG-T003", userName: "Anganwadi Worker", district: "Ranchi", site: "Rahe Village", issueDescription: "Lights not working in community center", priority: "low" as Priority, status: "resolved" as TicketStatus, createdAt: "2024-01-12T10:00:00Z" },
    ],
    rooftop_solar: [
      { id: "RS-T001", userName: "Hospital Admin", district: "Ranchi", site: "Govt Hospital", issueDescription: "Rooftop panel damage due to storm", priority: "high" as Priority, status: "pending" as TicketStatus, createdAt: "2024-01-15T09:00:00Z" },
      { id: "RS-T002", userName: "School Principal", district: "Ranchi", site: "High School", issueDescription: "Inverter replacement needed", priority: "medium" as Priority, status: "in_progress" as TicketStatus, createdAt: "2024-01-14T15:00:00Z" },
      { id: "RS-T003", userName: "Office Clerk", district: "Ranchi", site: "JREDA Office", issueDescription: "Monitoring system showing error", priority: "low" as Priority, status: "resolved" as TicketStatus, createdAt: "2024-01-13T11:30:00Z" },
    ],
  };
  return tickets[type] || tickets.solar_pump;
};

const ITEMS_PER_PAGE = 10;

const ManagerGrievances = () => {
  const { machineType } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState(getDummyTickets(machineType || "solar_pump"));

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.site.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
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
    };
    return (
      <Badge variant="outline" className={variants[status]}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status === "in_progress" ? "In Progress" : status}</span>
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Priority) => {
    const variants: Record<Priority, string> = {
      low: "bg-muted text-muted-foreground",
      medium: "bg-info/10 text-info",
      high: "bg-warning/10 text-warning",
      critical: "bg-destructive/10 text-destructive",
    };
    return <Badge className={variants[priority]}>{priority}</Badge>;
  };

  const ticketStats = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === "pending").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
            placeholder="Search tickets..."
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
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(val) => setPriorityFilter(val as Priority | "all")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-mono">{ticket.id}</TableCell>
                <TableCell>{ticket.userName}</TableCell>
                <TableCell>{ticket.site}</TableCell>
                <TableCell className="max-w-xs truncate">{ticket.issueDescription}</TableCell>
                <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {filteredTickets.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTickets.length)} of {filteredTickets.length} tickets
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
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
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {filteredTickets.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No tickets found matching your filters.</p>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default ManagerGrievances;
