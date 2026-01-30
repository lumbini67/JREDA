import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Phone,
  Mail,
  Smartphone,
  Globe,
  Search,
  Filter,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle,
  Timer,
  MessageCircle,
} from "lucide-react";

const grievanceData = [
  {
    id: "GRV-2024-1234",
    title: "Solar pump motor not starting",
    beneficiary: "Ramesh Kumar",
    contact: "+91 9876543210",
    district: "Ranchi",
    block: "Kanke",
    pumpId: "JREDA-SPP-001",
    channel: "WhatsApp",
    status: "pending",
    priority: "high",
    createdAt: "2024-12-30T10:30:00",
    description: "The pump motor is not starting since yesterday morning. Display shows error code E-12.",
    sentiment: "frustrated",
  },
  {
    id: "GRV-2024-1235",
    title: "Low water discharge",
    beneficiary: "Sita Devi",
    contact: "+91 9876543211",
    district: "Hazaribagh",
    block: "Ichak",
    pumpId: "JREDA-SPP-002",
    channel: "IVR",
    status: "in-progress",
    priority: "medium",
    createdAt: "2024-12-30T08:15:00",
    description: "Water output has reduced significantly over the past week. Previously 200 L/min, now only 80 L/min.",
    sentiment: "concerned",
  },
  {
    id: "GRV-2024-1236",
    title: "Controller display malfunction",
    beneficiary: "Mohan Prasad",
    contact: "+91 9876543212",
    district: "Dhanbad",
    block: "Topchanchi",
    pumpId: "JREDA-SPP-003",
    channel: "Web Portal",
    status: "resolved",
    priority: "low",
    createdAt: "2024-12-29T14:00:00",
    description: "Controller LCD screen is flickering. Sometimes shows garbled text.",
    sentiment: "neutral",
  },
  {
    id: "GRV-2024-1237",
    title: "Inverter overheating warning",
    beneficiary: "Lakshmi Oraon",
    contact: "+91 9876543213",
    district: "Bokaro",
    block: "Chas",
    pumpId: "JREDA-SPP-004",
    channel: "Mobile App",
    status: "pending",
    priority: "high",
    createdAt: "2024-12-30T11:45:00",
    description: "Getting repeated overheating alarms. Pump shuts down automatically after 2 hours of operation.",
    sentiment: "worried",
  },
  {
    id: "GRV-2024-1238",
    title: "Solar panel cleaning required",
    beneficiary: "Birsa Munda",
    contact: "+91 9876543214",
    district: "Giridih",
    block: "Bengabad",
    pumpId: "JREDA-SPP-005",
    channel: "SMS",
    status: "in-progress",
    priority: "low",
    createdAt: "2024-12-28T09:30:00",
    description: "Panels are very dusty. Generation has dropped by 30%. Need maintenance visit.",
    sentiment: "neutral",
  },
];

const channelIcons: Record<string, React.ElementType> = {
  WhatsApp: MessageCircle,
  IVR: Phone,
  "Web Portal": Globe,
  "Mobile App": Smartphone,
  SMS: MessageSquare,
  Email: Mail,
};

const statusStyles = {
  pending: "bg-warning/10 text-warning border-warning/30",
  "in-progress": "bg-info/10 text-info border-info/30",
  resolved: "bg-success/10 text-success border-success/30",
};

const priorityStyles = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-muted text-muted-foreground",
};

