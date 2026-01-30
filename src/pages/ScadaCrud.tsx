import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Sun,
  Zap,
  Home,
  MapPin,
  Wifi,
  WifiOff,
  Wrench,
} from "lucide-react";
import { useScada, ScadaDevice, ScadaType } from "@/context/ScadaContext";
import { toast } from "@/hooks/use-toast";

const typeConfig: Record<ScadaType, { label: string; icon: typeof Sun; color: string }> = {
  solar_pump: { label: "Solar Pump", icon: Sun, color: "bg-primary/10 text-primary" },
  mini_grid: { label: "Mini Grid", icon: Zap, color: "bg-accent/10 text-accent" },
  rooftop_solar: { label: "Rooftop Solar", icon: Home, color: "bg-info/10 text-info" },
};

const statusConfig: Record<string, { label: string; icon: typeof Wifi; color: string }> = {
  online: { label: "Online", icon: Wifi, color: "bg-success/10 text-success" },
  offline: { label: "Offline", icon: WifiOff, color: "bg-destructive/10 text-destructive" },
  maintenance: { label: "Maintenance", icon: Wrench, color: "bg-warning/10 text-warning" },
};

const districts = ["Ranchi", "Hazaribagh", "Dhanbad", "Bokaro", "Giridih", "Deoghar", "Jamshedpur", "Dumka"];

