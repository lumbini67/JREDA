import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

const data = [
  { month: "Jan", generation: 245, target: 220 },
  { month: "Feb", generation: 289, target: 250 },
  { month: "Mar", generation: 312, target: 280 },
  { month: "Apr", generation: 378, target: 320 },
  { month: "May", generation: 425, target: 380 },
  { month: "Jun", generation: 398, target: 400 },
  { month: "Jul", generation: 356, target: 380 },
  { month: "Aug", generation: 389, target: 390 },
  { month: "Sep", generation: 412, target: 400 },
  { month: "Oct", generation: 445, target: 420 },
  { month: "Nov", generation: 398, target: 400 },
  { month: "Dec", generation: 456, target: 440 },
];

export function EnergyChart() {
  const { t } = useLanguage();
  return (
    <Card className="col-span-2 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{t("energyGeneration")} ({t("mwh")})</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">{t("actual")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-muted-foreground">{t("target")}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGeneration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(152, 45%, 28%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(152, 45%, 28%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 20%, 88%)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(160, 15%, 45%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(160, 15%, 45%)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(150, 20%, 88%)",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px hsl(160 30% 12% / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="hsl(38, 92%, 50%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTarget)"
            />
            <Area
              type="monotone"
              dataKey="generation"
              stroke="hsl(152, 45%, 28%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGeneration)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
