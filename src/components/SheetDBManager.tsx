import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketsByDistrict,
  type SheetDBTicket,
  type CreateTicketData,
} from "@/services/sheetdb";
import { populateSheetDB, checkSheetDBStatus, dummyTicketsData } from "@/services/populateSheetDB";
import { RefreshCw, Plus, Trash2, Save, Database, Upload } from "lucide-react";

export function SheetDBManager() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SheetDBTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New ticket form state
  const [newTicket, setNewTicket] = useState<CreateTicketData>({
    userId: "",
    userName: "",
    userMobile: "",
    userEmail: "",
    district: "",
    site: "",
    dueDate: "",
    issueDescription: "",
    priority: "medium",
    contractor: "",
    deviceType: "solar_pump",
  });

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets();
      setTickets(data);
      toast({
        title: "Tickets Loaded",
        description: `Loaded ${data.length} tickets from SheetDB`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tickets from SheetDB",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePopulate = async () => {
    setSyncing(true);
    try {
      await populateSheetDB(10);
      await loadTickets();
      toast({
        title: "Data Populated",
        description: "Dummy data has been added to SheetDB",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to populate SheetDB",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.userName || !newTicket.district || !newTicket.issueDescription) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTicket(newTicket);
      await loadTickets();
      setShowAddForm(false);
      setNewTicket({
        userId: "",
        userName: "",
        userMobile: "",
        userEmail: "",
        district: "",
        site: "",
        dueDate: "",
        issueDescription: "",
        priority: "medium",
        contractor: "",
        deviceType: "solar_pump",
      });
      toast({
        title: "Ticket Created",
        description: "New ticket has been added to SheetDB",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      await updateTicket(ticketId, { status: newStatus as SheetDBTicket["status"] });
      await loadTickets();
      toast({
        title: "Status Updated",
        description: `Ticket ${ticketId} status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm(`Are you sure you want to delete ticket ${ticketId}?`)) return;

    try {
      await deleteTicket(ticketId);
      await loadTickets();
      toast({
        title: "Ticket Deleted",
        description: `Ticket ${ticketId} has been removed`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ticket",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadTickets();
    checkSheetDBStatus();
  }, []);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    in_progress: "bg-blue-500",
    resolved: "bg-green-500",
    closed: "bg-gray-500",
  };

  const priorityColors: Record<string, string> = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            SheetDB Ticket Management
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadTickets} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="default" size="sm" onClick={handlePopulate} disabled={syncing}>
              <Upload className="w-4 h-4 mr-2" />
              {syncing ? "Populating..." : "Populate Dummy Data"}
            </Button>
            <Button variant="default" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Ticket
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add Ticket Form */}
          {showAddForm && (
            <Card className="mb-6 bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-lg">Add New Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="userName">User Name *</Label>
                    <Input
                      id="userName"
                      value={newTicket.userName}
                      onChange={(e) => setNewTicket({ ...newTicket, userName: e.target.value })}
                      placeholder="Enter user name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userMobile">Mobile</Label>
                    <Input
                      id="userMobile"
                      value={newTicket.userMobile}
                      onChange={(e) => setNewTicket({ ...newTicket, userMobile: e.target.value })}
                      placeholder="Mobile number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={newTicket.userEmail}
                      onChange={(e) => setNewTicket({ ...newTicket, userEmail: e.target.value })}
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">District *</Label>
                    <Select
                      value={newTicket.district}
                      onValueChange={(value) => setNewTicket({ ...newTicket, district: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ranchi">Ranchi</SelectItem>
                        <SelectItem value="Dhanbad">Dhanbad</SelectItem>
                        <SelectItem value="Bokaro">Bokaro</SelectItem>
                        <SelectItem value="Jamshedpur">Jamshedpur</SelectItem>
                        <SelectItem value="Hazaribagh">Hazaribagh</SelectItem>
                        <SelectItem value="Giridih">Giridih</SelectItem>
                        <SelectItem value="Deoghar">Deoghar</SelectItem>
                        <SelectItem value="Dumka">Dumka</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="site">Site</Label>
                    <Input
                      id="site"
                      value={newTicket.site}
                      onChange={(e) => setNewTicket({ ...newTicket, site: e.target.value })}
                      placeholder="Site location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTicket.dueDate}
                      onChange={(e) => setNewTicket({ ...newTicket, dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTicket.priority}
                      onValueChange={(value) => setNewTicket({ ...newTicket, priority: value as CreateTicketData["priority"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contractor">Contractor</Label>
                    <Input
                      id="contractor"
                      value={newTicket.contractor}
                      onChange={(e) => setNewTicket({ ...newTicket, contractor: e.target.value })}
                      placeholder="Contractor name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deviceType">Device Type</Label>
                    <Select
                      value={newTicket.deviceType}
                      onValueChange={(value) => setNewTicket({ ...newTicket, deviceType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solar_pump">Solar Pump</SelectItem>
                        <SelectItem value="rooftop_solar">Rooftop Solar</SelectItem>
                        <SelectItem value="mini_grid">Mini Grid</SelectItem>
                        <SelectItem value="high_mast">High Mast</SelectItem>
                        <SelectItem value="street_light">Street Light</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <Label htmlFor="issueDescription">Issue Description *</Label>
                    <Input
                      id="issueDescription"
                      value={newTicket.issueDescription}
                      onChange={(e) => setNewTicket({ ...newTicket, issueDescription: e.target.value })}
                      placeholder="Describe the issue..."
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleCreateTicket}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Ticket
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tickets List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Tickets ({tickets.length})</h3>
            </div>
            
            {tickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tickets found in SheetDB</p>
                <p className="text-sm">Click "Populate Dummy Data" to add sample tickets</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-muted-foreground">{ticket.id}</span>
                          <Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                          <Badge className={`${statusColors[ticket.status]} text-white`}>{ticket.status}</Badge>
                        </div>
                        <p className="font-medium">{ticket.issueDescription}</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.userName} • {ticket.district} • {ticket.site}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(ticket.createdAt).toLocaleDateString()} • Due: {ticket.dueDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={ticket.status}
                          onValueChange={(value) => handleUpdateStatus(ticket.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
