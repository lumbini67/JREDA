import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Thermometer, Droplets, Sun, Wind, Battery } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Metric {
  label: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: string;
}

export function LiveMetrics() {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: t("avgIrradiance"), value: 842, unit: "W/m²", icon: Sun, color: "text-accent" },
    { label: t("ambientTemp"), value: 28.5, unit: "°C", icon: Thermometer, color: "text-warning" },
    { label: t("waterFlow"), value: 156, unit: "L/min", icon: Droplets, color: "text-info" },
    { label: t("gridFreq"), value: 50.02, unit: "Hz", icon: Activity, color: "text-primary" },
    { label: t("windSpeed"), value: 12.4, unit: "km/h", icon: Wind, color: "text-muted-foreground" },
    { label: t("avgSoc"), value: 78, unit: "%", icon: Battery, color: "text-success" },
  ]);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: Number(
            (metric.value + (Math.random() - 0.5) * (metric.value * 0.02)).toFixed(
              metric.unit === "%" || metric.unit === "Hz" ? 2 : 1
            )
          ),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          {t("liveSystemMetrics")}
          <span className="ml-auto flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-normal text-muted-foreground">{t("realTime")}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                <span className="text-xs font-medium text-muted-foreground">
                  {metric.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tabular-nums transition-all duration-300 group-hover:text-primary">
                  {metric.value}
                </span>
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
