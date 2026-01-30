import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sun,
  Zap,
  Home,
  MapPin,
  Wifi,
  WifiOff,
  Wrench,
  Search,
  Eye,
  Clock,
  Battery,
  Activity,
  RefreshCw,
  Map,
} from "lucide-react";
import { useScada, ScadaType } from "@/context/ScadaContext";

const typeConfig: Record<ScadaType, { label: string; icon: typeof Sun; color: string; bgColor: string }> = {
  solar_pump: { label: "Solar Pump", icon: Sun, color: "text-primary", bgColor: "bg-primary/10" },
  mini_grid: { label: "Mini Grid", icon: Zap, color: "text-accent", bgColor: "bg-accent/10" },
  rooftop_solar: { label: "Rooftop Solar", icon: Home, color: "text-info", bgColor: "bg-info/10" },
};

const statusConfig: Record<string, { label: string; icon: typeof Wifi; color: string; bgColor: string }> = {
  online: { label: "Online", icon: Wifi, color: "text-success", bgColor: "bg-success/10" },
  offline: { label: "Offline", icon: WifiOff, color: "text-destructive", bgColor: "bg-destructive/10" },
  maintenance: { label: "Maintenance", icon: Wrench, color: "text-warning", bgColor: "bg-warning/10" },
};

const ScadaMonitoring = () => {
  const { devices } = useScada();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [liveDevices, setLiveDevices] = useState(devices);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDevices((prev) =>
        prev.map((device) => ({
          ...device,
          currentPower: device.status === "online" 
            ? Math.max(0, device.currentPower + (Math.random() - 0.5) * device.capacity * 0.1)
            : 0,
          todayEnergy: device.todayEnergy + (device.status === "online" ? Math.random() * 0.1 : 0),
          lastSync: device.status === "online" ? new Date().toISOString() : device.lastSync,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Update when context changes
  useEffect(() => {
    setLiveDevices(devices);
  }, [devices]);

  const handleRefresh = () => {
    setRefreshing(true);
    setLiveDevices(devices);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredDevices = liveDevices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || device.type === filterType;
    const matchesStatus = filterStatus === "all" || device.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPower = liveDevices
    .filter((d) => d.status === "online")
    .reduce((sum, d) => sum + d.currentPower, 0);

  const totalTodayEnergy = liveDevices.reduce((sum, d) => sum + d.todayEnergy, 0);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">SCADA Monitoring</h1>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring of all SCADA devices
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate("/scada-management")}>
              <Map className="w-4 h-4 mr-2" />
              View Maps
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Live: {new Date().toLocaleTimeString()}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className={refreshing ? "animate-spin" : ""}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Devices</p>
                <p className="text-3xl font-bold">{liveDevices.length}</p>
              </div>
              <Activity className="w-10 h-10 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Online Devices</p>
                <p className="text-3xl font-bold text-success">
                  {liveDevices.filter((d) => d.status === "online").length}
                </p>
              </div>
              <Wifi className="w-10 h-10 text-success/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Power</p>
                <p className="text-3xl font-bold">{totalPower.toFixed(1)} kW</p>
              </div>
              <Zap className="w-10 h-10 text-accent/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Energy</p>
                <p className="text-3xl font-bold">{totalTodayEnergy.toFixed(1)} kWh</p>
              </div>
              <Battery className="w-10 h-10 text-info/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search devices..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="solar_pump">Solar Pumps</SelectItem>
                <SelectItem value="mini_grid">Mini Grids</SelectItem>
                <SelectItem value="rooftop_solar">Rooftop Solar</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
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

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device) => {
          const typeInfo = typeConfig[device.type];
          const statusInfo = statusConfig[device.status];
          const TypeIcon = typeInfo.icon;
          const StatusIcon = statusInfo.icon;
          const powerPercentage = (device.currentPower / device.capacity) * 100;

          return (
            <Card
              key={device.id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(`/scada-monitoring/${device.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${typeInfo.bgColor} flex items-center justify-center`}>
                      <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                        {device.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground font-mono">{device.id}</p>
                    </div>
                  </div>
                  <Badge className={`${statusInfo.bgColor} ${statusInfo.color}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {device.location}, {device.district}
                </div>

                {/* Power Output */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Power</span>
                    <span className="font-semibold">
                      {device.currentPower.toFixed(2)} / {device.capacity} kW
                    </span>
                  </div>
                  <Progress value={powerPercentage} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Today's Energy</p>
                    <p className="font-semibold">{device.todayEnergy.toFixed(1)} kWh</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Energy</p>
                    <p className="font-semibold">{(device.totalEnergy / 1000).toFixed(1)} MWh</p>
                  </div>
                </div>

                {/* Last Sync */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(device.lastSync).toLocaleTimeString()}
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDevices.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No devices found matching your filters.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/scada-crud")}
          >
            Add New Device
          </Button>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default ScadaMonitoring;
