import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Layers, Sun, Zap, Battery, Wind, Filter } from "lucide-react";

const assetTypes = [
  { name: "Solar Pumps", count: 4580, color: "bg-primary" },
  { name: "Rooftop Solar", count: 2340, color: "bg-accent" },
  { name: "Mini Grids", count: 45, color: "bg-info" },
  { name: "Street Lights", count: 12500, color: "bg-warning" },
  { name: "Canal-Top Solar", count: 8, color: "bg-success" },
];

const districtMarkers = [
  { name: "Ranchi", x: 45, y: 50, pumps: 1250, status: "healthy" },
  { name: "Hazaribagh", x: 55, y: 35, pumps: 890, status: "healthy" },
  { name: "Dhanbad", x: 75, y: 45, pumps: 720, status: "warning" },
  { name: "Bokaro", x: 65, y: 55, pumps: 650, status: "healthy" },
  { name: "Giridih", x: 60, y: 25, pumps: 580, status: "healthy" },
  { name: "Deoghar", x: 80, y: 20, pumps: 490, status: "warning" },
  { name: "Jamshedpur", x: 70, y: 70, pumps: 380, status: "healthy" },
  { name: "Dumka", x: 85, y: 35, pumps: 320, status: "critical" },
];

const statusColors = {
  healthy: "bg-success",
  warning: "bg-warning",
  critical: "bg-destructive",
};

const GISMap = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">GIS Map View</h1>
        <p className="text-muted-foreground mt-1">
          Geographic visualization of renewable energy assets across Jharkhand
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] overflow-hidden">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Jharkhand State Map
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <Layers className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Layer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assets</SelectItem>
                      <SelectItem value="pumps">Solar Pumps</SelectItem>
                      <SelectItem value="rooftop">Rooftop Solar</SelectItem>
                      <SelectItem value="minigrids">Mini Grids</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-full relative">
              {/* Stylized Map */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-primary/5">
                {/* Grid Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                  <defs>
                    <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(152, 45%, 28%)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mapGrid)" />
                </svg>

                {/* State Outline (simplified) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                  <path
                    d="M 30 15 L 45 10 L 65 12 L 85 18 L 90 35 L 88 55 L 80 72 L 65 85 L 45 88 L 25 78 L 18 60 L 20 40 L 25 25 Z"
                    fill="hsl(152, 45%, 28%)"
                    fillOpacity="0.08"
                    stroke="hsl(152, 45%, 28%)"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />
                </svg>

                {/* District Markers */}
                {districtMarkers.map((district) => (
                  <div
                    key={district.name}
                    className="absolute group cursor-pointer"
                    style={{ left: `${district.x}%`, top: `${district.y}%` }}
                  >
                    {/* Pulse animation */}
                    <div className={`absolute -inset-4 rounded-full ${statusColors[district.status as keyof typeof statusColors]} animate-ping opacity-20`} />
                    
                    {/* Marker */}
                    <div className={`relative w-4 h-4 rounded-full ${statusColors[district.status as keyof typeof statusColors]} border-2 border-card shadow-lg transition-transform group-hover:scale-150`}>
                      <div className="absolute inset-0 rounded-full bg-current animate-pulse" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="bg-card border border-border rounded-lg shadow-lg p-3 whitespace-nowrap">
                        <p className="font-semibold text-sm">{district.name}</p>
                        <p className="text-xs text-muted-foreground">{district.pumps} solar pumps</p>
                        <Badge variant="outline" className={`mt-1 text-xs ${district.status === 'healthy' ? 'text-success' : district.status === 'warning' ? 'text-warning' : 'text-destructive'}`}>
                          {district.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg">
                  <h4 className="text-sm font-semibold mb-3">Status Legend</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span className="text-xs text-muted-foreground">Healthy (&gt;95% uptime)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning" />
                      <span className="text-xs text-muted-foreground">Warning (85-95%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <span className="text-xs text-muted-foreground">Critical (&lt;85%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Asset Types */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Asset Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assetTypes.map((asset) => (
                <div
                  key={asset.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${asset.color}`} />
                    <span className="text-sm font-medium">{asset.name}</span>
                  </div>
                  <Badge variant="secondary">{asset.count.toLocaleString()}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-accent" />
                  <span className="text-sm text-muted-foreground">Total Capacity</span>
                </div>
                <span className="font-semibold">856 MW</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-success" />
                  <span className="text-sm text-muted-foreground">Today's Gen.</span>
                </div>
                <span className="font-semibold">1.82 MWh</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-info" />
                  <span className="text-sm text-muted-foreground">Avg. Uptime</span>
                </div>
                <span className="font-semibold text-success">97.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">CO₂ Saved</span>
                </div>
                <span className="font-semibold">12,450 T</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GISMap;
