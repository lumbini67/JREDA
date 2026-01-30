import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useGrievance, TicketStatus, Priority, Ticket } from "@/context/GrievanceContext";
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
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const districts = ["Ranchi", "Dhanbad", "Bokaro", "Jamshedpur", "Hazaribagh", "Giridih", "Deoghar", "Dumka"];

const UserGrievances = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { tickets, addTicket, getTicketsByUser, sendEmailNotification, refreshTickets } = useGrievance();
  const { toast } = useToast();
  const navigate = useNavigate();

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");

  // Form state
  const [formData, setFormData] = useState({
    userName: user?.name || "",
    userMobile: "",
    userEmail: user?.email || "",
    district: user?.district || "",
    site: "",
    dueDate: "",
    issueDescription: "",
    priority: "medium" as Priority,
    fromDate: "",
    contractor: "NA",
    images: [] as string[],
  });

  const userTickets = user ? getTicketsByUser(user.id) : [];

  const filteredTickets = userTickets.filter((ticket) => {
    const matchesSearch =
      ticket.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.site.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const ticketData = {
      userId: user.id,
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
    };

    try {
      const newTicket = await addTicket(ticketData);
      sendEmailNotification(newTicket);

      toast({
        title: t("ticketCreatedSuccess"),
        description: t("emailSent"),
      });

      setIsCreateOpen(false);
      setFormData({
        userName: user?.name || "",
        userMobile: "",
        userEmail: user?.email || "",
        district: user?.district || "",
        site: "",
        dueDate: "",
        issueDescription: "",
        priority: "medium",
        fromDate: "",
        contractor: "NA",
        images: [],
      });
    } catch (error) {
      toast({
        title: t("ticketCreationFailed"),
        description: t("pleaseTryAgain"),
        variant: "destructive",
      });
    }
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
    total: userTickets.length,
    pending: userTickets.filter((t) => t.status === "pending").length,
    inProgress: userTickets.filter((t) => t.status === "in_progress").length,
    resolved: userTickets.filter((t) => t.status === "resolved").length,
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("myTickets")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("grievances")} - {user?.name}
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
                  Fill in the details to create a new support ticket
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
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectDistrict")} />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TicketIcon className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{ticketStats.total}</p>
                <p className="text-xs text-muted-foreground">{t("all")} {t("grievances")}</p>
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
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder={t("filterByStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="pending">{t("pending")}</SelectItem>
            <SelectItem value="in_progress">{t("inProgress")}</SelectItem>
            <SelectItem value="resolved">{t("resolved")}</SelectItem>
            <SelectItem value="closed">{t("closed")}</SelectItem>
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
                <TableHead>{t("issueDescription")}</TableHead>
                <TableHead>{t("selectDistrict")}</TableHead>
                <TableHead>{t("priorityLevel")}</TableHead>
                <TableHead>{t("ticketStatus")}</TableHead>
                <TableHead>{t("dueDate")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t("noTicketsFound")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                    <TableCell className="max-w-xs truncate">{ticket.issueDescription}</TableCell>
                    <TableCell>{ticket.district}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{ticket.dueDate}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default UserGrievances;
