import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useGrievance } from "@/context/GrievanceContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Zap,
  Building2,
  Lightbulb,
  Ticket,
  Activity,
  Clock,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { getTicketsByUser } = useGrievance();
  const navigate = useNavigate();

  const devices = user?.devices || [];
  const tickets = user ? getTicketsByUser(user.id) : [];

  const deviceStats = {
    solar_pump: devices.filter((d) => d.type === "solar_pump").length,
    mini_grid: devices.filter((d) => d.type === "mini_grid").length,
    rooftop_solar: devices.filter((d) => d.type === "rooftop_solar").length,
    high_mast: devices.filter((d) => d.type === "high_mast").length,
  };

  const ticketStats = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === "pending").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
  };

  const totalPower = devices.reduce((sum, d) => sum + d.currentPower, 0);
  const totalEnergy = devices.reduce((sum, d) => sum + d.todayEnergy, 0);

  const deviceTypes = [
    { type: "solar_pump", icon: Sun, label: t("solarPump"), count: deviceStats.solar_pump, color: "text-primary" },
    { type: "mini_grid", icon: Zap, label: t("miniGrid"), count: deviceStats.mini_grid, color: "text-accent" },
    { type: "rooftop_solar", icon: Building2, label: t("rooftopSolar"), count: deviceStats.rooftop_solar, color: "text-info" },
    { type: "high_mast", icon: Lightbulb, label: t("highMast"), count: deviceStats.high_mast, color: "text-warning" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {language === "hi" ? `नमस्ते, ${user?.name}!` : `Welcome, ${user?.name}!`}
        </h1>
        <p className="text-muted-foreground mt-1">{t("dashboard")}</p>
      </div>

      {/* Device Types Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {deviceTypes.map((item) => (
          <Card key={item.type} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/user/devices")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Power</p>
                <p className="text-3xl font-bold text-primary">{totalPower.toFixed(1)} kW</p>
              </div>
              <Activity className="w-10 h-10 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("energyGeneratedToday")}</p>
                <p className="text-3xl font-bold text-accent">{totalEnergy.toFixed(1)} kWh</p>
              </div>
              <TrendingUp className="w-10 h-10 text-accent/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("openGrievances")}</p>
                <p className="text-3xl font-bold text-warning">{ticketStats.pending + ticketStats.inProgress}</p>
              </div>
              <Ticket className="w-10 h-10 text-warning/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{language === "hi" ? "त्वरित कार्रवाई" : "Quick Actions"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => navigate("/user/devices")}
            >
              <span className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                {t("deviceDashboard")}
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => navigate("/user/grievances")}
            >
              <span className="flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                {t("myTickets")}
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              className="w-full justify-between"
              onClick={() => navigate("/user/grievances?action=create")}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t("createTicket")}
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {language === "hi" ? "हाल की टिकट" : "Recent Tickets"}
              <Button variant="ghost" size="sm" onClick={() => navigate("/user/grievances")}>
                {language === "hi" ? "सभी देखें" : "View All"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Ticket className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>{t("noTicketsFound")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.slice(0, 3).map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm truncate">{ticket.issueDescription.slice(0, 50)}...</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {ticket.createdAt.split("T")[0]}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          ticket.status === "pending"
                            ? "bg-warning/10 text-warning border-warning/30"
                            : ticket.status === "in_progress"
                            ? "bg-info/10 text-info border-info/30"
                            : ticket.status === "resolved"
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-muted"
                        }
                      >
                        {t(ticket.status === "in_progress" ? "inProgress" : ticket.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
