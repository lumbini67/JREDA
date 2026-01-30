import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { useGrievance, TicketStatus, Priority, Ticket } from "@/context/GrievanceContext";
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
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    userName: "",
    userMobile: "",
    userEmail: "",
    district: "",
    site: "",
    dueDate: "",
    issueDescription: "",
    priority: "medium" as Priority,
    fromDate: "",
    contractor: "NA",
    images: [] as string[],
  });

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.site.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesDistrict = districtFilter === "all" || ticket.district.toLowerCase() === districtFilter.toLowerCase();
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesDistrict && matchesPriority;
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
  }, [searchTerm, statusFilter, districtFilter, priorityFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTicket = addTicket({
      userId: "admin",
      userName: formData.userName,
      userMobile: formData.userMobile,
      userEmail: formData.userEmail,
      district: formData.district,
      site: formData.site,
      dueDate: formData.dueDate,
      issueDescription: formData.issueDescription,
      priority: formData.priority,
      fromDate: formData.fromDate || undefined,
      contractor: formData.contractor,
      images: formData.images,
    });

    sendEmailNotification(newTicket);

    toast({
      title: t("ticketCreatedSuccess"),
      description: t("emailSent"),
    });

    setIsCreateOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      userMobile: "",
      userEmail: "",
      district: "",
      site: "",
      dueDate: "",
      issueDescription: "",
      priority: "medium",
      fromDate: "",
      contractor: "NA",
      images: [],
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
      resolved: "bg-success/10 text-success border-success/30",
      closed: "bg-muted text-muted-foreground border-border",
    };
    return (
      <Badge variant="outline" className={variants[status]}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{t(status === "in_progress" ? "inProgress" : status)}</span>
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
    return <Badge className={variants[priority]}>{t(priority)}</Badge>;
  };

  const ticketStats = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === "pending").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
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
                  {t("fillDetails")}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("yourName")} *</Label>
                    <Input
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("mobileNumber")} *</Label>
                    <Input
                      type="tel"
                      value={formData.userMobile}
                      onChange={(e) => setFormData({ ...formData, userMobile: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("email")} *</Label>
                    <Input
                      type="email"
                      value={formData.userEmail}
                      onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("selectDistrict")} *</Label>
                    <Select
                      value={formData.district}
                      onValueChange={(val) => setFormData({ ...formData, district: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectDistrict")} />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((d) => (
                          <SelectItem key={d} value={d}>{t(d)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("selectSite")} *</Label>
                    <Input
                      value={formData.site}
                      onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("dueDate")} *</Label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("priorityLevel")} *</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(val) => setFormData({ ...formData, priority: val as Priority })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t("low")}</SelectItem>
                        <SelectItem value="medium">{t("medium")}</SelectItem>
                        <SelectItem value="high">{t("high")}</SelectItem>
                        <SelectItem value="critical">{t("critical")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fromDate")}</Label>
                    <Input
                      type="date"
                      value={formData.fromDate}
                      onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("contractor")}</Label>
                    <Input
                      value={formData.contractor}
                      onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                      placeholder="NA"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("issueDescription")} *</Label>
                  <Textarea
                    value={formData.issueDescription}
                    onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("uploadImages")}</Label>
                  <Input type="file" multiple accept="image/*" />
                  <p className="text-xs text-muted-foreground">Upload one or more images related to the issue</p>
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
            placeholder={t("searchTickets")}
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
        <Select value={districtFilter} onValueChange={setDistrictFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t("selectDistrict")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allDistricts")}</SelectItem>
            {districts.map((d) => (
              <SelectItem key={d} value={d}>{t(d)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(val) => setPriorityFilter(val as Priority | "all")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t("priorityLevel")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="low">{t("low")}</SelectItem>
            <SelectItem value="medium">{t("medium")}</SelectItem>
            <SelectItem value="high">{t("high")}</SelectItem>
            <SelectItem value="critical">{t("critical")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{t("yourName")}</TableHead>
                <TableHead>{t("issueDescription")}</TableHead>
                <TableHead>{t("selectDistrict")}</TableHead>
                <TableHead>{t("priorityLevel")}</TableHead>
                <TableHead>{t("ticketStatus")}</TableHead>
                <TableHead>{t("dueDate")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {t("noTicketsFound")}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                    <TableCell>{ticket.userName}</TableCell>
                    <TableCell className="max-w-xs truncate">{ticket.issueDescription.slice(0, 40)}...</TableCell>
                    <TableCell>{t(ticket.district.toLowerCase())}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{ticket.dueDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedTicket(ticket); setIsViewOpen(true); }}>
                            <Eye className="w-4 h-4 mr-2" />
                            {t("viewDetails")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "in_progress")}>
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {t("markInProgress")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "resolved")}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {t("markResolved")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "closed")}>
                            <XCircle className="w-4 h-4 mr-2" />
                            {t("markClosed")}
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
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTickets.length)} of {filteredTickets.length} tickets
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                page === "..." ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
                ) : (
                  <Button
                    key={page as number}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => goToPage(page as number)}
                  >
                    {page}
                  </Button>
                )
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Ticket Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ticket Details - {selectedTicket?.id}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">{t("yourName")}</Label>
                  <p className="font-medium">{selectedTicket.userName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t("mobileNumber")}</Label>
                  <p className="font-medium">{selectedTicket.userMobile}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t("email")}</Label>
                  <p className="font-medium">{selectedTicket.userEmail}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t("selectDistrict")}</Label>
                  <p className="font-medium">{selectedTicket.district}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t("selectSite")}</Label>
                  <p className="font-medium">{selectedTicket.site}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t("dueDate")}</Label>
                  <p className="font-medium">{selectedTicket.dueDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t("priorityLevel")}</Label>
                  <p>{getPriorityBadge(selectedTicket.priority)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t("ticketStatus")}</Label>
                  <p>{getStatusBadge(selectedTicket.status)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t("contractor")}</Label>
                  <p className="font-medium">{selectedTicket.contractor}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created At</Label>
                  <p className="font-medium">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">{t("issueDescription")}</Label>
                <p className="font-medium mt-1">{selectedTicket.issueDescription}</p>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => handleStatusChange(selectedTicket.id, "in_progress")}>
                  Mark In Progress
                </Button>
                <Button variant="outline" className="text-success" onClick={() => handleStatusChange(selectedTicket.id, "resolved")}>
                  {t("resolve")}
                </Button>
                <Button variant="outline" onClick={() => handleStatusChange(selectedTicket.id, "closed")}>
                  {t("close")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminGrievances;
