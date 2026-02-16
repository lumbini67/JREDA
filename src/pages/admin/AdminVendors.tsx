import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Download, Building2, Users, Phone, Mail, Star, MapPin, Eye, Plus, Calendar, TrendingUp, BarChart3, Activity, CheckCircle, AlertTriangle, Clock, ChevronLeft, ChevronRight, Edit, FileText, MapPinned } from "lucide-react";

const vendorsData = [
  { id: "VND-001", companyName: "SolarTech Solutions Pvt Ltd", contactPerson: "Amit Sharma", email: "amit@solartech.in", phone: "+91 98765 43210", districts: ["Ranchi", "Dhanbad", "Hazaribagh"], assignedPumps: 45, operationalPumps: 42, rating: 4.5, contractStart: "2022-03-15", contractEnd: "2025-03-14", status: "active", revenue: 1250000, pendingPayments: 125000, vendorType: "solar_pump" },
  { id: "VND-002", companyName: "Green Energy Systems", contactPerson: "Priya Singh", email: "priya@greenenergy.co.in", phone: "+91 87654 32109", districts: ["Giridih", "Deoghar", "Hazaribagh"], assignedPumps: 38, operationalPumps: 35, rating: 4.2, contractStart: "2021-08-01", contractEnd: "2024-07-31", status: "active", revenue: 980000, pendingPayments: 85000, vendorType: "mini_grid" },
  { id: "VND-003", companyName: "Jharkhand Solar Works", contactPerson: "Rajesh Kumar", email: "rajesh@jsw.co.in", phone: "+91 76543 21098", districts: ["Bokaro", "Ranchi", "Deoghar"], assignedPumps: 52, operationalPumps: 48, rating: 4.8, contractStart: "2020-01-10", contractEnd: "2025-01-09", status: "active", revenue: 1580000, pendingPayments: 210000, vendorType: "solar_pump" },
  { id: "VND-004", companyName: "EcoPower Solutions", contactPerson: "Neha Gupta", email: "neha@ecopower.in", phone: "+91 65432 10987", districts: ["Ranchi"], assignedPumps: 18, operationalPumps: 15, rating: 3.9, contractStart: "2023-06-20", contractEnd: "2026-06-19", status: "active", revenue: 420000, pendingPayments: 45000, vendorType: "rooftop_solar" },
  { id: "VND-005", companyName: "SunRise Solar Enterprises", contactPerson: "Vikram Patel", email: "vikram@sunrise.co.in", phone: "+91 54321 09876", districts: ["Dhanbad", "Bokaro"], assignedPumps: 25, operationalPumps: 22, rating: 4.1, contractStart: "2022-11-05", contractEnd: "2025-11-04", status: "under_review", revenue: 680000, pendingPayments: 95000, vendorType: "solar_street_light" },
  { id: "VND-006", companyName: "BrightSun Solar Co", contactPerson: "Sandeep Mahato", email: "sandeep@brightsun.in", phone: "+91 98701 23456", districts: ["Ranchi", "Giridih"], assignedPumps: 32, operationalPumps: 30, rating: 4.3, contractStart: "2021-05-12", contractEnd: "2024-05-11", status: "active", revenue: 890000, pendingPayments: 72000, vendorType: "solar_pump" },
  { id: "VND-007", companyName: "Future Energy India", contactPerson: "Ankit Verma", email: "ankit@futureenergy.in", phone: "+91 87690 12345", districts: ["Hazaribagh", "Dhanbad"], assignedPumps: 28, operationalPumps: 26, rating: 4.0, contractStart: "2022-02-28", contractEnd: "2025-02-27", status: "active", revenue: 720000, pendingPayments: 68000, vendorType: "mini_grid" },
  { id: "VND-008", companyName: "PureWave Solar", contactPerson: "Pooja Kumari", email: "pooja@purewave.in", phone: "+91 76543 98765", districts: ["Deoghar", "Giridih"], assignedPumps: 22, operationalPumps: 20, rating: 4.4, contractStart: "2020-09-15", contractEnd: "2025-09-14", status: "active", revenue: 580000, pendingPayments: 52000, vendorType: "solar_water_heater" },
  { id: "VND-009", companyName: "Shree Sai Solar", contactPerson: "Rajendra Prasad", email: "rajendra@shreesai.in", phone: "+91 65432 76543", districts: ["Bokaro", "Ranchi"], assignedPumps: 35, operationalPumps: 32, rating: 4.6, contractStart: "2019-04-20", contractEnd: "2024-04-19", status: "active", revenue: 1050000, pendingPayments: 115000, vendorType: "solar_pump" },
  { id: "VND-010", companyName: "JSR Solar Solutions", contactPerson: "Manish Kumar", email: "manish@jsrsolar.in", phone: "+91 54321 87654", districts: ["Ranchi"], assignedPumps: 15, operationalPumps: 14, rating: 3.8, contractStart: "2023-01-10", contractEnd: "2026-01-09", status: "active", revenue: 380000, pendingPayments: 38000, vendorType: "rooftop_solar" },
  { id: "VND-011", companyName: "Orion Power Systems", contactPerson: "Rahul Singh", email: "rahul@orionpower.in", phone: "+91 98765 12345", districts: ["Hazaribagh", "Bokaro"], assignedPumps: 42, operationalPumps: 38, rating: 4.2, contractStart: "2021-11-05", contractEnd: "2024-11-04", status: "active", revenue: 1180000, pendingPayments: 142000, vendorType: "mini_grid" },
  { id: "VND-012", companyName: "Zenith Solar Tech", contactPerson: "Sanjay Das", email: "sanjay@zenithsolar.in", phone: "+91 87654 56789", districts: ["Dhanbad", "Giridih"], assignedPumps: 30, operationalPumps: 28, rating: 4.5, contractStart: "2022-07-22", contractEnd: "2025-07-21", status: "active", revenue: 820000, pendingPayments: 88000, vendorType: "solar_high_mast" },
  { id: "VND-013", companyName: "Apex Green Energy", contactPerson: "Vivek Kumar", email: "vivek@apexgreen.in", phone: "+91 76543 21098", districts: ["Deoghar", "Ranchi"], assignedPumps: 26, operationalPumps: 24, rating: 4.1, contractStart: "2023-03-15", contractEnd: "2026-03-14", status: "active", revenue: 620000, pendingPayments: 65000, vendorType: "solar_pump" },
  { id: "VND-014", companyName: "Nova Solar Works", contactPerson: "Prashant Kumar", email: "prashant@novasolar.in", phone: "+91 65432 10987", districts: ["Bokaro", "Hazaribagh"], assignedPumps: 20, operationalPumps: 18, rating: 3.7, contractStart: "2022-12-01", contractEnd: "2025-11-30", status: "active", revenue: 480000, pendingPayments: 52000, vendorType: "solar_street_light" },
  { id: "VND-015", companyName: "Titan Solar Solutions", contactPerson: "Ajay Kumar", email: "ajay@titansolar.in", phone: "+91 54321 98765", districts: ["Giridih", "Dhanbad"], assignedPumps: 36, operationalPumps: 33, rating: 4.4, contractStart: "2020-06-18", contractEnd: "2025-06-17", status: "active", revenue: 1020000, pendingPayments: 98000, vendorType: "rooftop_solar" },
  { id: "VND-016", companyName: "Unity Power Solar", contactPerson: "Ravi Shankar", email: "ravi@unitypower.in", phone: "+91 98765 67890", districts: ["Ranchi", "Deoghar"], assignedPumps: 24, operationalPumps: 22, rating: 4.0, contractStart: "2023-08-25", contractEnd: "2026-08-24", status: "under_review", revenue: 520000, pendingPayments: 48000, vendorType: "solar_water_heater" },
  { id: "VND-017", companyName: "Cosmos Solar Systems", contactPerson: "Nikhil Gupta", email: "nikhil@cosmossolar.in", phone: "+91 87654 32109", districts: ["Bokaro", "Ranchi"], assignedPumps: 19, operationalPumps: 17, rating: 3.9, contractStart: "2021-04-10", contractEnd: "2024-04-09", status: "active", revenue: 450000, pendingPayments: 42000, vendorType: "mini_grid" },
  { id: "VND-018", companyName: "Matrix Solar Tech", contactPerson: "Deepak Sharma", email: "deepak@matrixsolar.in", phone: "+91 76543 45678", districts: ["Hazaribagh", "Giridih"], assignedPumps: 29, operationalPumps: 27, rating: 4.3, contractStart: "2022-05-20", contractEnd: "2025-05-19", status: "active", revenue: 760000, pendingPayments: 75000, vendorType: "solar_high_mast" },
  { id: "VND-019", companyName: "Vertex Energy Solutions", contactPerson: "Akhilesh Kumar", email: "akhilesh@vertexenergy.in", phone: "+91 65432 54321", districts: ["Dhanbad", "Deoghar"], assignedPumps: 31, operationalPumps: 28, rating: 4.2, contractStart: "2020-10-15", contractEnd: "2025-10-14", status: "active", revenue: 880000, pendingPayments: 92000, vendorType: "solar_pump" },
  { id: "VND-020", companyName: "Alpha Solar Industries", contactPerson: "Mohit Kumar", email: "mohit@alphasolar.in", phone: "+91 54321 43210", districts: ["Ranchi", "Bokaro"], assignedPumps: 27, operationalPumps: 25, rating: 4.1, contractStart: "2023-02-28", contractEnd: "2026-02-27", status: "active", revenue: 650000, pendingPayments: 68000, vendorType: "rooftop_solar" },
  { id: "VND-021", companyName: "Omega Power Solar", contactPerson: "Saurabh Singh", email: "saurabh@omegapower.in", phone: "+91 98765 34567", districts: ["Giridih", "Hazaribagh"], assignedPumps: 23, operationalPumps: 21, rating: 4.0, contractStart: "2022-08-10", contractEnd: "2025-08-09", status: "active", revenue: 580000, pendingPayments: 55000, vendorType: "mini_grid" },
  { id: "VND-022", companyName: "Delta Solar Systems", contactPerson: "Abhishek Kumar", email: "abhishek@deltasolar.in", phone: "+91 87654 65432", districts: ["Ranchi", "Dhanbad"], assignedPumps: 33, operationalPumps: 30, rating: 4.3, contractStart: "2021-01-25", contractEnd: "2025-01-24", status: "active", revenue: 920000, pendingPayments: 105000, vendorType: "solar_pump" },
  { id: "VND-023", companyName: "Sigma Energy Co", contactPerson: "Kumar Saurabh", email: "saurabh@sigmaenergy.in", phone: "+91 76543 76543", districts: ["Bokaro", "Deoghar"], assignedPumps: 21, operationalPumps: 19, rating: 3.8, contractStart: "2023-07-05", contractEnd: "2026-07-04", status: "active", revenue: 480000, pendingPayments: 45000, vendorType: "solar_street_light" },
  { id: "VND-024", companyName: "Gamma Solar Works", contactPerson: "Yogesh Kumar", email: "yogesh@gammasolar.in", phone: "+91 65432 87654", districts: ["Hazaribagh", "Ranchi"], assignedPumps: 28, operationalPumps: 26, rating: 4.2, contractStart: "2022-03-18", contractEnd: "2025-03-17", status: "active", revenue: 720000, pendingPayments: 78000, vendorType: "solar_water_heater" },
  { id: "VND-025", companyName: "Innova Solar Tech", contactPerson: "Shivam Kumar", email: "shivam@innovasolar.in", phone: "+91 54321 09876", districts: ["Giridih", "Bokaro"], assignedPumps: 26, operationalPumps: 24, rating: 4.4, contractStart: "2020-12-10", contractEnd: "2025-12-09", status: "active", revenue: 680000, pendingPayments: 72000, vendorType: "solar_high_mast" },
];

