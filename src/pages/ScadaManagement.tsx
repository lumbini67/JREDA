import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Zap, Home, ArrowRight } from "lucide-react";

const managementTypes = [
  {
    id: "solar_pumps",
    title: "Solar Pumps",
    description: "Monitor and manage solar pump stations across Jharkhand with real-time performance data.",
    icon: Sun,
    color: "from-primary/20 to-primary/5",
    borderColor: "border-primary/30",
    iconColor: "text-primary",
    deviceCount: 1245,
    onlineCount: 1180,
    totalCapacity: "8.5 MW",
  },
  {
    id: "mini_grids",
    title: "Mini Grids",
    description: "Track mini grid installations providing power to remote villages and communities.",
    icon: Zap,
    color: "from-accent/20 to-accent/5",
    borderColor: "border-accent/30",
    iconColor: "text-accent",
    deviceCount: 45,
    onlineCount: 42,
    totalCapacity: "3.2 MW",
  },
  {
    id: "rooftop_solar",
    title: "Rooftop Solar",
    description: "View and manage rooftop solar installations on residential and commercial buildings.",
    icon: Home,
    color: "from-info/20 to-info/5",
    borderColor: "border-info/30",
    iconColor: "text-info",
    deviceCount: 890,
    onlineCount: 865,
    totalCapacity: "12.5 MW",
  },
];

const ScadaManagement = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">SCADA Management</h1>
        <p className="text-muted-foreground mt-1">
          Select a management type to view detailed map and device information
        </p>
      </div>

      {/* Management Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementTypes.map((type) => {
          const Icon = type.icon;
          const onlinePercentage = Math.round((type.onlineCount / type.deviceCount) * 100);

          return (
            <Card
              key={type.id}
              className={`cursor-pointer group relative overflow-hidden border-2 ${type.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              onClick={() => navigate(`/scada-map/${type.id}`)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-50`} />

              <CardContent className="relative p-6 space-y-4">
                {/* Icon and Title */}
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-xl bg-background/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${type.iconColor}`} />
                  </div>
                  <Badge variant="outline" className="bg-background/50">
                    {type.deviceCount} Devices
                  </Badge>
                </div>

                {/* Title and Description */}
                <div>
                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {type.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {type.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Online</p>
                    <p className="text-lg font-semibold text-success">{type.onlineCount}</p>
                    <p className="text-xs text-muted-foreground">{onlinePercentage}% uptime</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Capacity</p>
                    <p className="text-lg font-semibold">{type.totalCapacity}</p>
                  </div>
                </div>

                {/* View Map Button */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    View on Map
                  </span>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <ArrowRight className={`w-5 h-5 ${type.iconColor} group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default ScadaManagement;