const ScadaCrud = () => {
  const { devices, addDevice, updateDevice, deleteDevice } = useScada();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<ScadaDevice | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "solar_pump" as ScadaType,
    location: "",
    district: "",
    capacity: "",
    status: "online" as "online" | "offline" | "maintenance",
    installationDate: "",
    beneficiaryName: "",
    beneficiaryContact: "",
    latitude: "",
    longitude: "",
    imei: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "solar_pump",
      location: "",
      district: "",
      capacity: "",
      status: "online",
      installationDate: "",
      beneficiaryName: "",
      beneficiaryContact: "",
      latitude: "",
      longitude: "",
      imei: "",
    });
  };

  const handleAdd = () => {
    if (!formData.name || !formData.district || !formData.capacity) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    addDevice({
      name: formData.name,
      type: formData.type,
      location: formData.location,
      district: formData.district,
      capacity: parseFloat(formData.capacity),
      status: formData.status,
      installationDate: formData.installationDate || new Date().toISOString().split("T")[0],
      beneficiaryName: formData.beneficiaryName,
      beneficiaryContact: formData.beneficiaryContact,
      latitude: parseFloat(formData.latitude) || 23.35,
      longitude: parseFloat(formData.longitude) || 85.33,
      imei: formData.imei || `86090604${Math.floor(Math.random() * 10000000)}`,
    });

    toast({
      title: "Device Added",
      description: `${formData.name} has been added successfully`,
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (device: ScadaDevice) => {
    setEditingDevice(device);
    setFormData({
      name: device.name,
      type: device.type,
      location: device.location,
      district: device.district,
      capacity: device.capacity.toString(),
      status: device.status,
      installationDate: device.installationDate,
      beneficiaryName: device.beneficiaryName,
      beneficiaryContact: device.beneficiaryContact,
      latitude: device.latitude.toString(),
      longitude: device.longitude.toString(),
      imei: device.imei,
    });
  };

  const handleUpdate = () => {
    if (!editingDevice) return;

    updateDevice(editingDevice.id, {
      name: formData.name,
      type: formData.type,
      location: formData.location,
      district: formData.district,
      capacity: parseFloat(formData.capacity),
      status: formData.status,
      installationDate: formData.installationDate,
      beneficiaryName: formData.beneficiaryName,
      beneficiaryContact: formData.beneficiaryContact,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      imei: formData.imei,
    });

    toast({
      title: "Device Updated",
      description: `${formData.name} has been updated successfully`,
    });

    resetForm();
    setEditingDevice(null);
  };

  const handleDelete = (device: ScadaDevice) => {
    deleteDevice(device.id);
    toast({
      title: "Device Deleted",
      description: `${device.name} has been removed`,
      variant: "destructive",
    });
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || device.type === filterType;
    return matchesSearch && matchesType;
  });

  const DeviceForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Device Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter device name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Device Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value: ScadaType) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solar_pump">🌞 Solar Pump</SelectItem>
              <SelectItem value="mini_grid">⚡ Mini Grid</SelectItem>
              <SelectItem value="rooftop_solar">🏠 Rooftop Solar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="district">District *</Label>
          <Select
            value={formData.district}
            onValueChange={(value) => setFormData({ ...formData, district: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity (kW) *</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            placeholder="e.g., 7.5"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Block, Village name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
          <Input
            id="beneficiaryName"
            value={formData.beneficiaryName}
            onChange={(e) => setFormData({ ...formData, beneficiaryName: e.target.value })}
            placeholder="Name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="beneficiaryContact">Contact Number</Label>
          <Input
            id="beneficiaryContact"
            value={formData.beneficiaryContact}
            onChange={(e) => setFormData({ ...formData, beneficiaryContact: e.target.value })}
            placeholder="Mobile number"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="0.0001"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            placeholder="23.3441"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="0.0001"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            placeholder="85.3096"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: "online" | "offline" | "maintenance") =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="installationDate">Installation Date</Label>
          <Input
            id="installationDate"
            type="date"
            value={formData.installationDate}
            onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="imei">IMEI Number</Label>
          <Input
            id="imei"
            value={formData.imei}
            onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
            placeholder="Device IMEI"
          />
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">SCADA Device Management</h1>
            <p className="text-muted-foreground mt-1">
              Add, edit, and manage SCADA devices for Solar Pumps, Mini Grids, and Rooftop Solar
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => resetForm()}>
                <Plus className="w-4 h-4" />
                Add New Device
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New SCADA Device</DialogTitle>
                <DialogDescription>
                  Enter the details for the new SCADA monitoring device
                </DialogDescription>
              </DialogHeader>
              <DeviceForm />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Add Device</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sun className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {devices.filter((d) => d.type === "solar_pump").length}
              </p>
              <p className="text-sm text-muted-foreground">Solar Pumps</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {devices.filter((d) => d.type === "mini_grid").length}
              </p>
              <p className="text-sm text-muted-foreground">Mini Grids</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
              <Home className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {devices.filter((d) => d.type === "rooftop_solar").length}
              </p>
              <p className="text-sm text-muted-foreground">Rooftop Solar</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Wifi className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {devices.filter((d) => d.status === "online").length}
              </p>
              <p className="text-sm text-muted-foreground">Online Devices</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or district..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="solar_pump">Solar Pumps</SelectItem>
                <SelectItem value="mini_grid">Mini Grids</SelectItem>
                <SelectItem value="rooftop_solar">Rooftop Solar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Devices Table */}
      <Card>
        <CardHeader>
          <CardTitle>SCADA Devices ({filteredDevices.length})</CardTitle>
          <CardDescription>
            Manage all registered SCADA monitoring devices
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
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Beneficiary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => {
                const typeInfo = typeConfig[device.type];
                const statusInfo = statusConfig[device.status];
                const TypeIcon = typeInfo.icon;
                const StatusIcon = statusInfo.icon;

                return (
                  <TableRow key={device.id}>
                    <TableCell className="font-mono text-sm">{device.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{device.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {device.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={typeInfo.color}>
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {typeInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{device.district}</TableCell>
                    <TableCell>{device.capacity} kW</TableCell>
                    <TableCell>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{device.beneficiaryName}</div>
                      <div className="text-xs text-muted-foreground">{device.beneficiaryContact}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog
                          open={editingDevice?.id === device.id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setEditingDevice(null);
                              resetForm();
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(device)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit SCADA Device</DialogTitle>
                              <DialogDescription>
                                Update the details for {device.name}
                              </DialogDescription>
                            </DialogHeader>
                            <DeviceForm isEdit />
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingDevice(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdate}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Device?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{device.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(device)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ScadaCrud;