const districts = ["All", "Ranchi", "Hazaribagh", "Dhanbad", "Bokaro", "Giridih", "Deoghar"];

const vendorStatusStyles = {
  active: "bg-success/10 text-success border-success/30",
  under_review: "bg-warning/10 text-warning border-warning/30",
  suspended: "bg-destructive/10 text-destructive border-destructive/30",
};

const AdminVendors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorTypeFilter, setVendorTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("vendors");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<typeof vendorsData[0] | null>(null);
  const [newVendor, setNewVendor] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
    city: "",
    state: "Jharkhand",
    pincode: "",
    gstNumber: "",
    panNumber: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    districts: [] as string[],
    region: "",
    licenseNumber: "",
    registrationDate: "",
    assignedPumps: 0,
    operationalPumps: 0,
    rating: 0,
    contractStart: "",
    contractEnd: "",
    serviceType: "",
    annualRevenue: 0,
    status: "active",
    notes: "",
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
    city: "",
    state: "Jharkhand",
    pincode: "",
    gstNumber: "",
    panNumber: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    districts: [] as string[],
    region: "",
    licenseNumber: "",
    registrationDate: "",
    assignedPumps: 0,
    operationalPumps: 0,
    rating: 0,
    contractStart: "",
    contractEnd: "",
    serviceType: "",
    annualRevenue: 0,
    status: "active",
    notes: "",
    vendorType: "",
  });

  const filteredVendors = vendorsData.filter((vendor) => {
    const matchesSearch =
      vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict =
      districtFilter === "All" || vendor.districts.includes(districtFilter);
    const matchesStatus =
      statusFilter === "all" || vendor.status === statusFilter;
    const matchesType =
      vendorTypeFilter === "all" || vendor.vendorType === vendorTypeFilter;
    return matchesSearch && matchesDistrict && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVendors = filteredVendors.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, districtFilter, statusFilter, vendorTypeFilter]);

  const totalVendors = vendorsData.length;
  const activeVendors = vendorsData.filter((v) => v.status === "active").length;
  const underReviewVendors = vendorsData.filter((v) => v.status === "under_review").length;
  const totalAssignedPumps = vendorsData.reduce((sum, v) => sum + v.assignedPumps, 0);
  const totalOperationalPumps = vendorsData.reduce((sum, v) => sum + v.operationalPumps, 0);
  const avgRating = (vendorsData.reduce((sum, v) => sum + v.rating, 0) / vendorsData.length).toFixed(1);
  const totalRevenue = vendorsData.reduce((sum, v) => sum + v.revenue, 0);
  const totalPendingPayments = vendorsData.reduce((sum, v) => sum + v.pendingPayments, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddVendor = () => {
    const vendorId = `VND-${String(vendorsData.length + 1).padStart(3, '0')}`;
    const newVendorData = {
      id: vendorId,
      ...newVendor,
      revenue: newVendor.annualRevenue || 0,
      pendingPayments: 0,
    };
    // In a real app, this would be an API call
    console.log("Adding vendor:", newVendorData);
    setIsAddDialogOpen(false);
    setNewVendor({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      alternatePhone: "",
      address: "",
      city: "",
      state: "Jharkhand",
      pincode: "",
      gstNumber: "",
      panNumber: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branchName: "",
      districts: [],
      region: "",
      licenseNumber: "",
      registrationDate: "",
      assignedPumps: 0,
      operationalPumps: 0,
      rating: 0,
      contractStart: "",
      contractEnd: "",
      serviceType: "",
      annualRevenue: 0,
      status: "active",
      notes: "",
    });
    alert(`Vendor "${newVendorData.companyName}" added successfully!`);
  };

  const handleEditVendor = () => {
    if (!selectedVendor) return;
    const updatedVendor = {
      ...selectedVendor,
      ...editFormData,
    };
    // In a real app, this would be an API call
    console.log("Updating vendor:", updatedVendor);
    setIsEditDialogOpen(false);
    alert(`Vendor "${updatedVendor.companyName}" updated successfully!`);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendor Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and monitor all solar pump vendors across Jharkhand
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
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
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <Activity className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendors">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Total Vendors</p>
                <p className="text-xl font-bold">{totalVendors}</p>
              </CardContent>
            </Card>
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-xl font-bold text-success">{activeVendors}</p>
              </CardContent>
            </Card>
            <Card className="bg-warning/5 border-warning/20">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <p className="text-xs text-muted-foreground">Under Review</p>
                <p className="text-xl font-bold text-warning">{underReviewVendors}</p>
              </CardContent>
            </Card>
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <p className="text-xs text-muted-foreground">Assigned Pumps</p>
                <p className="text-xl font-bold">{totalAssignedPumps}</p>
              </CardContent>
            </Card>
            <Card className="bg-info/5 border-info/20">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-info" />
                </div>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
                <p className="text-xl font-bold">{avgRating}</p>
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <p className="text-xs text-muted-foreground">Inactive Pumps</p>
                <p className="text-xl font-bold text-destructive">{totalAssignedPumps - totalOperationalPumps}</p>
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={vendorTypeFilter} onValueChange={setVendorTypeFilter}>
                  <SelectTrigger className="w-full md:w-44">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="solar_pump">Solar Pumps</SelectItem>
                    <SelectItem value="mini_grid">Mini Grids</SelectItem>
                    <SelectItem value="rooftop_solar">Rooftop Solar</SelectItem>
                    <SelectItem value="solar_water_heater">Solar Water Heater</SelectItem>
                    <SelectItem value="solar_street_light">Solar Street Light</SelectItem>
                    <SelectItem value="solar_high_mast">Solar High Mast</SelectItem>
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
                    <TableHead>Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Districts</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Operational</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedVendors.map((vendor) => (
                    <TableRow key={vendor.id} className="hover:bg-secondary/30">
                      <TableCell className="font-mono text-sm">{vendor.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{vendor.companyName}</div>
                        <div className="text-xs text-muted-foreground">{vendor.contactPerson}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {vendor.vendorType === "solar_pump" ? "Solar Pumps" :
                           vendor.vendorType === "mini_grid" ? "Mini Grids" :
                           vendor.vendorType === "rooftop_solar" ? "Rooftop Solar" :
                           vendor.vendorType === "solar_water_heater" ? "Water Heater" :
                           vendor.vendorType === "solar_street_light" ? "Street Light" :
                           vendor.vendorType === "solar_high_mast" ? "High Mast" :
                           vendor.vendorType}
                        </Badge>
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
                        <div className="text-sm">
                          <div className="font-medium">{formatCurrency(vendor.revenue)}</div>
                          <div className="text-xs text-muted-foreground">
                            Pending: {formatCurrency(vendor.pendingPayments)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={vendorStatusStyles[vendor.status as keyof typeof vendorStatusStyles]}>
                          {vendor.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="gap-1" onClick={() => {
                          setSelectedVendor(vendor);
                          setIsViewDialogOpen(true);
                        }}>
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {filteredVendors.length > 0 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show</span>
                    <Select value={String(itemsPerPage)} onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-20 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">entries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredVendors.length)} of {filteredVendors.length} entries
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          {/* Revenue Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                  <p className="text-xl font-bold">{formatCurrency(totalRevenue)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-warning/5 border-warning/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending Payments</p>
                  <p className="text-xl font-bold text-warning">{formatCurrency(totalPendingPayments)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Operational Rate</p>
                  <p className="text-xl font-bold text-success">
                    {((totalOperationalPumps / totalAssignedPumps) * 100).toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Revenue/Vendor</p>
                  <p className="text-xl font-bold">{formatCurrency(totalRevenue / totalVendors)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts Placeholder */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue by District</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-secondary/20 rounded-lg border border-dashed">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Revenue distribution by district</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendor Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-secondary/20 rounded-lg border border-dashed">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Performance trend over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          {/* Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-medium">Top Performers</span>
                </div>
                <div className="space-y-2">
                  {vendorsData.filter(v => v.rating >= 4.5).slice(0, 3).map(v => (
                    <div key={v.id} className="flex items-center justify-between text-sm">
                      <span>{v.companyName}</span>
                      <span className="font-medium">{v.rating}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-warning/5 border-warning/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-warning" />
                  <span className="font-medium">Contracts Expiring</span>
                </div>
                <div className="space-y-2">
                  {vendorsData.filter(v => {
                    const endDate = new Date(v.contractEnd);
                    const now = new Date();
                    const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    return diffDays <= 180 && diffDays > 0;
                  }).slice(0, 3).map(v => (
                    <div key={v.id} className="flex items-center justify-between text-sm">
                      <span className="truncate max-w-[150px]">{v.companyName}</span>
                      <span className="text-warning">{v.contractEnd}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span className="font-medium">Needs Attention</span>
                </div>
                <div className="space-y-2">
                  {vendorsData.filter(v => v.rating < 4.0).slice(0, 3).map(v => (
                    <div key={v.id} className="flex items-center justify-between text-sm">
                      <span className="truncate max-w-[150px]">{v.companyName}</span>
                      <span className="font-medium text-destructive">{v.rating}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vendor Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Contract Period</TableHead>
                    <TableHead>Operational Rate</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Performance Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorsData.map((vendor) => {
                    const operationalRate = (vendor.operationalPumps / vendor.assignedPumps) * 100;
                    const performanceScore = ((vendor.rating * 0.4) + (operationalRate * 0.4) + (vendor.status === "active" ? 20 : 0)).toFixed(1);
                    return (
                      <TableRow key={vendor.id} className="hover:bg-secondary/30">
                        <TableCell>
                          <div className="font-medium">{vendor.companyName}</div>
                          <div className="text-xs text-muted-foreground">{vendor.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{vendor.contractStart}</div>
                          <div className="text-xs text-muted-foreground">to {vendor.contractEnd}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  operationalRate >= 90 ? "bg-success" : operationalRate >= 70 ? "bg-warning" : "bg-destructive"
                                }`}
                                style={{ width: `${operationalRate}%` }}
                              />
                            </div>
                            <span className="text-sm">{operationalRate.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(vendor.revenue)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            parseFloat(performanceScore as string) >= 80 ? "default" :
                            parseFloat(performanceScore as string) >= 60 ? "secondary" : "destructive"
                          }>
                            {performanceScore}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Vendor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={newVendor.companyName}
                    onChange={(e) => setNewVendor({ ...newVendor, companyName: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={newVendor.contactPerson}
                    onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                    placeholder="Enter contact person name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                    placeholder="vendor@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="alternatePhone">Alternate Phone</Label>
                  <Input
                    id="alternatePhone"
                    value={newVendor.alternatePhone}
                    onChange={(e) => setNewVendor({ ...newVendor, alternatePhone: e.target.value })}
                    placeholder="+91 98765 43211"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select
                    value={newVendor.serviceType}
                    onValueChange={(value) => setNewVendor({ ...newVendor, serviceType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Address Details</h3>
              <div className="grid gap-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  value={newVendor.address}
                  onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                  placeholder="Enter full address"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newVendor.city}
                    onChange={(e) => setNewVendor({ ...newVendor, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={newVendor.state}
                    onChange={(e) => setNewVendor({ ...newVendor, state: e.target.value })}
                    placeholder="State"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={newVendor.pincode}
                    onChange={(e) => setNewVendor({ ...newVendor, pincode: e.target.value })}
                    placeholder="834001"
                  />
                </div>
              </div>
            </div>

            {/* Tax & Registration */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Tax & Registration Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    value={newVendor.gstNumber}
                    onChange={(e) => setNewVendor({ ...newVendor, gstNumber: e.target.value })}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input
                    id="panNumber"
                    value={newVendor.panNumber}
                    onChange={(e) => setNewVendor({ ...newVendor, panNumber: e.target.value.toUpperCase() })}
                    placeholder="AAAAA0000A"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="licenseNumber">Business License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={newVendor.licenseNumber}
                    onChange={(e) => setNewVendor({ ...newVendor, licenseNumber: e.target.value })}
                    placeholder="Enter license number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="registrationDate">Registration Date</Label>
                  <Input
                    id="registrationDate"
                    type="date"
                    value={newVendor.registrationDate}
                    onChange={(e) => setNewVendor({ ...newVendor, registrationDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Bank Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={newVendor.bankName}
                    onChange={(e) => setNewVendor({ ...newVendor, bankName: e.target.value })}
                    placeholder="State Bank of India"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="branchName">Branch Name</Label>
                  <Input
                    id="branchName"
                    value={newVendor.branchName}
                    onChange={(e) => setNewVendor({ ...newVendor, branchName: e.target.value })}
                    placeholder="Ranchi Main Branch"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={newVendor.accountNumber}
                    onChange={(e) => setNewVendor({ ...newVendor, accountNumber: e.target.value })}
                    placeholder="1234567890"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={newVendor.ifscCode}
                    onChange={(e) => setNewVendor({ ...newVendor, ifscCode: e.target.value.toUpperCase() })}
                    placeholder="SBIN0001234"
                  />
                </div>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Assignment Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="region">Region</Label>
                  <Select
                    value={newVendor.region}
                    onValueChange={(value) => setNewVendor({ ...newVendor, region: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ranchi">Ranchi</SelectItem>
                      <SelectItem value="dhanbad">Dhanbad</SelectItem>
                      <SelectItem value="jamshedpur">Jamshedpur</SelectItem>
                      <SelectItem value="hazaribagh">Hazaribagh</SelectItem>
                      <SelectItem value="all">All Districts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignedPumps">Assigned Pumps</Label>
                  <Input
                    id="assignedPumps"
                    type="number"
                    value={newVendor.assignedPumps || ""}
                    onChange={(e) => setNewVendor({ ...newVendor, assignedPumps: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="annualRevenue">Annual Revenue (₹)</Label>
                  <Input
                    id="annualRevenue"
                    type="number"
                    value={newVendor.annualRevenue || ""}
                    onChange={(e) => setNewVendor({ ...newVendor, annualRevenue: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rating">Initial Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={newVendor.rating || ""}
                    onChange={(e) => setNewVendor({ ...newVendor, rating: parseFloat(e.target.value) || 0 })}
                    placeholder="0.0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contractStart">Contract Start</Label>
                  <Input
                    id="contractStart"
                    type="date"
                    value={newVendor.contractStart}
                    onChange={(e) => setNewVendor({ ...newVendor, contractStart: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contractEnd">Contract End</Label>
                  <Input
                    id="contractEnd"
                    type="date"
                    value={newVendor.contractEnd}
                    onChange={(e) => setNewVendor({ ...newVendor, contractEnd: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newVendor.status}
                    onValueChange={(value) => setNewVendor({ ...newVendor, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={newVendor.notes}
                    onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddVendor} disabled={!newVendor.companyName || !newVendor.contactPerson || !newVendor.email}>
              Add Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Vendor Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Building2 className="w-6 h-6" />
              Vendor Details
            </DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <div className="grid gap-6 py-4">
              {/* Header Info */}
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedVendor.companyName}</h2>
                  <p className="text-muted-foreground">{selectedVendor.id}</p>
                </div>
                <Badge variant="outline" className={vendorStatusStyles[selectedVendor.status as keyof typeof vendorStatusStyles]}>
                  {selectedVendor.status.replace("_", " ")}
                </Badge>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-3 text-center">
                    <Star className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold">{selectedVendor.rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </CardContent>
                </Card>
                <Card className="bg-success/5 border-success/20">
                  <CardContent className="p-3 text-center">
                    <CheckCircle className="w-5 h-5 text-success mx-auto mb-1" />
                    <p className="text-lg font-bold">{selectedVendor.operationalPumps}</p>
                    <p className="text-xs text-muted-foreground">Operational</p>
                  </CardContent>
                </Card>
                <Card className="bg-warning/5 border-warning/20">
                  <CardContent className="p-3 text-center">
                    <Users className="w-5 h-5 text-warning mx-auto mb-1" />
                    <p className="text-lg font-bold">{selectedVendor.assignedPumps}</p>
                    <p className="text-xs text-muted-foreground">Assigned</p>
                  </CardContent>
                </Card>
                <Card className="bg-accent/5 border-accent/20">
                  <CardContent className="p-3 text-center">
                    <TrendingUp className="w-5 h-5 text-accent mx-auto mb-1" />
                    <p className="text-lg font-bold">{formatCurrency(selectedVendor.revenue)}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Information */}
              <Tabs defaultValue="contact">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="contact" className="gap-2">
                    <Phone className="w-4 h-4" />
                    Contact
                  </TabsTrigger>
                  <TabsTrigger value="location" className="gap-2">
                    <MapPinned className="w-4 h-4" />
                    Location
                  </TabsTrigger>
                  <TabsTrigger value="contract" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Contract
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="gap-2">
                    <Activity className="w-4 h-4" />
                    Performance
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="contact" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Contact Person</p>
                        <p className="font-medium">{selectedVendor.contactPerson}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedVendor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedVendor.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Vendor Type</p>
                        <p className="font-medium">
                          {selectedVendor.vendorType === "solar_pump" ? "Solar Pumps" :
                           selectedVendor.vendorType === "mini_grid" ? "Mini Grids" :
                           selectedVendor.vendorType === "rooftop_solar" ? "Rooftop Solar" :
                           selectedVendor.vendorType === "solar_water_heater" ? "Solar Water Heater" :
                           selectedVendor.vendorType === "solar_street_light" ? "Solar Street Light" :
                           selectedVendor.vendorType === "solar_high_mast" ? "Solar High Mast" :
                           selectedVendor.vendorType}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-4 mt-4">
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPinned className="w-5 h-5" />
                      <span className="font-medium">Assigned Districts</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.districts.map((district) => (
                        <Badge key={district} variant="outline">{district}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Contract Period</p>
                      <p className="font-medium">{selectedVendor.contractStart} to {selectedVendor.contractEnd}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contract" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Contract Start Date</p>
                      <p className="font-medium">{selectedVendor.contractStart}</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Contract End Date</p>
                      <p className="font-medium">{selectedVendor.contractEnd}</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                      <p className="font-medium text-success">{formatCurrency(selectedVendor.revenue)}</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Pending Payments</p>
                      <p className="font-medium text-warning">{formatCurrency(selectedVendor.pendingPayments)}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Operational Rate</span>
                        <span className="font-medium">
                          {((selectedVendor.operationalPumps / selectedVendor.assignedPumps) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            (selectedVendor.operationalPumps / selectedVendor.assignedPumps) >= 0.9 ? "bg-success" :
                            (selectedVendor.operationalPumps / selectedVendor.assignedPumps) >= 0.7 ? "bg-warning" : "bg-destructive"
                          }`}
                          style={{ width: `${(selectedVendor.operationalPumps / selectedVendor.assignedPumps) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Current Rating</p>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xl font-bold">{selectedVendor.rating}</span>
                        <span className="text-xs text-muted-foreground">/ 5.0</span>
                      </div>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Assigned Pumps</p>
                      <p className="text-xl font-bold">{selectedVendor.assignedPumps}</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Operational Pumps</p>
                      <p className="text-xl font-bold text-success">{selectedVendor.operationalPumps}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => {
              if (selectedVendor) {
                setEditFormData({
                  companyName: selectedVendor.companyName,
                  contactPerson: selectedVendor.contactPerson,
                  email: selectedVendor.email,
                  phone: selectedVendor.phone,
                  alternatePhone: "",
                  address: "",
                  city: "",
                  state: "Jharkhand",
                  pincode: "",
                  gstNumber: "",
                  panNumber: "",
                  bankName: "",
                  accountNumber: "",
                  ifscCode: "",
                  branchName: "",
                  districts: selectedVendor.districts,
                  region: "",
                  licenseNumber: "",
                  registrationDate: "",
                  assignedPumps: selectedVendor.assignedPumps,
                  operationalPumps: selectedVendor.operationalPumps,
                  rating: selectedVendor.rating,
                  contractStart: selectedVendor.contractStart,
                  contractEnd: selectedVendor.contractEnd,
                  serviceType: "",
                  annualRevenue: selectedVendor.revenue,
                  status: selectedVendor.status,
                  notes: "",
                  vendorType: selectedVendor.vendorType,
                });
                setIsViewDialogOpen(false);
                setIsEditDialogOpen(true);
              }
            }}>
              <Edit className="w-4 h-4" />
              Edit Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Edit className="w-6 h-6" />
              Edit Vendor - {selectedVendor?.id}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editCompanyName">Company Name *</Label>
                  <Input
                    id="editCompanyName"
                    value={editFormData.companyName}
                    onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editContactPerson">Contact Person *</Label>
                  <Input
                    id="editContactPerson"
                    value={editFormData.contactPerson}
                    onChange={(e) => setEditFormData({ ...editFormData, contactPerson: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editEmail">Email Address *</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editPhone">Phone Number</Label>
                  <Input
                    id="editPhone"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editVendorType">Vendor Type</Label>
                  <Select
                    value={editFormData.vendorType}
                    onValueChange={(value) => setEditFormData({ ...editFormData, vendorType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solar_pump">Solar Pumps</SelectItem>
                      <SelectItem value="mini_grid">Mini Grids</SelectItem>
                      <SelectItem value="rooftop_solar">Rooftop Solar</SelectItem>
                      <SelectItem value="solar_water_heater">Solar Water Heater</SelectItem>
                      <SelectItem value="solar_street_light">Solar Street Light</SelectItem>
                      <SelectItem value="solar_high_mast">Solar High Mast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editStatus">Status</Label>
                  <Select
                    value={editFormData.status}
                    onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Assignment Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editAssignedPumps">Assigned Pumps</Label>
                  <Input
                    id="editAssignedPumps"
                    type="number"
                    value={editFormData.assignedPumps || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, assignedPumps: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editOperationalPumps">Operational Pumps</Label>
                  <Input
                    id="editOperationalPumps"
                    type="number"
                    value={editFormData.operationalPumps || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, operationalPumps: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editRating">Rating</Label>
                  <Input
                    id="editRating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editFormData.rating || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, rating: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editContractStart">Contract Start</Label>
                  <Input
                    id="editContractStart"
                    type="date"
                    value={editFormData.contractStart}
                    onChange={(e) => setEditFormData({ ...editFormData, contractStart: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editContractEnd">Contract End</Label>
                  <Input
                    id="editContractEnd"
                    type="date"
                    value={editFormData.contractEnd}
                    onChange={(e) => setEditFormData({ ...editFormData, contractEnd: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editAnnualRevenue">Annual Revenue (₹)</Label>
                <Input
                  id="editAnnualRevenue"
                  type="number"
                  value={editFormData.annualRevenue || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, annualRevenue: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Additional Notes</h3>
              <div className="grid gap-2">
                <Label htmlFor="editNotes">Notes</Label>
                <Input
                  id="editNotes"
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditVendor} disabled={!editFormData.companyName || !editFormData.contactPerson || !editFormData.email}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminVendors;
