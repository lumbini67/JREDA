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
import { Search, Download, Building2, Users, Phone, Mail, Star, MapPin, Eye, Plus, Calendar, TrendingUp, BarChart3 } from "lucide-react";

const vendorsData = [
  { id: "VND-001", companyName: "SolarTech Solutions Pvt Ltd", contactPerson: "Amit Sharma", email: "amit@solartech.in", phone: "+91 98765 43210", districts: ["Ranchi", "Dhanbad", "Hazaribagh"], assignedPumps: 45, operationalPumps: 42, rating: 4.5, contractStart: "2022-03-15", contractEnd: "2025-03-14", status: "active" },
  { id: "VND-002", companyName: "Green Energy Systems", contactPerson: "Priya Singh", email: "priya@greenenergy.co.in", phone: "+91 87654 32109", districts: ["Giridih", "Deoghar", "Hazaribagh"], assignedPumps: 38, operationalPumps: 35, rating: 4.2, contractStart: "2021-08-01", contractEnd: "2024-07-31", status: "active" },
  { id: "VND-003", companyName: "Jharkhand Solar Works", contactPerson: "Rajesh Kumar", email: "rajesh@jsw.co.in", phone: "+91 76543 21098", districts: ["Bokaro", "Ranchi", "Deoghar"], assignedPumps: 52, operationalPumps: 48, rating: 4.8, contractStart: "2020-01-10", contractEnd: "2025-01-09", status: "active" },
  { id: "VND-004", companyName: "EcoPower Solutions", contactPerson: "Neha Gupta", email: "neha@ecopower.in", phone: "+91 65432 10987", districts: ["Ranchi"], assignedPumps: 18, operationalPumps: 15, rating: 3.9, contractStart: "2023-06-20", contractEnd: "2026-06-19", status: "active" },
  { id: "VND-005", companyName: "SunRise Solar Enterprises", contactPerson: "Vikram Patel", email: "vikram@sunrise.co.in", phone: "+91 54321 09876", districts: ["Dhanbad", "Bokaro"], assignedPumps: 25, operationalPumps: 22, rating: 4.1, contractStart: "2022-11-05", contractEnd: "2025-11-04", status: "under_review" },
  { id: "VND-006", companyName: "BrightSun Solar Co", contactPerson: "Sandeep Mahato", email: "sandeep@brightsun.in", phone: "+91 98701 23456", districts: ["Ranchi", "Giridih"], assignedPumps: 32, operationalPumps: 30, rating: 4.3, contractStart: "2021-05-12", contractEnd: "2024-05-11", status: "active" },
  { id: "VND-007", companyName: "Future Energy India", contactPerson: "Ankit Verma", email: "ankit@futureenergy.in", phone: "+91 87690 12345", districts: ["Hazaribagh", "Dhanbad"], assignedPumps: 28, operationalPumps: 26, rating: 4.0, contractStart: "2022-02-28", contractEnd: "2025-02-27", status: "active" },
  { id: "VND-008", companyName: "PureWave Solar", contactPerson: "Pooja Kumari", email: "pooja@purewave.in", phone: "+91 76543 98765", districts: ["Deoghar", "Giridih"], assignedPumps: 22, operationalPumps: 20, rating: 4.4, contractStart: "2020-09-15", contractEnd: "2025-09-14", status: "active" },
  { id: "VND-009", companyName: "Shree Sai Solar", contactPerson: "Rajendra Prasad", email: "rajendra@shreesai.in", phone: "+91 65432 76543", districts: ["Bokaro", "Ranchi"], assignedPumps: 35, operationalPumps: 32, rating: 4.6, contractStart: "2019-04-20", contractEnd: "2024-04-19", status: "active" },
  { id: "VND-010", companyName: "JSR Solar Solutions", contactPerson: "Manish Kumar", email: "manish@jsrsolar.in", phone: "+91 54321 87654", districts: ["Ranchi"], assignedPumps: 15, operationalPumps: 14, rating: 3.8, contractStart: "2023-01-10", contractEnd: "2026-01-09", status: "active" },
  { id: "VND-011", companyName: "Orion Power Systems", contactPerson: "Rahul Singh", email: "rahul@orionpower.in", phone: "+91 98765 12345", districts: ["Hazaribagh", "Bokaro"], assignedPumps: 42, operationalPumps: 38, rating: 4.2, contractStart: "2021-11-05", contractEnd: "2024-11-04", status: "active" },
  { id: "VND-012", companyName: "Zenith Solar Tech", contactPerson: "Sanjay Das", email: "sanjay@zenithsolar.in", phone: "+91 87654 56789", districts: ["Dhanbad", "Giridih"], assignedPumps: 30, operationalPumps: 28, rating: 4.5, contractStart: "2022-07-22", contractEnd: "2025-07-21", status: "active" },
  { id: "VND-013", companyName: "Apex Green Energy", contactPerson: "Vivek Kumar", email: "vivek@apexgreen.in", phone: "+91 76543 21098", districts: ["Deoghar", "Ranchi"], assignedPumps: 26, operationalPumps: 24, rating: 4.1, contractStart: "2023-03-15", contractEnd: "2026-03-14", status: "active" },
  { id: "VND-014", companyName: "Nova Solar Works", contactPerson: "Prashant Kumar", email: "prashant@novasolar.in", phone: "+91 65432 10987", districts: ["Bokaro", "Hazaribagh"], assignedPumps: 20, operationalPumps: 18, rating: 3.7, contractStart: "2022-12-01", contractEnd: "2025-11-30", status: "active" },
  { id: "VND-015", companyName: "Titan Solar Solutions", contactPerson: "Ajay Kumar", email: "ajay@titansolar.in", phone: "+91 54321 98765", districts: ["Giridih", "Dhanbad"], assignedPumps: 36, operationalPumps: 33, rating: 4.4, contractStart: "2020-06-18", contractEnd: "2025-06-17", status: "active" },
  { id: "VND-016", companyName: "Unity Power Solar", contactPerson: "Ravi Shankar", email: "ravi@unitypower.in", phone: "+91 98765 67890", districts: ["Ranchi", "Deoghar"], assignedPumps: 24, operationalPumps: 22, rating: 4.0, contractStart: "2023-08-25", contractEnd: "2026-08-24", status: "under_review" },
  { id: "VND-017", companyName: "Cosmos Solar Systems", contactPerson: "Nikhil Gupta", email: "nikhil@cosmossolar.in", phone: "+91 87654 32109", districts: ["Bokaro", "Ranchi"], assignedPumps: 19, operationalPumps: 17, rating: 3.9, contractStart: "2021-04-10", contractEnd: "2024-04-09", status: "active" },
  { id: "VND-018", companyName: "Matrix Solar Tech", contactPerson: "Deepak Sharma", email: "deepak@matrixsolar.in", phone: "+91 76543 45678", districts: ["Hazaribagh", "Giridih"], assignedPumps: 29, operationalPumps: 27, rating: 4.3, contractStart: "2022-05-20", contractEnd: "2025-05-19", status: "active" },
  { id: "VND-019", companyName: "Vertex Energy Solutions", contactPerson: "Akhilesh Kumar", email: "akhilesh@vertexenergy.in", phone: "+91 65432 54321", districts: ["Dhanbad", "Deoghar"], assignedPumps: 31, operationalPumps: 28, rating: 4.2, contractStart: "2020-10-15", contractEnd: "2025-10-14", status: "active" },
  { id: "VND-020", companyName: "Alpha Solar Industries", contactPerson: "Mohit Kumar", email: "mohit@alphasolar.in", phone: "+91 54321 43210", districts: ["Ranchi", "Bokaro"], assignedPumps: 27, operationalPumps: 25, rating: 4.1, contractStart: "2023-02-28", contractEnd: "2026-02-27", status: "active" },
  { id: "VND-021", companyName: "Omega Power Solar", contactPerson: "Saurabh Singh", email: "saurabh@omegapower.in", phone: "+91 98765 34567", districts: ["Giridih", "Hazaribagh"], assignedPumps: 23, operationalPumps: 21, rating: 4.0, contractStart: "2022-08-10", contractEnd: "2025-08-09", status: "active" },
  { id: "VND-022", companyName: "Delta Solar Systems", contactPerson: "Abhishek Kumar", email: "abhishek@deltasolar.in", phone: "+91 87654 65432", districts: ["Ranchi", "Dhanbad"], assignedPumps: 33, operationalPumps: 30, rating: 4.3, contractStart: "2021-01-25", contractEnd: "2025-01-24", status: "active" },
  { id: "VND-023", companyName: "Sigma Energy Co", contactPerson: "Kumar Saurabh", email: "saurabh@sigmaenergy.in", phone: "+91 76543 76543", districts: ["Bokaro", "Deoghar"], assignedPumps: 21, operationalPumps: 19, rating: 3.8, contractStart: "2023-07-05", contractEnd: "2026-07-04", status: "active" },
  { id: "VND-024", companyName: "Gamma Solar Works", contactPerson: "Yogesh Kumar", email: "yogesh@gammasolar.in", phone: "+91 65432 87654", districts: ["Hazaribagh", "Ranchi"], assignedPumps: 28, operationalPumps: 26, rating: 4.2, contractStart: "2022-03-18", contractEnd: "2025-03-17", status: "active" },
  { id: "VND-025", companyName: "Innova Solar Tech", contactPerson: "Shivam Kumar", email: "shivam@innovasolar.in", phone: "+91 54321 09876", districts: ["Giridih", "Bokaro"], assignedPumps: 26, operationalPumps: 24, rating: 4.4, contractStart: "2020-12-10", contractEnd: "2025-12-09", status: "active" },
];

