import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, UserDevice } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Zap,
  Building2,
  Lightbulb,
  Power,
  MapPin,
  Activity,
  AlertTriangle,
} from "lucide-react";

const deviceTypeIcons: Record<UserDevice["type"], typeof Sun> = {
  solar_pump: Sun,
  mini_grid: Zap,
  rooftop_solar: Building2,
  high_mast: Lightbulb,
};

const deviceTypeLabels: Record<UserDevice["type"], { en: string; hi: string }> = {
  solar_pump: { en: "Solar Pump", hi: "सोलर पंप" },
  mini_grid: { en: "Mini Grid", hi: "मिनी ग्रिड" },
  rooftop_solar: { en: "Rooftop Solar", hi: "रूफटॉप सोलर" },
  high_mast: { en: "High Mast", hi: "हाई मास्ट" },
};

const UserDevices = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const devices = user?.devices || [];

  const devicesByType = {
    solar_pump: devices.filter((d) => d.type === "solar_pump"),
    mini_grid: devices.filter((d) => d.type === "mini_grid"),
    rooftop_solar: devices.filter((d) => d.type === "rooftop_solar"),
    high_mast: devices.filter((d) => d.type === "high_mast"),
  };

  const totalPower = devices.reduce((sum, d) => sum + d.currentPower, 0);
  const totalEnergy = devices.reduce((sum, d) => sum + d.todayEnergy, 0);
  const onlineCount = devices.filter((d) => d.status === "online").length;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{t("deviceDashboard")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("myDevices")} - {user?.name}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Power className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{devices.length}</p>
                <p className="text-xs text-muted-foreground">{t("devices")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{onlineCount}/{devices.length}</p>
                <p className="text-xs text-muted-foreground">{t("online")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPower.toFixed(1)} kW</p>
                <p className="text-xs text-muted-foreground">Current Power</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <Sun className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalEnergy.toFixed(1)} kWh</p>
                <p className="text-xs text-muted-foreground">{t("energyGeneratedToday")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Devices by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(Object.keys(devicesByType) as UserDevice["type"][]).map((type) => {
          const typeDevices = devicesByType[type];
          const Icon = deviceTypeIcons[type];
          
          if (typeDevices.length === 0) return null;

          return (
            <Card key={type}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  {deviceTypeLabels[type][language]}
                  <Badge variant="secondary" className="ml-auto">
                    {typeDevices.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {typeDevices.map((device) => (
                  <div
                    key={device.id}
                    className="p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{device.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {device.location}, {device.district}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          device.status === "online"
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-destructive/10 text-destructive border-destructive/30"
                        }
                      >
                        {t(device.status)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Current Power</p>
                        <p className="font-semibold">{device.currentPower} kW</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Today's Energy</p>
                        <p className="font-semibold">{device.todayEnergy} kWh</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/user/grievances?device=${device.id}`)}
                      >
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {t("createTicket")}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {devices.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Power className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No devices assigned to your account</p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default UserDevices;
