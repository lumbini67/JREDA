import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Download, Sun, Zap, Thermometer, MapPin, Eye } from "lucide-react";

const pumpsData = [
  {
    id: "JREDA-SPP-001",
    beneficiary: "Ramesh Kumar",
    district: "Ranchi",
    block: "Kanke",
    capacity: "5 HP",
    status: "online",
    generation: "4.2 kWh",
    lastSync: "2 min ago",
    inverterTemp: "42°C",
    waterFlow: "180 L/min",
  },
  {
    id: "JREDA-SPP-002",
    beneficiary: "Sita Devi",
    district: "Hazaribagh",
    block: "Ichak",
    capacity: "3 HP",
    status: "online",
    generation: "2.8 kWh",
    lastSync: "5 min ago",
    inverterTemp: "38°C",
    waterFlow: "120 L/min",
  },
  {
    id: "JREDA-SPP-003",
    beneficiary: "Mohan Prasad",
    district: "Dhanbad",
    block: "Topchanchi",
    capacity: "5 HP",
    status: "offline",
    generation: "0 kWh",
    lastSync: "2 hours ago",
    inverterTemp: "--",
    waterFlow: "0 L/min",
  },
  {
    id: "JREDA-SPP-004",
    beneficiary: "Lakshmi Oraon",
    district: "Bokaro",
    block: "Chas",
    capacity: "7.5 HP",
    status: "online",
    generation: "6.1 kWh",
    lastSync: "1 min ago",
    inverterTemp: "45°C",
    waterFlow: "220 L/min",
  },
  {
    id: "JREDA-SPP-005",
    beneficiary: "Birsa Munda",
    district: "Giridih",
    block: "Bengabad",
    capacity: "5 HP",
    status: "maintenance",
    generation: "0 kWh",
    lastSync: "1 day ago",
    inverterTemp: "--",
    waterFlow: "0 L/min",
  },
  {
    id: "JREDA-SPP-006",
    beneficiary: "Anjali Kumari",
    district: "Deoghar",
    block: "Madhupur",
    capacity: "3 HP",
    status: "online",
    generation: "2.5 kWh",
    lastSync: "3 min ago",
    inverterTemp: "36°C",
    waterFlow: "110 L/min",
  },
];

const statusStyles = {
  online: "bg-success/10 text-success border-success/30",
  offline: "bg-destructive/10 text-destructive border-destructive/30",
  maintenance: "bg-warning/10 text-warning border-warning/30",
};

const SolarPumps = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPumps = pumpsData.filter((pump) => {
    const matchesSearch =
      pump.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pump.beneficiary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pump.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || pump.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onlineCount = pumpsData.filter((p) => p.status === "online").length;
  const offlineCount = pumpsData.filter((p) => p.status === "offline").length;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Solar Pumps</h1>
        <p className="text-muted-foreground mt-1">
          Real-time monitoring of PM-KUSUM Component-B solar irrigation pumps
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Sun className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Online</p>
              <p className="text-2xl font-bold text-success">{onlineCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Sun className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Offline</p>
              <p className="text-2xl font-bold text-destructive">{offlineCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Generation</p>
              <p className="text-2xl font-bold text-foreground">15.6 kWh</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-info/5 border-info/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
              <Thermometer className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Inverter Temp</p>
              <p className="text-2xl font-bold text-foreground">40.2°C</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, beneficiary, or district..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pumps Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Pump Inventory ({filteredPumps.length} pumps)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pump ID</TableHead>
                <TableHead>Beneficiary</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Generation</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPumps.map((pump) => (
                <TableRow key={pump.id} className="hover:bg-secondary/30">
                  <TableCell className="font-mono text-sm">{pump.id}</TableCell>
                  <TableCell className="font-medium">{pump.beneficiary}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{pump.district}, {pump.block}</span>
                    </div>
                  </TableCell>
                  <TableCell>{pump.capacity}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusStyles[pump.status as keyof typeof statusStyles]}
                    >
                      {pump.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-accent" />
                      {pump.generation}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {pump.lastSync}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SolarPumps;
