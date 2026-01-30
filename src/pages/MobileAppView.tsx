import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Smartphone,
  Camera,
  MapPin,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Navigation,
  Upload,
  ClipboardCheck,
  Timer,
  Wifi,
  WifiOff,
  RefreshCw,
  Sun,
  Droplets,
} from "lucide-react";

const surveyorData = {
  name: "Rajesh Singh",
  id: "JREDA-SV-045",
  district: "Ranchi",
  totalSurveys: 156,
  pendingSurveys: 12,
  todaySurveys: 5,
  completionRate: 92,
};

const pendingSurveys = [
  {
    id: "SRV-2024-1234",
    beneficiary: "Ramesh Kumar",
    village: "Patratoli",
    block: "Kanke",
    type: "Installation Survey",
    priority: "high",
    dueDate: "2024-12-31",
    distance: "3.2 km",
  },
  {
    id: "SRV-2024-1235",
    beneficiary: "Sita Devi",
    village: "Hesatu",
    block: "Ratu",
    type: "Maintenance Check",
    priority: "medium",
    dueDate: "2025-01-02",
    distance: "8.5 km",
  },
  {
    id: "SRV-2024-1236",
    beneficiary: "Mohan Prasad",
    village: "Tupudana",
    block: "Namkum",
    type: "Grievance Visit",
    priority: "high",
    dueDate: "2024-12-30",
    distance: "5.1 km",
  },
];

const recentSurveys = [
  {
    id: "SRV-2024-1230",
    beneficiary: "Lakshmi Oraon",
    village: "Bariatu",
    type: "Installation Survey",
    status: "synced",
    completedAt: "2024-12-30T10:30:00",
    photos: 4,
    geoTagged: true,
  },
  {
    id: "SRV-2024-1229",
    beneficiary: "Birsa Munda",
    village: "Mandar",
    type: "Maintenance Check",
    status: "pending_sync",
    completedAt: "2024-12-30T09:15:00",
    photos: 3,
    geoTagged: true,
  },
];

