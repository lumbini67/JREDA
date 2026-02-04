import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, MachineType } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, Zap, Home, Activity, Wifi, WifiOff, Clock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const typeConfig: Record<MachineType, { label: string; icon: typeof Sun; color: string; bgColor: string }> = {
  solar_pump: { label: "Solar Pump", icon: Sun, color: "text-primary", bgColor: "bg-primary/10" },
  mini_grid: { label: "Mini Grid", icon: Zap, color: "text-accent", bgColor: "bg-accent/10" },
  rooftop_solar: { label: "Rooftop Solar", icon: Home, color: "text-info", bgColor: "bg-info/10" },
};

const dummyDevices = [
  { id: "SP001", name: "Solar Pump - Kanke", district: "Ranchi", status: "online", currentPower: 3.2, capacity: 5, todayEnergy: 18.5 },
  { id: "SP002", name: "Solar Pump - Ratu", district: "Ranchi", status: "online", currentPower: 4.1, capacity: 5, todayEnergy: 22.3 },
  { id: "SP003", name: "Solar Pump - Ormanjhi", district: "Ranchi", status: "offline", currentPower: 0, capacity: 5, todayEnergy: 12.1 },
  { id: "SP004", name: "Solar Pump - Kanke Block", district: "Ranchi", status: "online", currentPower: 2.8, capacity: 3, todayEnergy: 15.2 },
  { id: "SP005", name: "Solar Pump - Ranchi Sadar", district: "Ranchi", status: "online", currentPower: 3.5, capacity: 5, todayEnergy: 19.8 },
];

const dummyGrievances = [
  { id: "T001", issue: "Pump not starting", status: "pending", priority: "high", createdAt: "2024-01-15" },
  { id: "T002", issue: "Low water output", status: "in_progress", priority: "medium", createdAt: "2024-01-14" },
  { id: "T003", issue: "Sensor malfunction", status: "resolved", priority: "low", createdAt: "2024-01-10" },
];

const ManagerDashboard = () => {
  const { user, machineType } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const typeInfo = machineType ? typeConfig[machineType] : typeConfig.solar_pump;
  const TypeIcon = typeInfo.icon;

  const onlineDevices = dummyDevices.filter(d => d.status === "online").length;
  const totalPower = dummyDevices.reduce((sum, d) => sum + d.currentPower, 0);
  const totalEnergy = dummyDevices.reduce((sum, d) => sum + d.todayEnergy, 0);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {typeInfo.label} Manager Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={typeInfo.bgColor + " " + typeInfo.color}>
              <TypeIcon className="w-4 h-4 mr-1" />
              {typeInfo.label} Manager
            </Badge>
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
                <p className="text-3xl font-bold">{dummyDevices.length}</p>
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
                <p className="text-3xl font-bold text-success">{onlineDevices}</p>
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
                <p className="text-3xl font-bold">{totalEnergy.toFixed(1)} kWh</p>
              </div>
              <TrendingUp className="w-10 h-10 text-info/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TypeIcon className="w-5 h-5 text-primary" />
              {typeInfo.label} Devices
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate("/manager/scada-monitoring")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dummyDevices.slice(0, 4).map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {device.status === "online" ? (
                      <Wifi className="w-4 h-4 text-success" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-destructive" />
                    )}
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-xs text-muted-foreground">{device.district}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{device.currentPower.toFixed(1)} / {device.capacity} kW</p>
                    <p className="text-xs text-muted-foreground">{device.todayEnergy} kWh today</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Grievances */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              Recent Grievances
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate("/manager/grievances")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dummyGrievances.map((grievance) => (
                <div key={grievance.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{grievance.issue}</p>
                    <p className="text-xs text-muted-foreground">{grievance.id} • {grievance.createdAt}</p>
                  </div>
                  <Badge variant={grievance.priority === "high" ? "destructive" : grievance.priority === "medium" ? "default" : "secondary"}>
                    {grievance.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
