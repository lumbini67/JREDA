import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Search, Filter, Download, Sun, Zap, Thermometer, MapPin, Eye, Users, Building2, Phone, Mail, Star } from "lucide-react";

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
    vendorId: "VND-001",
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
    vendorId: "VND-002",
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
    vendorId: "VND-001",
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
    vendorId: "VND-003",
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
    vendorId: "VND-002",
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
    vendorId: "VND-003",
  },
];

const vendorsData = [
  {
    id: "VND-001",
    companyName: "SolarTech Solutions Pvt Ltd",
    contactPerson: "Amit Sharma",
    email: "amit@solartech.in",
    phone: "+91 98765 43210",
    districts: ["Ranchi", "Dhanbad", "Hazaribagh"],
    assignedPumps: 45,
    operationalPumps: 42,
    rating: 4.5,
    contractStart: "2022-03-15",
    contractEnd: "2025-03-14",
    status: "active",
  },
  {
    id: "VND-002",
    companyName: "Green Energy Systems",
    contactPerson: "Priya Singh",
    email: "priya@greenenergy.co.in",
    phone: "+91 87654 32109",
    districts: ["Giridih", "Deoghar", "Hazaribagh"],
    assignedPumps: 38,
    operationalPumps: 35,
    rating: 4.2,
    contractStart: "2021-08-01",
    contractEnd: "2024-07-31",
    status: "active",
  },
  {
    id: "VND-003",
    companyName: "Jharkhand Solar Works",
    contactPerson: "Rajesh Kumar",
    email: "rajesh@jsw.co.in",
    phone: "+91 76543 21098",
    districts: ["Bokaro", "Ranchi", "Deoghar"],
    assignedPumps: 52,
    operationalPumps: 48,
    rating: 4.8,
    contractStart: "2020-01-10",
    contractEnd: "2025-01-09",
    status: "active",
  },
  {
    id: "VND-004",
    companyName: "EcoPower Solutions",
    contactPerson: "Neha Gupta",
    email: "neha@ecopower.in",
    phone: "+91 65432 10987",
    districts: ["Ranchi"],
    assignedPumps: 18,
    operationalPumps: 15,
    rating: 3.9,
    contractStart: "2023-06-20",
    contractEnd: "2026-06-19",
    status: "active",
  },
  {
    id: "VND-005",
    companyName: "SunRise Solar Enterprises",
    contactPerson: "Vikram Patel",
    email: "vikram@sunrise.co.in",
    phone: "+91 54321 09876",
    districts: ["Dhanbad", "Bokaro"],
    assignedPumps: 25,
    operationalPumps: 22,
    rating: 4.1,
    contractStart: "2022-11-05",
    contractEnd: "2025-11-04",
    status: "under_review",
  },
];

const districts = ["All", "Ranchi", "Hazaribagh", "Dhanbad", "Bokaro", "Giridih", "Deoghar"];

const statusStyles = {
  online: "bg-success/10 text-success border-success/30",
  offline: "bg-destructive/10 text-destructive border-destructive/30",
  maintenance: "bg-warning/10 text-warning border-warning/30",
};

const vendorStatusStyles = {
  active: "bg-success/10 text-success border-success/30",
  under_review: "bg-warning/10 text-warning border-warning/30",
  suspended: "bg-destructive/10 text-destructive border-destructive/30",
};

const SolarPumps = () => {
  const [activeTab, setActiveTab] = useState("pumps");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorDistrictFilter, setVendorDistrictFilter] = useState("All");

  const filteredPumps = pumpsData.filter((pump) => {
    const matchesSearch =
      pump.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pump.beneficiary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pump.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || pump.status === statusFilter;
    const matchesDistrict = districtFilter === "All" || pump.district === districtFilter;
    return matchesSearch && matchesStatus && matchesDistrict;
  });

  const filteredVendors = vendorsData.filter((vendor) => {
    const matchesSearch =
      vendor.companyName.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      vendor.id.toLowerCase().includes(vendorSearch.toLowerCase());
    const matchesDistrict =
      vendorDistrictFilter === "All" || vendor.districts.includes(vendorDistrictFilter);
    return matchesSearch && matchesDistrict;
  });

  const onlineCount = pumpsData.filter((p) => p.status === "online").length;
  const offlineCount = pumpsData.filter((p) => p.status === "offline").length;
  const totalVendors = vendorsData.length;
  const activeVendors = vendorsData.filter((v) => v.status === "active").length;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Solar Pumps</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time monitoring of PM-KUSUM Component-B solar irrigation pumps
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="border bg-background shadow-sm">
          <TabsTrigger value="pumps" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Sun className="w-4 h-4" />
            Pumps ({pumpsData.length})
          </TabsTrigger>
          <TabsTrigger value="vendors" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building2 className="w-4 h-4" />
            Vendors ({totalVendors})
          </TabsTrigger>
        </TabsList>

        {/* Pumps Tab */}
        <TabsContent value="pumps">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Online</p>
                  <p className="text-xl font-bold text-success">{onlineCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Offline</p>
                  <p className="text-xl font-bold text-destructive">{offlineCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Generation</p>
                  <p className="text-xl font-bold">15.6 kWh</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-info/5 border-info/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Temp</p>
                  <p className="text-xl font-bold">40.2°C</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, beneficiary, or district..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={districtFilter} onValueChange={setDistrictFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pumps Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pump Inventory ({filteredPumps.length})</CardTitle>
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
                        <Badge variant="outline" className={statusStyles[pump.status as keyof typeof statusStyles]}>
                          {pump.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-accent" />
                          {pump.generation}
                        </div>
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
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors">
          {/* Vendor Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Vendors</p>
                  <p className="text-xl font-bold">{totalVendors}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active</p>
                  <p className="text-xl font-bold text-success">{activeVendors}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assigned Pumps</p>
                  <p className="text-xl font-bold">{vendorsData.reduce((sum, v) => sum + v.assignedPumps, 0)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-info/5 border-info/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                  <p className="text-xl font-bold">4.3</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vendor Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by company name, contact person, or vendor ID..."
                    className="pl-10"
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                  />
                </div>
                <Select value={vendorDistrictFilter} onValueChange={setVendorDistrictFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vendors Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Vendor Management ({filteredVendors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor ID</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Districts</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Operational</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id} className="hover:bg-secondary/30">
                      <TableCell className="font-mono text-sm">{vendor.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{vendor.companyName}</div>
                        <div className="text-xs text-muted-foreground">{vendor.contactPerson}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs">
                          <Phone className="w-3 h-3" />
                          {vendor.phone}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {vendor.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {vendor.districts.map((d) => (
                            <Badge key={d} variant="outline" className="text-xs">
                              {d}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{vendor.assignedPumps}</TableCell>
                      <TableCell>
                        <span className={vendor.operationalPumps === vendor.assignedPumps ? "text-success" : "text-warning"}>
                          {vendor.operationalPumps}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{vendor.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={vendorStatusStyles[vendor.status as keyof typeof vendorStatusStyles]}>
                          {vendor.status.replace("_", " ")}
                        </Badge>
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
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SolarPumps;
