import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  ShoppingCart,
  CheckCircle,
  Package,
  Truck,
  Wrench,
  Search,
  Filter,
  Download,
  Eye,
} from "lucide-react";

// Dummy applications data with capacity information
const dummyApplications = [
  { id: "APP-2024-001", farmerName: "Ramesh Kumar", district: "Ranchi", block: "Kanke", capacity: "3 HP", status: "received", date: "2024-01-15", amount: 45000 },
  { id: "APP-2024-002", farmerName: "Suresh Singh", district: "Ranchi", block: "Ratu", capacity: "5 HP", status: "verified", date: "2024-01-14", amount: 65000 },
  { id: "APP-2024-003", farmerName: "Ajay Kumar", district: "Dhanbad", block: "Jharia", capacity: "3 HP", status: "ordered", date: "2024-01-13", amount: 45000 },
  { id: "APP-2024-004", farmerName: "Deepak Sharma", district: "Bokaro", block: "Chas", capacity: "7.5 HP", status: "dispatched", date: "2024-01-12", amount: 85000 },
  { id: "APP-2024-005", farmerName: "Vikram Patel", district: "Ranchi", block: "Ormanjhi", capacity: "5 HP", status: "installed", date: "2024-01-11", amount: 65000 },
  { id: "APP-2024-006", farmerName: "Anil Kumar", district: "Ranchi", block: "Kanke", capacity: "3 HP", status: "received", date: "2024-01-16", amount: 45000 },
  { id: "APP-2024-007", farmerName: "Pradeep Singh", district: "Dhanbad", block: "Dhanbad", capacity: "10 HP", status: "verified", date: "2024-01-15", amount: 120000 },
  { id: "APP-2024-008", farmerName: "Santosh Kumar", district: "Bokaro", block: "Sector 4", capacity: "5 HP", status: "ordered", date: "2024-01-14", amount: 65000 },
  { id: "APP-2024-009", farmerName: "Rajesh Kumar", district: "Ranchi", block: "Ranchi Sadar", capacity: "3 HP", status: "dispatched", date: "2024-01-13", amount: 45000 },
  { id: "APP-2024-010", farmerName: "Manoj Kumar", district: "Hazaribagh", block: "Hazaribagh", capacity: "7.5 HP", status: "installed", date: "2024-01-10", amount: 85000 },
  { id: "APP-2024-011", farmerName: "Sandeep Kumar", district: "Ranchi", block: "Bundu", capacity: "3 HP", status: "received", date: "2024-01-17", amount: 45000 },
  { id: "APP-2024-012", farmerName: "Vijay Kumar", district: "Jamshedpur", block: "Jugsalai", capacity: "5 HP", status: "verified", date: "2024-01-16", amount: 65000 },
];

const capacityOptions = ["all", "3 HP", "5 HP", "7.5 HP", "10 HP", "15 HP"];

const statusConfig: Record<string, { label: string; icon: typeof ShoppingCart; color: string; bgColor: string }> = {
  received: { label: "Application Received", icon: ShoppingCart, color: "text-primary", bgColor: "bg-primary/10" },
  verified: { label: "Verified by DNO", icon: CheckCircle, color: "text-info", bgColor: "bg-info/10" },
  ordered: { label: "Order Placed", icon: Package, color: "text-accent", bgColor: "bg-accent/10" },
  dispatched: { label: "Dispatched", icon: Truck, color: "text-warning", bgColor: "bg-warning/10" },
  installed: { label: "Installation Complete", icon: Wrench, color: "text-success", bgColor: "bg-success/10" },
};

const VendorApplications = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredApplications = dummyApplications.filter((app) => {
    const matchesSearch =
      app.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCapacity = capacityFilter === "all" || app.capacity === capacityFilter;
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesCapacity && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status];
    return (
      <Badge className={config.bgColor + " " + config.color + " border-0"}>
        <config.icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const statusCounts = {
    received: dummyApplications.filter(a => a.status === "received").length,
    verified: dummyApplications.filter(a => a.status === "verified").length,
    ordered: dummyApplications.filter(a => a.status === "ordered").length,
    dispatched: dummyApplications.filter(a => a.status === "dispatched").length,
    installed: dummyApplications.filter(a => a.status === "installed").length,
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Applications</h1>
            <p className="text-muted-foreground mt-1">
              Track applications and filter by capacity
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Status Pipeline Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(statusConfig).map(([status, config]) => (
          <Card
            key={status}
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === status ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{config.label}</p>
                  <p className="text-2xl font-bold">{statusCounts[status as keyof typeof statusCounts]}</p>
                </div>
                <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
                  <config.icon className={`w-5 h-5 ${config.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by farmer name, application ID, or district..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={capacityFilter} onValueChange={setCapacityFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Capacity" />
              </SelectTrigger>
              <SelectContent>
                {capacityOptions.map((capacity) => (
                  <SelectItem key={capacity} value={capacity}>
                    {capacity === "all" ? "All Capacities" : capacity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application ID</TableHead>
              <TableHead>Farmer Name</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-mono">{app.id}</TableCell>
                <TableCell className="font-medium">{app.farmerName}</TableCell>
                <TableCell>{app.district}</TableCell>
                <TableCell>{app.block}</TableCell>
                <TableCell>
                  <Badge variant="outline">{app.capacity}</Badge>
                </TableCell>
                <TableCell>₹{app.amount.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(app.status)}</TableCell>
                <TableCell>{app.date}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredApplications.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No applications found matching your filters.</p>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default VendorApplications;
