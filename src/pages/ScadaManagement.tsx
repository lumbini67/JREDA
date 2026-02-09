import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sun, Zap, Home, Thermometer, Lightbulb, ArrowRight, Building, Map, Factory, Trees, Waves, Search } from "lucide-react";

const managementTypes = [
  {
    id: "solar_pumps",
    title: "Solar Pumps",
    description: "Monitor and manage solar pump stations across Jharkhand with real-time performance data.",
    icon: Sun,
    color: "from-primary/80 to-primary/60",
    borderColor: "border-primary/70",
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
    color: "from-accent/80 to-accent/60",
    borderColor: "border-accent/70",
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
    color: "from-info/80 to-info/60",
    borderColor: "border-info/70",
    iconColor: "text-info",
    deviceCount: 890,
    onlineCount: 865,
    totalCapacity: "12.5 MW",
  },
  {
    id: "solar_water_heater",
    title: "Solar Water Heater",
    description: "Manage solar water heating systems installed across residential and commercial establishments.",
    icon: Thermometer,
    color: "from-orange-500/80 to-orange-500/60",
    borderColor: "border-orange-500/70",
    iconColor: "text-orange-500",
    deviceCount: 320,
    onlineCount: 305,
    totalCapacity: "2.8 MW",
    avgTemp: "55°C",
  },
  {
    id: "solar_street_light",
    title: "Solar Street Light",
    description: "Monitor and control solar street lighting systems for urban and rural road networks.",
    icon: Lightbulb,
    color: "from-yellow-500/80 to-yellow-500/60",
    borderColor: "border-yellow-500/70",
    iconColor: "text-yellow-500",
    deviceCount: 4580,
    onlineCount: 4420,
    totalCapacity: "5.5 MW",
    operationalHours: "12-14 hrs/day",
  },
  {
    id: "solar_high_mast",
    title: "Solar High Mast",
    description: "Oversee high-mast solar lighting installations for major intersections and public spaces.",
    icon: Thermometer,
    color: "from-purple-500/80 to-purple-500/60",
    borderColor: "border-purple-500/70",
    iconColor: "text-purple-500",
    deviceCount: 185,
    onlineCount: 178,
    totalCapacity: "3.2 MW",
  },
  {
    id: "pm_kusum_ac",
    title: "PM-KUSUM Scheme (A & C)",
    description: "Manage solarization of grid-connected pumps and solar power plants under national scheme.",
    icon: Factory,
    color: "from-emerald-500/80 to-emerald-500/60",
    borderColor: "border-emerald-500/70",
    iconColor: "text-emerald-500",
    deviceCount: 320,
    onlineCount: 295,
    totalCapacity: "15.8 MW",
    beneficiaryFarmers: "2,450",
  },
  {
    id: "solar_off_grid",
    title: "Solar PV Off-Grid Systems",
    description: "Monitor state-funded off-grid solar PV systems for remote areas.",
    icon: Zap,
    color: "from-cyan-500/80 to-cyan-500/60",
    borderColor: "border-cyan-500/70",
    iconColor: "text-cyan-500",
    deviceCount: 580,
    onlineCount: 542,
    totalCapacity: "4.2 MW",
    villagesCovered: "320",
  },
  {
    id: "pm_janman",
    title: "PM JANMAN",
    description: "Track Central Govt. funded off-grid solar systems for tribal communities.",
    icon: Building,
    color: "from-amber-500/80 to-amber-500/60",
    borderColor: "border-amber-500/70",
    iconColor: "text-amber-500",
    deviceCount: 420,
    onlineCount: 398,
    totalCapacity: "3.5 MW",
    householdsServed: "8,500",
  },
  {
    id: "giridih_solar_city",
    title: "Giridih Solar City",
    description: "Manage solar installations under MNRE's Solar City Programme.",
    icon: Trees,
    color: "from-green-500/80 to-green-500/60",
    borderColor: "border-green-500/70",
    iconColor: "text-green-500",
    deviceCount: 125,
    onlineCount: 118,
    totalCapacity: "2.8 MW",
    cityArea: "2,100 sq.km",
  },
  {
    id: "canal_top_solar",
    title: "Canal-Top Solar Plants",
    description: "Oversee utility-scale canal-top solar installations and large solar projects.",
    icon: Waves,
    color: "from-blue-500/80 to-blue-500/60",
    borderColor: "border-blue-500/70",
    iconColor: "text-blue-500",
    deviceCount: 28,
    onlineCount: 26,
    totalCapacity: "22.5 MW",
    canalLength: "15.8 km",
  },
];

const ScadaManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTypes = managementTypes.filter(
    (type) =>
      type.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">SCADA Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Select a management type to view detailed map and device information
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search schemes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Management Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTypes.map((type) => {
          const Icon = type.icon;
          const onlinePercentage = Math.round((type.onlineCount / type.deviceCount) * 100);

          return (
            <Card
              key={type.id}
              className={`cursor-pointer group relative overflow-hidden border ${type.borderColor} hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
              onClick={() => navigate(`/scada-map/${type.id}`)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-30`} />

              <CardContent className="relative p-4 space-y-3">
                {/* Icon and Badge */}
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-lg bg-background/80 flex items-center justify-center shadow group-hover:scale-105 transition-transform duration-200`}>
                    <Icon className={`w-5 h-5 ${type.iconColor}`} />
                  </div>
                  <Badge variant="outline" className="text-xs bg-background/50">
                    {type.deviceCount}
                  </Badge>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {type.title}
                  </h2>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-background/50 rounded p-2">
                    <p className="text-xs text-muted-foreground">Online</p>
                    <p className="text-sm font-semibold text-success">{type.onlineCount}</p>
                  </div>
                  <div className="bg-background/50 rounded p-2">
                    <p className="text-xs text-muted-foreground">
                      {type.avgTemp || type.operationalHours || type.beneficiaryFarmers || type.villagesCovered || type.householdsServed || type.cityArea || type.canalLength || "Capacity"}
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {type.avgTemp || type.operationalHours || type.beneficiaryFarmers || type.villagesCovered || type.householdsServed || type.cityArea || type.canalLength || type.totalCapacity}
                    </p>
                  </div>
                </div>

                {/* View Map */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    View Map
                  </span>
                  <ArrowRight className={`w-4 h-4 ${type.iconColor} group-hover:translate-x-1 transition-transform`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTypes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No schemes found matching "{searchTerm}"
        </div>
      )}
    </DashboardLayout>
  );
};

export default ScadaManagement;
