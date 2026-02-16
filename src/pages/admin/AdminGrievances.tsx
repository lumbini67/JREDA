import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { useGrievance, TicketStatus, Ticket } from "@/context/GrievanceContext";
import { useAuth } from "@/context/AuthContext";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ticket as TicketIcon,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const districts = ["ranchi", "dhanbad", "bokaro", "jamshedpur", "hazaribagh", "giridih", "deoghar", "dumka", "simdega", "palamu", "latehar", "gumla", "chaibasa"];

const ITEMS_PER_PAGE = 10;

const categories = [
  "Solar Pumps",
  "Mini Grids",
  "Rooftop Solar",
  "Solar Water Heater",
  "Solar Street Light",
  "Solar High Mast",
  "PM-KUSUM Scheme (A & C)",
  "Solar PV Off-Grid Systems",
  "PM JANMAN",
  "Giridih Solar City",
  "Canal-Top Solar Plants",
];

const vendors = [
  "Green Energy Solutions",
  "Solar Tech India",
  "Eco Power Systems",
  "Sunrise Energy",
  "NA",
];

const AdminGrievances = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { tickets, addTicket, updateTicketStatus, sendEmailNotification, refreshTickets } = useGrievance();
  const { toast } = useToast();

  // Refresh tickets from localStorage on mount and when window gains focus
  useEffect(() => {
    refreshTickets();
    
    const handleFocus = () => {
      refreshTickets();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Form state with new columns
  const [formData, setFormData] = useState({
    farmer_id: "",
    pump_id: "",
    category: "",
    sla_hours: 24,
    assigned_vendor: "NA",
    expected_resolution_date: "",
    escalation_level: 0,
  });

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.grievance_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.farmer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.pump_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.current_status === statusFilter;
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
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

  // Generate smart page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Show pages 2, 3, 4 and ellipsis
        pages.push(2, 3, 4);
        pages.push("...");
      } else if (currentPage >= totalPages - 2) {
        // Show ellipsis and last few pages
        pages.push("...");
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        // Show ellipsis, current range, ellipsis
        pages.push("...");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("...");
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newTicket = await addTicket({
        farmer_id: formData.farmer_id,
        pump_id: formData.pump_id,
        category: formData.category,
        sla_hours: formData.sla_hours,
        assigned_vendor: formData.assigned_vendor,
        expected_resolution_date: formData.expected_resolution_date,
        escalation_level: formData.escalation_level,
      });

      sendEmailNotification(newTicket);

      toast({
        title: t("ticketCreatedSuccess"),
        description: "Grievance ticket has been created successfully.",
      });

      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: t("ticketCreationFailed"),
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      farmer_id: "",
      pump_id: "",
      category: "",
      sla_hours: 24,
      assigned_vendor: "NA",
      expected_resolution_date: "",
      escalation_level: 0,
    });
  };

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    updateTicketStatus(ticketId, newStatus);
    toast({
      title: t("statusUpdated"),
      description: `${t("statusChangedTo")} ${t(newStatus === "in_progress" ? "inProgress" : newStatus)}`,
    });
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
      case "in_progress":
        return <AlertCircle className="w-4 h-4 text-info" />;
      case "escalated":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "closed":
        return <XCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    const variants: Record<TicketStatus, string> = {
      pending: "bg-warning/10 text-warning border-warning/30",
      in_progress: "bg-info/10 text-info border-info/30",
      escalated: "bg-destructive/10 text-destructive border-destructive/30",
      resolved: "bg-success/10 text-success border-success/30",
      closed: "bg-muted text-muted-foreground border-border",
    };
    const labels: Record<TicketStatus, string> = {
      pending: "Open",
      in_progress: "In Progress",
      escalated: "Escalated",
      resolved: "Resolved",
      closed: "Closed",
    };
    return (
      <Badge variant="outline" className={variants[status]}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{labels[status]}</span>
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
    total: tickets.length,
    pending: tickets.filter((t) => t.current_status === "pending" || t.current_status === "Open").length,
    inProgress: tickets.filter((t) => t.current_status === "in_progress" || t.current_status === "In Progress").length,
    escalated: tickets.filter((t) => t.current_status === "escalated").length,
    resolved: tickets.filter((t) => t.current_status === "resolved" || t.current_status === "Resolved").length,
    closed: tickets.filter((t) => t.current_status === "closed" || t.current_status === "Closed").length,
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("manageTickets")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("allTickets")} - Admin Panel
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {t("createTicket")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("createTicket")}</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new grievance ticket
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Farmer ID *</Label>
                    <Input
                      value={formData.farmer_id}
                      onChange={(e) => setFormData({ ...formData, farmer_id: e.target.value })}
                      placeholder="e.g., u1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pump ID *</Label>
                    <Input
                      value={formData.pump_id}
                      onChange={(e) => setFormData({ ...formData, pump_id: e.target.value })}
                      placeholder="e.g., PUMP-KANK-001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => setFormData({ ...formData, category: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>SLA Hours *</Label>
                    <Input
                      type="number"
                      value={formData.sla_hours}
                      onChange={(e) => setFormData({ ...formData, sla_hours: parseInt(e.target.value) || 24 })}
                      min={1}
                      max={168}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Assigned Vendor</Label>
                    <Select
                      value={formData.assigned_vendor}
                      onValueChange={(val) => setFormData({ ...formData, assigned_vendor: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Resolution Date *</Label>
                    <Input
                      type="date"
                      value={formData.expected_resolution_date}
                      onChange={(e) => setFormData({ ...formData, expected_resolution_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Escalation Level</Label>
                    <Select
                      value={formData.escalation_level.toString()}
                      onValueChange={(val) => setFormData({ ...formData, escalation_level: parseInt(val) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Level 0</SelectItem>
                        <SelectItem value="1">Level 1</SelectItem>
                        <SelectItem value="2">Level 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    {t("cancel")}
                  </Button>
                  <Button type="submit">{t("submit")}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
                <p className="text-xs text-muted-foreground">{t("all")}</p>
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
                <p className="text-xs text-muted-foreground">{t("pending")}</p>
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
                <p className="text-xs text-muted-foreground">{t("inProgress")}</p>
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
                <p className="text-xs text-muted-foreground">{t("resolved")}</p>
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
                <p className="text-xs text-muted-foreground">{t("closed")}</p>
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
            <SelectValue placeholder={t("ticketStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="pending">{t("pending")}</SelectItem>
            <SelectItem value="in_progress">{t("inProgress")}</SelectItem>
            <SelectItem value="resolved">{t("resolved")}</SelectItem>
            <SelectItem value="closed">{t("closed")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
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
                <TableHead>Updated Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                    {t("noTicketsFound")}
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
                    <TableCell>{ticket.updated_date ? new Date(ticket.updated_date).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedTicket(ticket); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(ticket.grievance_id, "in_progress")}>
                            <Edit className="h-4 w-4 mr-2" />
                            Mark In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(ticket.grievance_id, "resolved")}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(ticket.grievance_id, "closed")}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Mark Closed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {getPageNumbers().map((page, index) => (
              typeof page === "number" ? (
                <Button
                  key={index}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => goToPage(page)}
                  className="w-8 h-8"
                >
                  {page}
                </Button>
              ) : (
                <span key={index} className="px-2">...</span>
              )
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Grievance Details - {selectedTicket?.grievance_id}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Farmer ID</Label>
                <p className="text-sm mt-1">{selectedTicket.farmer_id}</p>
              </div>
              <div>
                <Label>Pump ID</Label>
                <p className="text-sm mt-1">{selectedTicket.pump_id}</p>
              </div>
              <div>
                <Label>Category</Label>
                <p className="text-sm mt-1">{selectedTicket.category}</p>
              </div>
              <div>
                <Label>Current Status</Label>
                <div className="mt-1">{getStatusBadge(selectedTicket.current_status)}</div>
              </div>
              <div>
                <Label>Created Date</Label>
                <p className="text-sm mt-1">{selectedTicket.created_date ? new Date(selectedTicket.created_date).toLocaleString() : "-"}</p>
              </div>
              <div>
                <Label>SLA Hours</Label>
                <p className="text-sm mt-1">{selectedTicket.sla_hours} hours</p>
              </div>
              <div>
                <Label>Assigned Vendor</Label>
                <p className="text-sm mt-1">{selectedTicket.assigned_vendor}</p>
              </div>
              <div>
                <Label>Expected Resolution Date</Label>
                <p className="text-sm mt-1">{selectedTicket.expected_resolution_date ? new Date(selectedTicket.expected_resolution_date).toLocaleDateString() : "-"}</p>
              </div>
              <div>
                <Label>Escalation Level</Label>
                <div className="mt-1">{getEscalationBadge(selectedTicket.escalation_level)}</div>
              </div>
              <div>
                <Label>Updated Date</Label>
                <p className="text-sm mt-1">{selectedTicket.updated_date ? new Date(selectedTicket.updated_date).toLocaleString() : "-"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminGrievances;
