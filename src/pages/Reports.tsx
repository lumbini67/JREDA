import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  Sun,
  Zap,
  Home,
  TrendingUp,
  FileSpreadsheet,
  FileText as FilePdf,
  Printer,
} from "lucide-react";
import { useScada, ScadaType } from "@/context/ScadaContext";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const typeLabels: Record<ScadaType, string> = {
  solar_pump: "Solar Pump",
  mini_grid: "Mini Grid",
  rooftop_solar: "Rooftop Solar",
};

const Reports = () => {
  const { devices } = useScada();
  const [selectedDevice, setSelectedDevice] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredDevices = devices.filter((device) => {
    if (selectedDevice !== "all" && device.id !== selectedDevice) return false;
    if (selectedType !== "all" && device.type !== selectedType) return false;
    return true;
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("JREDA SCADA Device Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add summary
    doc.setTextColor(0);
    doc.text(`Total Devices: ${filteredDevices.length}`, 14, 40);
    doc.text(`Total Capacity: ${totalCapacity.toFixed(1)} kW`, 14, 48);
    doc.text(`Total Energy: ${(totalEnergy / 1000).toFixed(1)} MWh`, 14, 56);
    doc.text(`Online Rate: ${((onlineCount / filteredDevices.length) * 100 || 0).toFixed(0)}%`, 14, 64);
    
    // Add table
    const tableData = filteredDevices.map((device) => [
      device.id,
      device.name,
      typeLabels[device.type],
      device.district,
      `${device.capacity} kW`,
      `${device.todayEnergy.toFixed(2)} kWh`,
      `${(device.totalEnergy / 1000).toFixed(2)} MWh`,
      device.status,
    ]);
    
    autoTable(doc, {
      head: [["ID", "Name", "Type", "District", "Capacity", "Today Energy", "Total Energy", "Status"]],
      body: tableData,
      startY: 75,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    });
    
    // Save PDF
    doc.save(`jreda-report-${new Date().toISOString().split("T")[0]}.pdf`);
    
    toast({
      title: "PDF Exported",
      description: "Your report has been downloaded as PDF.",
    });
  };

  const handleExportExcel = () => {
    // Prepare data for Excel
    const reportData = filteredDevices.map((device) => ({
      "Device ID": device.id,
      "Name": device.name,
      "Type": typeLabels[device.type],
      "District": device.district,
      "Capacity (kW)": device.capacity,
      "Today Energy (kWh)": device.todayEnergy.toFixed(2),
      "Total Energy (MWh)": (device.totalEnergy / 1000).toFixed(2),
      "Status": device.status,
      "Beneficiary": device.beneficiaryName,
      "Last Updated": new Date(device.lastSync).toLocaleString(),
    }));
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(reportData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Device Report");
    
    // Add summary sheet
    const summaryData = [
      { "Metric": "Total Devices", "Value": filteredDevices.length },
      { "Metric": "Total Capacity (kW)", "Value": totalCapacity.toFixed(1) },
      { "Metric": "Total Energy (MWh)", "Value": (totalEnergy / 1000).toFixed(1) },
      { "Metric": "Online Devices", "Value": onlineCount },
      { "Metric": "Offline Devices", "Value": filteredDevices.length - onlineCount },
      { "Metric": "Online Rate", "Value": `${((onlineCount / filteredDevices.length) * 100 || 0).toFixed(0)}%` },
      { "Metric": "Report Date", "Value": new Date().toLocaleString() },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
    
    // Save Excel file
    XLSX.writeFile(wb, `jreda-report-${new Date().toISOString().split("T")[0]}.xlsx`);
    
    toast({
      title: "Excel Exported",
      description: "Your report has been downloaded as Excel.",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Preparing Print",
      description: "Opening print dialog...",
    });
    window.print();
  };

  // Calculate summary stats
  const totalCapacity = filteredDevices.reduce((sum, d) => sum + d.capacity, 0);
  const totalEnergy = filteredDevices.reduce((sum, d) => sum + d.totalEnergy, 0);
  const onlineCount = filteredDevices.filter((d) => d.status === "online").length;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground mt-1">
              Generate and export SCADA device performance reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
              <FilePdf className="w-4 h-4" />
              Export PDF
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </Button>
            <Button variant="outline" className="gap-2" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Device</Label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  {devices.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Device Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="solar_pump">Solar Pumps</SelectItem>
                  <SelectItem value="mini_grid">Mini Grids</SelectItem>
                  <SelectItem value="rooftop_solar">Rooftop Solar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{filteredDevices.length}</p>
              <p className="text-sm text-muted-foreground">Total Devices</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCapacity.toFixed(1)} kW</p>
              <p className="text-sm text-muted-foreground">Total Capacity</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{(totalEnergy / 1000).toFixed(1)} MWh</p>
              <p className="text-sm text-muted-foreground">Total Energy</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
              <Sun className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {((onlineCount / filteredDevices.length) * 100 || 0).toFixed(0)}%
              </p>
              <p className="text-sm text-muted-foreground">Online Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList>
          <TabsTrigger value="summary">Summary Report</TabsTrigger>
          <TabsTrigger value="individual">Individual Reports</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Device Summary Report</CardTitle>
              <CardDescription>
                Overview of all SCADA devices with key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Capacity (kW)</TableHead>
                    <TableHead>Today Energy (kWh)</TableHead>
                    <TableHead>Total Energy (MWh)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-mono">{device.id}</TableCell>
                      <TableCell>{device.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{typeLabels[device.type]}</Badge>
                      </TableCell>
                      <TableCell>{device.district}</TableCell>
                      <TableCell>{device.capacity}</TableCell>
                      <TableCell>{device.todayEnergy.toFixed(2)}</TableCell>
                      <TableCell>{(device.totalEnergy / 1000).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            device.status === "online"
                              ? "bg-success/10 text-success"
                              : device.status === "offline"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-warning/10 text-warning"
                          }
                        >
                          {device.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDevices.map((device) => (
              <Card key={device.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{device.name}</CardTitle>
                    <Badge variant="outline">{device.id}</Badge>
                  </div>
                  <CardDescription>{typeLabels[device.type]}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">District</p>
                      <p className="font-medium">{device.district}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-medium">{device.capacity} kW</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Today's Energy</p>
                      <p className="font-medium">{device.todayEnergy.toFixed(2)} kWh</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Energy</p>
                      <p className="font-medium">{(device.totalEnergy / 1000).toFixed(2)} MWh</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Beneficiary</p>
                      <p className="font-medium">{device.beneficiaryName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge
                        className={
                          device.status === "online"
                            ? "bg-success/10 text-success"
                            : device.status === "offline"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-warning/10 text-warning"
                        }
                      >
                        {device.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full gap-2 mt-4">
                    <Download className="w-4 h-4" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>
                Comparative performance metrics across device types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(["solar_pump", "mini_grid", "rooftop_solar"] as ScadaType[]).map((type) => {
                  const typeDevices = filteredDevices.filter((d) => d.type === type);
                  const typeCapacity = typeDevices.reduce((sum, d) => sum + d.capacity, 0);
                  const typeEnergy = typeDevices.reduce((sum, d) => sum + d.totalEnergy, 0);
                  const typeOnline = typeDevices.filter((d) => d.status === "online").length;

                  if (typeDevices.length === 0) return null;

                  return (
                    <div key={type} className="p-4 rounded-xl bg-secondary/30">
                      <div className="flex items-center gap-3 mb-4">
                        {type === "solar_pump" && <Sun className="w-5 h-5 text-primary" />}
                        {type === "mini_grid" && <Zap className="w-5 h-5 text-accent" />}
                        {type === "rooftop_solar" && <Home className="w-5 h-5 text-info" />}
                        <h4 className="font-semibold">{typeLabels[type]}</h4>
                        <Badge variant="outline">{typeDevices.length} devices</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Capacity</p>
                          <p className="text-xl font-bold">{typeCapacity.toFixed(1)} kW</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Energy</p>
                          <p className="text-xl font-bold">{(typeEnergy / 1000).toFixed(1)} MWh</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Online Devices</p>
                          <p className="text-xl font-bold text-success">
                            {typeOnline}/{typeDevices.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg. Capacity</p>
                          <p className="text-xl font-bold">
                            {(typeCapacity / typeDevices.length).toFixed(1)} kW
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Reports;