const MobileAppView = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Smartphone className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mobile App View</h1>
            <p className="text-muted-foreground">
              Field Surveyor Mobile Application Preview (iOS & Android)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mobile Phone Frame */}
        <div className="lg:col-span-1 flex justify-center">
          <div className="w-[320px] h-[640px] bg-card border-8 border-foreground/20 rounded-[40px] overflow-hidden shadow-2xl relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground/20 rounded-b-2xl z-10" />
            
            {/* Screen Content */}
            <div className="h-full overflow-y-auto bg-background pt-8">
              {/* Status Bar */}
              <div className="flex items-center justify-between px-4 py-2 text-xs">
                <span>9:41</span>
                <div className="flex items-center gap-2">
                  <Wifi className="w-3 h-3" />
                  <div className="w-4 h-2 border border-current rounded-sm">
                    <div className="w-3/4 h-full bg-success rounded-sm" />
                  </div>
                </div>
              </div>

              {/* Header */}
              <div className="bg-primary text-primary-foreground px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{surveyorData.name}</p>
                    <p className="text-xs opacity-80">{surveyorData.id}</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-secondary/30">
                <div className="text-center p-2">
                  <p className="text-lg font-bold text-primary">{surveyorData.pendingSurveys}</p>
                  <p className="text-[10px] text-muted-foreground">Pending</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-lg font-bold text-success">{surveyorData.todaySurveys}</p>
                  <p className="text-[10px] text-muted-foreground">Today</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-lg font-bold text-accent">{surveyorData.completionRate}%</p>
                  <p className="text-[10px] text-muted-foreground">Rate</p>
                </div>
              </div>

              {/* Pending Survey */}
              <div className="p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-2">NEXT SURVEY</p>
                <div className="bg-card border border-border rounded-xl p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{pendingSurveys[0].beneficiary}</p>
                      <p className="text-xs text-muted-foreground">{pendingSurveys[0].village}, {pendingSurveys[0].block}</p>
                    </div>
                    <Badge className="bg-destructive/10 text-destructive text-[10px]">Urgent</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      {pendingSurveys[0].distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due: {new Date(pendingSurveys[0].dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <Button size="sm" className="w-full text-xs h-8">
                    <MapPin className="w-3 h-3 mr-1" />
                    Start Navigation
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 p-3">
                <Button variant="outline" size="sm" className="h-12 flex-col gap-1">
                  <Camera className="w-4 h-4" />
                  <span className="text-[10px]">Photo Survey</span>
                </Button>
                <Button variant="outline" size="sm" className="h-12 flex-col gap-1">
                  <ClipboardCheck className="w-4 h-4" />
                  <span className="text-[10px]">Checklist</span>
                </Button>
              </div>

              {/* Offline Indicator */}
              <div className="mx-3 p-2 rounded-lg bg-warning/10 border border-warning/20 flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-warning" />
                <span className="text-xs text-warning">2 surveys pending sync</span>
                <Button size="sm" variant="ghost" className="ml-auto h-6 text-xs">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Sync
                </Button>
              </div>

              {/* Recent Activity */}
              <div className="p-3 pb-6">
                <p className="text-xs font-semibold text-muted-foreground mb-2">RECENT SURVEYS</p>
                <div className="space-y-2">
                  {recentSurveys.slice(0, 2).map((survey) => (
                    <div key={survey.id} className="p-2 rounded-lg bg-secondary/30 flex items-center gap-2">
                      {survey.status === "synced" ? (
                        <CheckCircle className="w-4 h-4 text-success shrink-0" />
                      ) : (
                        <Timer className="w-4 h-4 text-warning shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{survey.beneficiary}</p>
                        <p className="text-[10px] text-muted-foreground">{survey.village}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Camera className="w-3 h-3" />
                        {survey.photos}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-foreground/30 rounded-full" />
          </div>
        </div>

        {/* Feature Details */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="features">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="features">Key Features</TabsTrigger>
              <TabsTrigger value="surveyor">Surveyor Tools</TabsTrigger>
              <TabsTrigger value="farmer">Farmer App</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mobile App Features (As per SOW)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-secondary/30 flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Geo-Tagged Surveys</p>
                        <p className="text-xs text-muted-foreground">Accurate lat-long mapping with geo-buffering for field verification</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/30 flex items-start gap-3">
                      <WifiOff className="w-5 h-5 text-info shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Offline Mode</p>
                        <p className="text-xs text-muted-foreground">Data capture in low-bandwidth areas with auto-sync when online</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/30 flex items-start gap-3">
                      <Camera className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Photo Documentation</p>
                        <p className="text-xs text-muted-foreground">Timestamped, geo-tagged photo capture for installation verification</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/30 flex items-start gap-3">
                      <User className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Aadhaar Verification</p>
                        <p className="text-xs text-muted-foreground">UIDAI compliant beneficiary authentication</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Real-Time Sync Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-success/5 border border-success/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <div>
                          <p className="font-medium text-sm">Web Portal Parity</p>
                          <p className="text-xs text-muted-foreground">All features available on mobile with unified design</p>
                        </div>
                      </div>
                      <Badge className="bg-success/10 text-success">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-info/5 border border-info/20">
                      <div className="flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-info" />
                        <div>
                          <p className="font-medium text-sm">Real-Time Data Sync</p>
                          <p className="text-xs text-muted-foreground">Automatic synchronization with central database</p>
                        </div>
                      </div>
                      <Badge className="bg-info/10 text-info">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="surveyor" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Surveyor Performance Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Completion Rate</span>
                          <span className="font-semibold">{surveyorData.completionRate}%</span>
                        </div>
                        <Progress value={surveyorData.completionRate} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Data Quality Score</span>
                          <span className="font-semibold">94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Timeliness</span>
                          <span className="font-semibold">88%</span>
                        </div>
                        <Progress value={88} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Location Accuracy</span>
                          <span className="font-semibold">97%</span>
                        </div>
                        <Progress value={97} className="h-2" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-secondary/30">
                        <p className="text-xs text-muted-foreground">Total Surveys Completed</p>
                        <p className="text-2xl font-bold">{surveyorData.totalSurveys}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-warning/5 border border-warning/20">
                        <p className="text-xs text-muted-foreground">Pending Surveys</p>
                        <p className="text-2xl font-bold text-warning">{surveyorData.pendingSurveys}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-success/5 border border-success/20">
                        <p className="text-xs text-muted-foreground">Today's Completed</p>
                        <p className="text-2xl font-bold text-success">{surveyorData.todaySurveys}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending Surveys List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingSurveys.map((survey) => (
                      <div key={survey.id} className="p-4 rounded-xl bg-secondary/30 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-muted-foreground">{survey.id}</span>
                            <Badge className={survey.priority === "high" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}>
                              {survey.priority}
                            </Badge>
                          </div>
                          <p className="font-medium">{survey.beneficiary}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span>{survey.village}, {survey.block}</span>
                            <span>•</span>
                            <span>{survey.type}</span>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">{survey.distance}</p>
                          <p className="text-xs text-muted-foreground mt-1">Due: {new Date(survey.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="farmer" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consumer/Farmer Mobile App</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    The farmer app provides beneficiaries with real-time access to their solar pump performance
                    and enables easy grievance submission.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <Sun className="w-8 h-8 text-primary mb-2" />
                      <h4 className="font-medium mb-1">Real-Time Monitoring</h4>
                      <p className="text-xs text-muted-foreground">View pump status, energy generation, and water discharge in real-time</p>
                    </div>
                    <div className="p-4 rounded-xl bg-info/5 border border-info/20">
                      <Droplets className="w-8 h-8 text-info mb-2" />
                      <h4 className="font-medium mb-1">Water Usage Tracking</h4>
                      <p className="text-xs text-muted-foreground">Daily and monthly water discharge reports with charts</p>
                    </div>
                    <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
                      <AlertTriangle className="w-8 h-8 text-warning mb-2" />
                      <h4 className="font-medium mb-1">Push Notifications</h4>
                      <p className="text-xs text-muted-foreground">Alerts for maintenance, low generation, and grievance updates</p>
                    </div>
                    <div className="p-4 rounded-xl bg-success/5 border border-success/20">
                      <ClipboardCheck className="w-8 h-8 text-success mb-2" />
                      <h4 className="font-medium mb-1">Grievance Submission</h4>
                      <p className="text-xs text-muted-foreground">Easy complaint registration with photo upload capability</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MobileAppView;
