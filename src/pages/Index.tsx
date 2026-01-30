import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { RecentGrievances } from "@/components/dashboard/RecentGrievances";
import { PumpStatusMap } from "@/components/dashboard/PumpStatusMap";
import { LiveMetrics } from "@/components/dashboard/LiveMetrics";
import { Sun, Zap, Users, AlertTriangle, TrendingUp, Clock } from "lucide-react";

const Index = () => {
  const { t } = useLanguage();
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t("dashboard")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("pmKusum")}
            </p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card border border-border shadow-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}  
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="animate-slide-in animate-slide-in-delay-1">
          <StatCard
            title={t("totalSolarPumps")}
            value="4,580"
            change={`+124 ${t("thisMonth")}`}
            changeType="positive"
            icon={Sun}
            variant="primary"
          />
        </div>
        <div className="animate-slide-in animate-slide-in-delay-2">
          <StatCard
            title={t("energyGeneratedToday")}
            value="1.82 MW"
            change={`+12% ${t("vsYesterday")}`}
            changeType="positive"
            icon={Zap}
            variant="accent"
          />
        </div>
        <div className="animate-slide-in animate-slide-in-delay-3">
          <StatCard
            title={t("activeBeneficiaries")}
            value="4,355"
            change={`95% ${t("ofInstalled")}`}
            changeType="neutral"
            icon={Users}
            variant="success"
          />
        </div>
        <div className="animate-slide-in animate-slide-in-delay-4">
          <StatCard
            title={t("openGrievances")}
            value="47"
            change={`-8 ${t("fromLastWeek")}`}
            changeType="positive"
            icon={AlertTriangle}
            variant="warning"
          />
        </div>
      </div>

      {/* Charts & Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <EnergyChart />
        <PumpStatusMap />
      </div>

      {/* Live Metrics & Grievances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveMetrics />
        <RecentGrievances />
      </div>
    </DashboardLayout>
  );
};

export default Index;
