import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, DollarSign, TrendingUp, Clock, CheckCircle, Package, Truck, Wrench, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Dummy data for vendor overview
  const applicationStats = {
    received: 156,
    verified: 89,
    ordered: 67,
    dispatched: 45,
    installed: 32,
  };

  const paymentStats = {
    totalReceived: 2450000,
    pending: 780000,
    thisMonth: 450000,
  };

  const recentActivities = [
    { id: 1, type: "dispatch", message: "Order #ORD-2024-156 dispatched to Ranchi", time: "2 hours ago" },
    { id: 2, type: "payment", message: "Payment of ₹1,50,000 received", time: "5 hours ago" },
    { id: 3, type: "installation", message: "Solar pump installed at Kanke Village", time: "1 day ago" },
    { id: 4, type: "order", message: "New order #ORD-2024-160 received", time: "1 day ago" },
    { id: 5, type: "verification", message: "15 applications verified by DNO", time: "2 days ago" },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vendor Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-accent/10 text-accent border-accent/30">
              <ShoppingCart className="w-4 h-4 mr-1" />
              Authorized Vendor
            </Badge>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Applications Received
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{applicationStats.received}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12 this week
            </p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/vendor/applications")}>
              View Applications
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Payments Received
            </CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{(paymentStats.totalReceived / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground mt-1">
              ₹{(paymentStats.thisMonth / 1000).toFixed(0)}K this month
            </p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/vendor/payments")}>
              View Payments
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Installed Systems
            </CardTitle>
            <Wrench className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{applicationStats.installed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {applicationStats.dispatched - applicationStats.installed} in progress
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Application Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Application Received", count: applicationStats.received, icon: ShoppingCart, color: "bg-primary" },
                { label: "Verified by DNO", count: applicationStats.verified, icon: CheckCircle, color: "bg-info" },
                { label: "Order Placed", count: applicationStats.ordered, icon: Package, color: "bg-accent" },
                { label: "Dispatched", count: applicationStats.dispatched, icon: Truck, color: "bg-warning" },
                { label: "Installed", count: applicationStats.installed, icon: Wrench, color: "bg-success" },
              ].map((item, index) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center`}>
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${(item.count / applicationStats.received) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="mt-1">
                    {activity.type === "dispatch" && <Truck className="w-4 h-4 text-warning" />}
                    {activity.type === "payment" && <DollarSign className="w-4 h-4 text-success" />}
                    {activity.type === "installation" && <Wrench className="w-4 h-4 text-primary" />}
                    {activity.type === "order" && <ShoppingCart className="w-4 h-4 text-accent" />}
                    {activity.type === "verification" && <CheckCircle className="w-4 h-4 text-info" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;
