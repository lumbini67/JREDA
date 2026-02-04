import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, MachineType } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
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
} from "lucide-react";

const typeConfig: Record<MachineType, { label: string; icon: typeof Sun; color: string; bgColor: string }> = {
  solar_pump: { label: "Solar Pump", icon: Sun, color: "text-primary", bgColor: "bg-primary/10" },
  mini_grid: { label: "Mini Grid", icon: Zap, color: "text-accent", bgColor: "bg-accent/10" },
  rooftop_solar: { label: "Rooftop Solar", icon: Home, color: "text-info", bgColor: "bg-info/10" },
};

// Dummy devices filtered by machine type
const getDummyDevices = (type: MachineType) => {
  const devices = {
    solar_pump: [
      { id: "SP001", name: "Solar Pump - Kanke", district: "Ranchi", block: "Kanke", status: "online", currentPower: 3.2, capacity: 5, todayEnergy: 18.5, lastSync: new Date().toISOString() },
      { id: "SP002", name: "Solar Pump - Ratu", district: "Ranchi", block: "Ratu", status: "online", currentPower: 4.1, capacity: 5, todayEnergy: 22.3, lastSync: new Date().toISOString() },
      { id: "SP003", name: "Solar Pump - Ormanjhi", district: "Ranchi", block: "Ormanjhi", status: "offline", currentPower: 0, capacity: 5, todayEnergy: 12.1, lastSync: new Date().toISOString() },
      { id: "SP004", name: "Solar Pump - Kanke Block", district: "Ranchi", block: "Kanke", status: "online", currentPower: 2.8, capacity: 3, todayEnergy: 15.2, lastSync: new Date().toISOString() },
      { id: "SP005", name: "Solar Pump - Ranchi Sadar", district: "Ranchi", block: "Ranchi Sadar", status: "online", currentPower: 3.5, capacity: 5, todayEnergy: 19.8, lastSync: new Date().toISOString() },
      { id: "SP006", name: "Solar Pump - Bundu", district: "Ranchi", block: "Bundu", status: "maintenance", currentPower: 0, capacity: 3, todayEnergy: 8.5, lastSync: new Date().toISOString() },
    ],
    mini_grid: [
      { id: "MG001", name: "Mini Grid - Lapra", district: "Ranchi", block: "Lapra", status: "online", currentPower: 12.5, capacity: 15, todayEnergy: 85.3, lastSync: new Date().toISOString() },
      { id: "MG002", name: "Mini Grid - Tati", district: "Ranchi", block: "Tati", status: "online", currentPower: 10.2, capacity: 15, todayEnergy: 72.1, lastSync: new Date().toISOString() },
      { id: "MG003", name: "Mini Grid - Rahe", district: "Ranchi", block: "Rahe", status: "online", currentPower: 8.5, capacity: 10, todayEnergy: 58.2, lastSync: new Date().toISOString() },
    ],
    rooftop_solar: [
      { id: "RS001", name: "Rooftop - JREDA Office", district: "Ranchi", block: "Ranchi Sadar", status: "online", currentPower: 5.1, capacity: 10, todayEnergy: 32.8, lastSync: new Date().toISOString() },
      { id: "RS002", name: "Rooftop - Govt Hospital", district: "Ranchi", block: "Kanke", status: "online", currentPower: 8.2, capacity: 15, todayEnergy: 52.5, lastSync: new Date().toISOString() },
      { id: "RS003", name: "Rooftop - School Building", district: "Ranchi", block: "Ratu", status: "offline", currentPower: 0, capacity: 5, todayEnergy: 18.2, lastSync: new Date().toISOString() },
    ],
  };
  return devices[type] || devices.solar_pump;
};

const statusConfig: Record<string, { label: string; icon: typeof Wifi; color: string; bgColor: string }> = {
  online: { label: "Online", icon: Wifi, color: "text-success", bgColor: "bg-success/10" },
  offline: { label: "Offline", icon: WifiOff, color: "text-destructive", bgColor: "bg-destructive/10" },
  maintenance: { label: "Maintenance", icon: Wrench, color: "text-warning", bgColor: "bg-warning/10" },
};

const ManagerScadaMonitoring = () => {
  const { machineType } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [liveDevices, setLiveDevices] = useState(getDummyDevices(machineType || "solar_pump"));
  const [refreshing, setRefreshing] = useState(false);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDevices((prev) =>
        prev.map((device) => ({
          ...device,
          currentPower: device.status === "online"
            ? Math.max(0, device.currentPower + (Math.random() - 0.5) * device.capacity * 0.05)
            : 0,
          todayEnergy: device.todayEnergy + (device.status === "online" ? Math.random() * 0.05 : 0),
          lastSync: device.status === "online" ? new Date().toISOString() : device.lastSync,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setLiveDevices(getDummyDevices(machineType || "solar_pump"));
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredDevices = liveDevices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || device.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPower = liveDevices
    .filter((d) => d.status === "online")
    .reduce((sum, d) => sum + d.currentPower, 0);

  const totalTodayEnergy = liveDevices.reduce((sum, d) => sum + d.todayEnergy, 0);

  const typeInfo = machineType ? typeConfig[machineType] : typeConfig.solar_pump;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {typeInfo.label} Monitoring
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring of {typeInfo.label.toLowerCase()} devices
            </p>
          </div>
          <div className="flex items-center gap-3">
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
          const statusInfo = statusConfig[device.status];
          const StatusIcon = statusInfo.icon;
          const powerPercentage = (device.currentPower / device.capacity) * 100;

          return (
            <Card
              key={device.id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${typeInfo.bgColor} flex items-center justify-center`}>
                      <typeInfo.icon className={`w-5 h-5 ${typeInfo.color}`} />
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
                  {device.block}, {device.district}
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
                    <p className="text-xs text-muted-foreground">Block</p>
                    <p className="font-semibold">{device.block}</p>
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
        </Card>
      )}
    </DashboardLayout>
  );
};

export default ManagerScadaMonitoring;
