import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useGrievance, TicketStatus, Ticket } from "@/context/GrievanceContext";
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

const categories = [
  "Pump Not Working",
  "Inverter Error",
  "Power Fluctuation",
  "Complete Failure",
  "Capacity Upgrade Request",
  "Panel Cleaning Required",
  "Battery Not Charging",
  "Wire Damage",
  "Controller Malfunction",
  "Sensor Not Working",
  "Lights Flickering",
  "Inverter Noise",
  "Power Outage",
  "Low Water Discharge",
];

const vendors = [
  "Green Energy Solutions",
  "Solar Tech India",
  "Eco Power Systems",
  "Sunrise Energy",
  "NA",
];

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

  // Form state with new columns
  const [formData, setFormData] = useState({
    farmer_id: user?.id || "",
    pump_id: "",
    category: "",
    sla_hours: 24,
    assigned_vendor: "NA",
    expected_resolution_date: "",
    escalation_level: 0,
  });

  const userTickets = user ? getTicketsByUser(user.id) : [];

  const filteredTickets = userTickets.filter((ticket) => {
    const matchesSearch =
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.grievance_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.pump_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.current_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const ticketData = {
        farmer_id: formData.farmer_id || user.id,
        pump_id: formData.pump_id,
        category: formData.category,
        sla_hours: formData.sla_hours,
        assigned_vendor: formData.assigned_vendor,
        expected_resolution_date: formData.expected_resolution_date,
        escalation_level: formData.escalation_level,
      };

      const newTicket = await addTicket(ticketData);
      sendEmailNotification(newTicket);

      toast({
        title: t("ticketCreatedSuccess"),
        description: "Grievance ticket has been created successfully.",
      });

      setIsCreateOpen(false);
      setFormData({
        farmer_id: user?.id || "",
        pump_id: "",
        category: "",
        sla_hours: 24,
        assigned_vendor: "NA",
        expected_resolution_date: "",
        escalation_level: 0,
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
    total: userTickets.length,
    pending: userTickets.filter((t) => t.current_status === "pending" || t.current_status === "Open").length,
    inProgress: userTickets.filter((t) => t.current_status === "in_progress" || t.current_status === "In Progress").length,
    resolved: userTickets.filter((t) => t.current_status === "resolved" || t.current_status === "Resolved").length,
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
            placeholder="Search by grievance ID, pump ID, or category..."
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
                <TableHead>Grievance ID</TableHead>
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
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    {t("noTicketsFound")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.grievance_id}>
                    <TableCell className="font-mono text-sm">{ticket.grievance_id}</TableCell>
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
    </DashboardLayout>
  );
};

export default UserGrievances;