const districts = ["All", "Ranchi", "Hazaribagh", "Dhanbad", "Bokaro", "Giridih", "Deoghar"];

const vendorStatusStyles = {
  active: "bg-success/10 text-success border-success/30",
  under_review: "bg-warning/10 text-warning border-warning/30",
  suspended: "bg-destructive/10 text-destructive border-destructive/30",
};

const deviceIntegrations = {
  today: { count: 12, change: "+3" },
  thisWeek: { count: 48, change: "+15" },
  thisMonth: { count: 156, change: "+42" },
  thisYear: { count: 892, change: "+156" },
};

const ManagerVendors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("vendors");

  const filteredVendors = vendorsData.filter((vendor) => {
    const matchesSearch =
      vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict =
      districtFilter === "All" || vendor.districts.includes(districtFilter);
    return matchesSearch && matchesDistrict;
  });

  const totalVendors = vendorsData.length;
  const activeVendors = vendorsData.filter((v) => v.status === "active").length;
  const totalAssignedPumps = vendorsData.reduce((sum, v) => sum + v.assignedPumps, 0);
  const avgRating = (vendorsData.reduce((sum, v) => sum + v.rating, 0) / vendorsData.length).toFixed(1);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendor Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage solar pump vendors and their assignments
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Vendor
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="vendors" className="gap-2">
            <Building2 className="w-4 h-4" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Device Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendors">
          {/* Stats */}
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
                  <p className="text-xl font-bold">{totalAssignedPumps}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-info/5 border-info/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                  <p className="text-xl font-bold">{avgRating}</p>
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
                    placeholder="Search by company name, contact person, or vendor ID..."
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
              <CardTitle className="text-lg">Vendor List ({filteredVendors.length})</CardTitle>
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
                            <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
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

        <TabsContent value="integrations">
          {/* Integration Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Today</p>
                  <p className="text-xl font-bold">{deviceIntegrations.today.count}</p>
                  <p className="text-xs text-success">{deviceIntegrations.today.change}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">This Week</p>
                  <p className="text-xl font-bold">{deviceIntegrations.thisWeek.count}</p>
                  <p className="text-xs text-success">{deviceIntegrations.thisWeek.change}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">This Month</p>
                  <p className="text-xl font-bold">{deviceIntegrations.thisMonth.count}</p>
                  <p className="text-xs text-success">{deviceIntegrations.thisMonth.change}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-info/5 border-info/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">This Year</p>
                  <p className="text-xl font-bold">{deviceIntegrations.thisYear.count}</p>
                  <p className="text-xs text-success">{deviceIntegrations.thisYear.change}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integration Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Device Integration Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-secondary/20 rounded-lg border border-dashed">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Integration chart visualization</p>
                  <p className="text-sm text-muted-foreground">Daily, weekly, monthly and yearly device integrations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ManagerVendors;
