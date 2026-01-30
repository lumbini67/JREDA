import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Building2,
  Shield,
  UserPlus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  MapPin,
  Key,
  Eye,
  Settings,
} from "lucide-react";

const organizations = [
  { id: 1, name: "JREDA", type: "State Implementing Agency", users: 45, status: "active" },
  { id: 2, name: "BSPHCL", type: "State PSU (DISCOM)", users: 28, status: "active" },
  { id: 3, name: "Solar Tech Solutions", type: "Empanelled Agency", users: 15, status: "active" },
  { id: 4, name: "Green Energy Systems", type: "Empanelled Agency", users: 12, status: "active" },
  { id: 5, name: "MNRE", type: "National Agency", users: 8, status: "active" },
];

const users = [
  {
    id: 1,
    name: "Dr. Suresh Kumar",
    email: "suresh.kumar@jreda.gov.in",
    role: "Admin",
    organization: "JREDA",
    district: "All Districts",
    status: "active",
    lastLogin: "2024-12-30T10:30:00",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya.sharma@jreda.gov.in",
    role: "State Officer",
    organization: "JREDA",
    district: "Ranchi",
    status: "active",
    lastLogin: "2024-12-30T09:15:00",
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit.patel@bsphcl.gov.in",
    role: "DISCOM Officer",
    organization: "BSPHCL",
    district: "Hazaribagh",
    status: "active",
    lastLogin: "2024-12-29T16:45:00",
  },
  {
    id: 4,
    name: "Rahul Singh",
    email: "rahul@solartech.com",
    role: "Agency Manager",
    organization: "Solar Tech Solutions",
    district: "Dhanbad, Bokaro",
    status: "active",
    lastLogin: "2024-12-30T11:20:00",
  },
  {
    id: 5,
    name: "Meena Devi",
    email: "meena@greenenergy.com",
    role: "Field Technician",
    organization: "Green Energy Systems",
    district: "Giridih",
    status: "inactive",
    lastLogin: "2024-12-25T08:30:00",
  },
];

const roles = [
  {
    name: "Admin",
    permissions: ["Full System Access", "User Management", "Configuration", "Reports"],
    users: 5,
    level: "critical",
  },
  {
    name: "State Officer",
    permissions: ["View All Data", "Approve Applications", "Generate Reports", "Manage Grievances"],
    users: 15,
    level: "high",
  },
  {
    name: "DISCOM Officer",
    permissions: ["View District Data", "Meter Data Access", "Billing Integration"],
    users: 28,
    level: "medium",
  },
  {
    name: "Agency Manager",
    permissions: ["View Agency Data", "Submit Reports", "Manage Technicians"],
    users: 12,
    level: "medium",
  },
  {
    name: "Field Technician",
    permissions: ["Mobile App Access", "Survey Submission", "Photo Upload"],
    users: 45,
    level: "standard",
  },
  {
    name: "Consumer (Farmer)",
    permissions: ["View Own Pump Data", "Submit Grievances", "Push Notifications"],
    users: 4580,
    level: "standard",
  },
];

const accessLevelColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  high: "bg-warning/10 text-warning border-warning/30",
  medium: "bg-info/10 text-info border-info/30",
  standard: "bg-muted text-muted-foreground",
};

const UserManagement = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("userRoleManagement")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("hierarchicalAccess")}
            </p>
          </div>
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            {t("addNewUser")}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{organizations.length}</p>
              <p className="text-sm text-muted-foreground">{t("organizations")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-muted-foreground">{t("systemUsersCount")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roles.length}</p>
              <p className="text-sm text-muted-foreground">{t("userRoles")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">4,580</p>
              <p className="text-sm text-muted-foreground">{t("registeredFarmers")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">{t("users")}</TabsTrigger>
          <TabsTrigger value="organizations">{t("organizations")}</TabsTrigger>
          <TabsTrigger value="roles">{t("rolesPermissions")}</TabsTrigger>
          <TabsTrigger value="access">{t("districtAccess")}</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Search & Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t("searchUsers")}
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t("filterByRole")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allRoles")}</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="officer">State Officer</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t("systemUsers")} ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("user")}</TableHead>
                    <TableHead>{t("role")}</TableHead>
                    <TableHead>{t("organization")}</TableHead>
                    <TableHead>{t("districtAccess")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("lastLogin")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.organization}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {user.district}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.status === "active"
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.lastLogin).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations.map((org) => (
              <Card key={org.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <Badge className="bg-success/10 text-success">{org.status}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{org.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{org.type}</p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{org.users} users</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("roleBasedAccess")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.name} className="p-4 rounded-xl bg-secondary/30 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold">{role.name}</h4>
                        <Badge variant="outline" className={accessLevelColors[role.level]}>
                          {role.level}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {role.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{role.users.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{t("usersCount")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("districtLevelAccess")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                {t("districtAccessDescription")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["ranchi", "hazaribagh", "dhanbad", "bokaro", "giridih", "deoghar", "jamshedpur", "dumka"].map((key) => (
                  <div key={key} className="p-4 rounded-xl border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{t(key)}</p>
                        <p className="text-xs text-muted-foreground">3 organizations, 12 users</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Key className="w-3 h-3 mr-1" />
                      {t("configure")}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default UserManagement;
