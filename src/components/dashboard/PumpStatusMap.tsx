import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Zap, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const districts = [
  { name: "ranchi", pumps: 1250, online: 1180, lat: 23.35, lng: 85.33 },
  { name: "hazaribagh", pumps: 890, online: 845, lat: 23.99, lng: 85.36 },
  { name: "dhanbad", pumps: 720, online: 698, lat: 23.79, lng: 86.43 },
  { name: "bokaro", pumps: 650, online: 612, lat: 23.67, lng: 86.15 },
  { name: "giridih", pumps: 580, online: 542, lat: 24.19, lng: 86.30 },
  { name: "deoghar", pumps: 490, online: 478, lat: 24.49, lng: 86.70 },
];

export function PumpStatusMap() {
  const { t } = useLanguage();
  const totalPumps = districts.reduce((acc, d) => acc + d.pumps, 0);
  const totalOnline = districts.reduce((acc, d) => acc + d.online, 0);
  const uptimePercentage = ((totalOnline / totalPumps) * 100).toFixed(1);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {t("districtWiseStatus")}
          </CardTitle>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20">
            <Zap className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">{uptimePercentage}% {t("uptime")}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stylized Map Visualization */}
        <div className="relative h-48 mb-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            {/* Grid pattern */}
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(152, 45%, 28%)" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Animated dots representing districts */}
          {districts.map((district, index) => (
            <div
              key={district.name}
              className="absolute flex items-center justify-center"
              style={{
                left: `${15 + (index % 3) * 30}%`,
                top: `${20 + Math.floor(index / 3) * 45}%`,
              }}
            >
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary animate-ping opacity-30" />
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap text-foreground/70">
                  {t(district.name)}
                </span>
              </div>
            </div>
          ))}
          
          {/* Jharkhand outline placeholder */}
          <div className="absolute inset-4 border-2 border-dashed border-primary/20 rounded-xl" />
        </div>

        {/* District List */}
        <div className="space-y-3">
          {districts.map((district) => {
            const offlineCount = district.pumps - district.online;
            const percentage = (district.online / district.pumps) * 100;
            
            return (
              <div key={district.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="font-medium">{t(district.name)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-success font-medium">{district.online} {t("online")}</span>
                  {offlineCount > 0 && (
                    <span className="flex items-center gap-1 text-warning">
                      <AlertTriangle className="w-3 h-3" />
                      {offlineCount}
                    </span>
                  )}
                  <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
