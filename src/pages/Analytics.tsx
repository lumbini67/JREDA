import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Zap,
  Sun,
  Droplets,
  AlertTriangle,
} from "lucide-react";

const monthlyData = [
  { month: "Jan", generation: 245, target: 220, efficiency: 92 },
  { month: "Feb", generation: 289, target: 250, efficiency: 94 },
  { month: "Mar", generation: 312, target: 280, efficiency: 91 },
  { month: "Apr", generation: 378, target: 320, efficiency: 95 },
  { month: "May", generation: 425, target: 380, efficiency: 93 },
  { month: "Jun", generation: 398, target: 400, efficiency: 89 },
  { month: "Jul", generation: 356, target: 380, efficiency: 87 },
  { month: "Aug", generation: 389, target: 390, efficiency: 90 },
  { month: "Sep", generation: 412, target: 400, efficiency: 94 },
  { month: "Oct", generation: 445, target: 420, efficiency: 96 },
  { month: "Nov", generation: 398, target: 400, efficiency: 92 },
  { month: "Dec", generation: 456, target: 440, efficiency: 95 },
];

const districtData = [
  { name: "Ranchi", value: 1250, generation: 456 },
  { name: "Hazaribagh", value: 890, generation: 342 },
  { name: "Dhanbad", value: 720, generation: 287 },
  { name: "Bokaro", value: 650, generation: 265 },
  { name: "Giridih", value: 580, generation: 234 },
  { name: "Deoghar", value: 490, generation: 198 },
];

const grievanceData = [
  { category: "Motor Issues", count: 45, resolved: 38 },
  { category: "Inverter", count: 32, resolved: 28 },
  { category: "Controller", count: 28, resolved: 25 },
  { category: "Panel", count: 18, resolved: 17 },
  { category: "Piping", count: 15, resolved: 12 },
  { category: "Other", count: 12, resolved: 10 },
];

const pumpStatusData = [
  { name: "Online", value: 4355, color: "hsl(142, 71%, 45%)" },
  { name: "Offline", value: 180, color: "hsl(0, 72%, 51%)" },
  { name: "Maintenance", value: 45, color: "hsl(38, 92%, 50%)" },
];

const COLORS = ["hsl(152, 45%, 28%)", "hsl(38, 92%, 50%)", "hsl(199, 89%, 48%)", "hsl(142, 71%, 45%)", "hsl(0, 72%, 51%)", "hsl(215, 20%, 65%)"];

const Analytics = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="month">
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Generation</p>
              <p className="text-2xl font-bold">4,503 MWh</p>
              <p className="text-xs text-success">+12% vs last year</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Sun className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Efficiency</p>
              <p className="text-2xl font-bold">92.3%</p>
              <p className="text-xs text-success">+2.1% improvement</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-info/5 border-info/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Water Delivered</p>
              <p className="text-2xl font-bold">2.8B L</p>
              <p className="text-xs text-muted-foreground">This year</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">System Uptime</p>
              <p className="text-2xl font-bold">97.2%</p>
              <p className="text-xs text-success">Exceeds target</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="energy" className="space-y-6">
        <TabsList>
          <TabsTrigger value="energy">Energy Generation</TabsTrigger>
          <TabsTrigger value="district">District Performance</TabsTrigger>
          <TabsTrigger value="grievances">Grievance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="energy" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Trend */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Monthly Generation vs Target
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 20%, 88%)" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(160, 15%, 45%)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(160, 15%, 45%)", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(150, 20%, 88%)",
                        borderRadius: "12px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="generation" name="Actual (MWh)" fill="hsl(152, 45%, 28%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" name="Target (MWh)" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pump Status Pie */}
            <Card>
              <CardHeader>
                <CardTitle>Pump Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pumpStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pumpStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {pumpStatusData.map((status) => (
                    <div key={status.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                        <span className="text-sm">{status.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{status.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Efficiency Trend */}
          <Card>
            <CardHeader>
              <CardTitle>System Efficiency Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 20%, 88%)" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(160, 15%, 45%)", fontSize: 12 }} />
                  <YAxis domain={[80, 100]} tick={{ fill: "hsl(160, 15%, 45%)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(150, 20%, 88%)",
                      borderRadius: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    name="Efficiency (%)"
                    stroke="hsl(152, 45%, 28%)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(152, 45%, 28%)", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="district" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>District-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={districtData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 20%, 88%)" />
                  <XAxis type="number" tick={{ fill: "hsl(160, 15%, 45%)", fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: "hsl(160, 15%, 45%)", fontSize: 12 }} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(150, 20%, 88%)",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Pumps Installed" fill="hsl(152, 45%, 28%)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="generation" name="Generation (MWh)" fill="hsl(38, 92%, 50%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grievances" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Grievances by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={grievanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 20%, 88%)" />
                    <XAxis dataKey="category" tick={{ fill: "hsl(160, 15%, 45%)", fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fill: "hsl(160, 15%, 45%)", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(150, 20%, 88%)",
                        borderRadius: "12px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="count" name="Total" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" name="Resolved" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolution Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Average Resolution Time</span>
                      <span className="font-semibold">4.2 hours</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div className="h-full w-3/4 bg-success rounded-full" />
                    </div>
                    <p className="text-xs text-success mt-1">26% faster than SLA target</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">First Contact Resolution</span>
                      <span className="font-semibold">68%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div className="h-full w-[68%] bg-primary rounded-full" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                      <span className="font-semibold">4.5 / 5.0</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div className="h-full w-[90%] bg-accent rounded-full" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">AI Auto-Resolution Rate</span>
                      <span className="font-semibold">32%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div className="h-full w-[32%] bg-info rounded-full" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Handled by AI chatbot without human intervention</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Analytics;