const Grievances = () => {
  const [selectedGrievance, setSelectedGrievance] = useState(grievanceData[0]);

  const pendingCount = grievanceData.filter((g) => g.status === "pending").length;
  const inProgressCount = grievanceData.filter((g) => g.status === "in-progress").length;
  const resolvedCount = grievanceData.filter((g) => g.status === "resolved").length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Grievance Management</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered omnichannel grievance redressal system
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-warning">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-info/5 border-info/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
              <Timer className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-info">{inProgressCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolved Today</p>
              <p className="text-2xl font-bold text-success">{resolvedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Resolution</p>
              <p className="text-2xl font-bold text-foreground">4.2 hrs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Omnichannel Indicator */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Channels:</span>
              {Object.entries(channelIcons).map(([channel, Icon]) => (
                <div
                  key={channel}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary/50 text-sm"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{channel}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm font-medium text-success">AI Chatbot Active 24×7</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grievance List */}
        <div className="lg:col-span-1">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="space-y-3">
                <CardTitle className="text-lg">Tickets</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search tickets..." className="pl-10" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-3 space-y-2">
              {grievanceData.map((grievance) => {
                const ChannelIcon = channelIcons[grievance.channel] || MessageSquare;
                const isSelected = selectedGrievance.id === grievance.id;
                
                return (
                  <div
                    key={grievance.id}
                    onClick={() => setSelectedGrievance(grievance)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-secondary/30 hover:bg-secondary/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        {grievance.id}
                      </span>
                      <Badge
                        variant="outline"
                        className={statusStyles[grievance.status as keyof typeof statusStyles]}
                      >
                        {grievance.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-2 line-clamp-1">
                      {grievance.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ChannelIcon className="w-3 h-3" />
                        {grievance.channel}
                      </div>
                      <span>{formatDate(grievance.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Grievance Details */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-muted-foreground">
                      {selectedGrievance.id}
                    </span>
                    <Badge
                      className={priorityStyles[selectedGrievance.priority as keyof typeof priorityStyles]}
                    >
                      {selectedGrievance.priority} priority
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{selectedGrievance.title}</CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className={statusStyles[selectedGrievance.status as keyof typeof statusStyles]}
                >
                  {selectedGrievance.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6">
              <Tabs defaultValue="details" className="h-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6">
                  {/* Beneficiary Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-secondary/30">
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Beneficiary</span>
                      </div>
                      <p className="font-semibold">{selectedGrievance.beneficiary}</p>
                      <p className="text-sm text-muted-foreground">{selectedGrievance.contact}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/30">
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">Location</span>
                      </div>
                      <p className="font-semibold">{selectedGrievance.district}</p>
                      <p className="text-sm text-muted-foreground">Block: {selectedGrievance.block}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Issue Description
                    </h4>
                    <p className="text-foreground leading-relaxed p-4 rounded-xl bg-secondary/30">
                      {selectedGrievance.description}
                    </p>
                  </div>

                  {/* Linked Pump */}
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Linked Pump</p>
                        <p className="font-mono font-medium">{selectedGrievance.pumpId}</p>
                      </div>
                      <Button variant="outline" size="sm">View Pump Status</Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button className="flex-1">Assign to Technician</Button>
                    <Button variant="outline" className="flex-1">Escalate</Button>
                    <Button variant="outline">Mark Resolved</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="timeline">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-success" />
                      <div>
                        <p className="text-sm font-medium">Ticket Created</p>
                        <p className="text-xs text-muted-foreground">{formatDate(selectedGrievance.createdAt)}</p>
                        <p className="text-sm text-muted-foreground mt-1">Received via {selectedGrievance.channel}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-info" />
                      <div>
                        <p className="text-sm font-medium">AI Auto-Classification</p>
                        <p className="text-xs text-muted-foreground">2 mins later</p>
                        <p className="text-sm text-muted-foreground mt-1">Classified as: Hardware Issue / Motor</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-warning animate-pulse" />
                      <div>
                        <p className="text-sm font-medium">Awaiting Assignment</p>
                        <p className="text-xs text-muted-foreground">Current status</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ai-analysis">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        AI-Powered Analysis
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Sentiment:</span>
                          <Badge className="ml-2 bg-warning/10 text-warning">
                            {selectedGrievance.sentiment}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Suggested Category:</span>
                          <span className="ml-2 font-medium">Motor/Pump Failure</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Recommended SLA:</span>
                          <span className="ml-2 font-medium">4 hours</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Similar Past Cases:</span>
                          <span className="ml-2 font-medium">12 resolved (avg. 3.5 hrs)</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                      <h4 className="font-semibold mb-2">AI Suggested Resolution</h4>
                      <p className="text-sm text-muted-foreground">
                        Based on error code E-12 and similar past cases, this appears to be a
                        capacitor failure issue. Recommend dispatching technician with replacement
                        capacitor kit. Historical data shows 89% resolution rate with this approach.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Grievances;
