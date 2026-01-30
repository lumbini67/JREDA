import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Sun,
  Zap,
  Home,
  MapPin,
  Wifi,
  WifiOff,
  Wrench,
  Clock,
  Battery,
  Activity,
  Thermometer,
  Droplets,
  Gauge,
  RefreshCw,
  User,
  Phone,
  Calendar,
  Cpu,
} from "lucide-react";
import { useScada, ScadaType } from "@/context/ScadaContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

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

// Generate sample chart data
const generateHourlyData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0") + ":00";
    const irradiance = i >= 6 && i <= 18 ? Math.sin(((i - 6) / 12) * Math.PI) * 1000 : 0;
    const power = irradiance * 0.15 * (0.9 + Math.random() * 0.2);
    data.push({
      time: hour,
      power: Math.max(0, power).toFixed(2),
      irradiance: irradiance.toFixed(0),
    });
  }
  return data;
};

const ScadaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const locationState = useLocation().state as { fromMap?: boolean; locationData?: any };
  const { getDeviceById } = useScada();
  
  // Use location data if coming from map, otherwise try to find device
  const device = getDeviceById(id || "");
  const locationData = locationState?.locationData;
  
  // Create a virtual device from location data if available
  const virtualDevice = locationData ? {
    id: locationData.id,
    name: locationData.name,
    type: locationData.type as any,
    status: locationData.status === "healthy" ? "online" : locationData.status === "warning" ? "maintenance" : "offline",
    location: `${locationData.name}, ${locationData.district}`,
    district: locationData.district,
    latitude: locationData.details.latitude,
    longitude: locationData.details.longitude,
    capacity: parseFloat(locationData.capacity),
    currentPower: parseFloat(locationData.output),
    todayEnergy: parseFloat(locationData.output) * 6,
    totalEnergy: parseFloat(locationData.capacity) * 1000,
    lastSync: new Date().toISOString(),
    beneficiaryName: locationData.details.owner || "N/A",
    beneficiaryContact: "N/A",
  } : null;
  
  const displayDevice = device || virtualDevice;
  const [refreshing, setRefreshing] = useState(false);
  const [chartData] = useState(generateHourlyData());
  const isFromMap = locationData && !device;

  const handleBack = () => {
    // Check if we came from a map view
    const referrer = document.referrer;
    if (referrer.includes("/scada-map/")) {
      const typeMatch = referrer.match(/\/scada-map\/([^/]+)/);
      if (typeMatch && typeMatch[1]) {
        navigate(`/scada-map/${typeMatch[1]}`);
        return;
      }
    }
    navigate("/scada-management");
  };

  // Simulated live parameters
  const [liveParams, setLiveParams] = useState({
    dcVoltage: 545.0,
    dcCurrent: 8.2,
    acVoltage: 228.0,
    acCurrent: 18.5,
    frequency: 50.0,
    powerFactor: 0.95,
    temperature: 42.0,
    flowRate: 185,
    dailyWater: 22400,
    runHours: 6.5,
    totalRunHours: 2840,
    efficiency: 94.5,
  });

  useEffect(() => {
    if (!displayDevice || displayDevice.status !== "online") return;

    const interval = setInterval(() => {
      setLiveParams((prev) => ({
        dcVoltage: prev.dcVoltage + (Math.random() - 0.5) * 5,
        dcCurrent: prev.dcCurrent + (Math.random() - 0.5) * 0.3,
        acVoltage: prev.acVoltage + (Math.random() - 0.5) * 2,
        acCurrent: prev.acCurrent + (Math.random() - 0.5) * 0.5,
        frequency: 50 + (Math.random() - 0.5) * 0.2,
        powerFactor: 0.95 + (Math.random() - 0.5) * 0.02,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
        flowRate: Math.round(prev.flowRate + (Math.random() - 0.5) * 5),
        dailyWater: prev.dailyWater + Math.random() * 10,
        runHours: prev.runHours + 0.001,
        totalRunHours: prev.totalRunHours + 0.001,
        efficiency: 94 + Math.random() * 2,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [displayDevice]);

  if (!displayDevice) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-muted-foreground mb-4">Device not found</p>
          <Button onClick={() => navigate("/scada-management")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Management
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const typeInfo = typeConfig[displayDevice.type];
  const statusInfo = statusConfig[displayDevice.status];
  const TypeIcon = typeInfo.icon;
  const StatusIcon = statusInfo.icon;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl ${typeInfo.bgColor} flex items-center justify-center`}>
              <TypeIcon className={`w-8 h-8 ${typeInfo.color}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{displayDevice.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-muted-foreground font-mono">{displayDevice.id}</span>
                <Badge className={`${statusInfo.bgColor} ${statusInfo.color}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusInfo.label}
                </Badge>
                <Badge className={typeInfo.bgColor + " " + typeInfo.color}>
                  {typeInfo.label}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                Last sync: {new Date(displayDevice.lastSync).toLocaleTimeString()}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setRefreshing(true)}
              className={refreshing ? "animate-spin" : ""}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{displayDevice.currentPower.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Power (kW)</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4 text-center">
            <Sun className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">{liveParams.dcVoltage.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">DC Voltage (V)</p>
          </CardContent>
        </Card>
        <Card className="bg-info/5 border-info/20">
          <CardContent className="p-4 text-center">
            <Droplets className="w-6 h-6 text-info mx-auto mb-2" />
            <p className="text-2xl font-bold">{liveParams.flowRate}</p>
            <p className="text-xs text-muted-foreground">Flow (LPM)</p>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4 text-center">
            <Battery className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold">{displayDevice.todayEnergy.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Today (kWh)</p>
          </CardContent>
        </Card>
        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="p-4 text-center">
            <Thermometer className="w-6 h-6 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold">{liveParams.temperature.toFixed(1)}°</p>
            <p className="text-xs text-muted-foreground">Temperature</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Gauge className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-2xl font-bold">{liveParams.efficiency.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Efficiency</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="parameters" className="space-y-6">
        <TabsList>
          <TabsTrigger value="parameters">Live Parameters</TabsTrigger>
          <TabsTrigger value="charts">Performance Charts</TabsTrigger>
          <TabsTrigger value="info">Device Info</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* DC Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sun className="w-4 h-4 text-accent" />
                  DC Input (Solar Array)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">DC Voltage</span>
                  <span className="font-mono">{liveParams.dcVoltage.toFixed(1)} V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">DC Current</span>
                  <span className="font-mono">{liveParams.dcCurrent.toFixed(2)} A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">DC Power</span>
                  <span className="font-mono">
                    {((liveParams.dcVoltage * liveParams.dcCurrent) / 1000).toFixed(2)} kW
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* AC Output */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  AC Output
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">AC Voltage</span>
                  <span className="font-mono">{liveParams.acVoltage.toFixed(1)} V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">AC Current</span>
                  <span className="font-mono">{liveParams.acCurrent.toFixed(2)} A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Frequency</span>
                  <span className="font-mono">{liveParams.frequency.toFixed(2)} Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Power Factor</span>
                  <span className="font-mono">{liveParams.powerFactor.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Water Discharge (for Solar Pumps) */}
            {displayDevice.type === "solar_pump" && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-info" />
                    Water Discharge
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Flow Rate</span>
                    <span className="font-mono">{liveParams.flowRate} LPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily Discharge</span>
                    <span className="font-mono">
                      {(liveParams.dailyWater / 1000).toFixed(1)} KL
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Energy Generation */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-success" />
                  Energy Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Today's Generation</span>
                  <span className="font-mono">{displayDevice.todayEnergy.toFixed(2)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Generation</span>
                  <span className="font-mono">{(displayDevice.totalEnergy / 1000).toFixed(2)} MWh</span>
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Today's Run Hours</span>
                  <span className="font-mono">{liveParams.runHours.toFixed(1)} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Run Hours</span>
                  <span className="font-mono">{liveParams.totalRunHours.toFixed(0)} hrs</span>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-warning" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Inverter Temp</span>
                  <span className="font-mono">{liveParams.temperature.toFixed(1)} °C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Efficiency</span>
                  <span className="font-mono">{liveParams.efficiency.toFixed(1)} %</span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Capacity Utilization</span>
                  <Progress
                    value={(displayDevice.currentPower / displayDevice.capacity) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Power Generation (Today)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="power"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary) / 0.2)"
                        name="Power (kW)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Solar Irradiance (Today)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="irradiance"
                        stroke="hsl(var(--accent))"
                        strokeWidth={2}
                        name="Irradiance (W/m²)"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Address</span>
                  <span>{displayDevice.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">District</span>
                  <span>{displayDevice.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Coordinates</span>
                  <span className="font-mono text-sm">
                    {displayDevice.latitude.toFixed(4)}, {displayDevice.longitude.toFixed(4)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Beneficiary Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span>{displayDevice.beneficiaryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Contact</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {displayDevice.beneficiaryContact}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Device Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">IMEI</span>
                  <span className="font-mono text-sm">{isFromMap ? "N/A" : displayDevice.imei}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Capacity</span>
                  <span>{displayDevice.capacity} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Installation Date</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {isFromMap ? "N/A" : new Date(displayDevice.installationDate).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ScadaDetail;
