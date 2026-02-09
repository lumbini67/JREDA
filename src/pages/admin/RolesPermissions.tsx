import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  ShieldCheck,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
  Lock,
  Users,
  LayoutDashboard,
  Zap,
  FileText,
  Settings,
  MapPin,
  Ticket,
  Building2,
  Database,
  BarChart3,
  Smartphone,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Search as SearchIcon,
} from "lucide-react";

// Define all actual available pages/features in the system based on App.tsx routes
export const allPages = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, category: "General", roleBased: false },
  { id: "scada-monitoring", name: "SCADA Monitoring", icon: Zap, category: "Admin", roleBased: false },
  { id: "scada-detail", name: "SCADA Device Details", icon: Zap, category: "Admin", roleBased: false },
  { id: "scada-crud", name: "SCADA CRUD Operations", icon: Database, category: "Admin", roleBased: false },
  { id: "scada-management", name: "SCADA Management", icon: Settings, category: "Admin", roleBased: false },
  { id: "scada-map", name: "SCADA Map View", icon: MapPin, category: "Admin", roleBased: false },
  { id: "user-management", name: "User Management", icon: Users, category: "Admin", roleBased: false },
  { id: "roles-permissions", name: "Roles & Permissions", icon: Shield, category: "Admin", roleBased: false },
  { id: "reports", name: "Reports", icon: FileText, category: "Admin", roleBased: false },
  { id: "admin-grievances", name: "Admin Grievances", icon: Ticket, category: "Admin", roleBased: false },
  { id: "sheetdb-demo", name: "SheetDB Demo", icon: Database, category: "Admin", roleBased: false },
  { id: "user-dashboard", name: "User Dashboard", icon: LayoutDashboard, category: "User", roleBased: true },
  { id: "user-devices", name: "User Devices", icon: Zap, category: "User", roleBased: true },
  { id: "user-grievances", name: "User Grievances", icon: Ticket, category: "User", roleBased: true },
  { id: "manager-dashboard", name: "Manager Dashboard", icon: LayoutDashboard, category: "Manager", roleBased: true },
  { id: "manager-scada-monitoring", name: "Manager SCADA Monitoring", icon: Zap, category: "Manager", roleBased: true },
  { id: "manager-grievances", name: "Manager Grievances", icon: Ticket, category: "Manager", roleBased: true },
  { id: "manager-vendors", name: "Manager Vendors", icon: Truck, category: "Manager", roleBased: true },
  { id: "vendor-dashboard", name: "Vendor Dashboard", icon: LayoutDashboard, category: "Vendor", roleBased: true },
  { id: "vendor-applications", name: "Vendor Applications", icon: FileText, category: "Vendor", roleBased: true },
  { id: "vendor-payments", name: "Vendor Payments", icon: CreditCard, category: "Vendor", roleBased: true },
  { id: "settings", name: "Settings", icon: Settings, category: "General", roleBased: false },
  { id: "login", name: "Login", icon: Smartphone, category: "Public", roleBased: false },
];

// Category icons mapping
const categoryIcons: Record<string, typeof Shield> = {
  General: LayoutDashboard,
  Admin: Shield,
  User: Users,
  Manager: Building2,
  Vendor: Truck,
  Public: Smartphone,
};

// Default system roles
const defaultRoles = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full access to all administrative features",
    isSystem: true,
    permissions: allPages.filter(p => !p.roleBased && p.category !== "Public").map(p => p.id),
  },
  {
    id: "user",
    name: "End User",
    description: "View own devices, submit and track grievances",
    isSystem: true,
    permissions: allPages.filter(p => p.category === "User").map(p => p.id),
  },
  {
    id: "manager",
    name: "Manager",
    description: "Manage specific machine types and view assigned data",
    isSystem: true,
    permissions: [
      ...allPages.filter(p => p.category === "Manager").map(p => p.id),
      ...allPages.filter(p => p.category === "User" && (p.id === "user-grievances" || p.id === "settings")).map(p => p.id),
    ],
  },
  {
    id: "vendor",
    name: "Vendor",
    description: "Manage applications and view payments",
    isSystem: true,
    permissions: [
      ...allPages.filter(p => p.category === "Vendor").map(p => p.id),
      "settings",
    ],
  },
];

export default function RolesPermissions() {
  const { t } = useLanguage();
  const [roles, setRoles] = useState(defaultRoles);
  const [selectedRole, setSelectedRole] = useState(defaultRoles[0]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [showPermissionMatrix, setShowPermissionMatrix] = useState(true);
  const [searchPages, setSearchPages] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Toggle permission for selected role
  const togglePermission = (pageId: string) => {
    const updatedRoles = roles.map(role => {
      if (role.id === selectedRole.id) {
        const permissions = role.permissions.includes(pageId)
          ? role.permissions.filter(p => p !== pageId)
          : [...role.permissions, pageId];
        return { ...role, permissions };
      }
      return role;
    });
    setRoles(updatedRoles);
    setSelectedRole(updatedRoles.find(r => r.id === selectedRole.id) || selectedRole);
    setHasChanges(true);
  };

  // Set all permissions for a category
  const setCategoryPermissions = (category: string, enabled: boolean) => {
    const pageIds = allPages
      .filter(p => p.category === category)
      .map(p => p.id);

    const updatedRoles = roles.map(role => {
      if (role.id === selectedRole.id) {
        let permissions = [...role.permissions];
        pageIds.forEach(pageId => {
          if (enabled && !permissions.includes(pageId)) {
            permissions.push(pageId);
          } else if (!enabled) {
            permissions = permissions.filter(p => p !== pageId);
          }
        });
        return { ...role, permissions };
      }
      return role;
    });
    setRoles(updatedRoles);
    setSelectedRole(updatedRoles.find(r => r.id === selectedRole.id) || selectedRole);
    setHasChanges(true);
  };

  // Check if all permissions in a category are enabled
  const isCategoryFullyEnabled = (category: string) => {
    const pageIds = allPages
      .filter(p => p.category === category)
      .map(p => p.id);
    return pageIds.every(id => selectedRole.permissions.includes(id));
  };

  // Add new role
  const addNewRole = () => {
    if (!newRoleName.trim()) return;

    const newRole = {
      id: newRoleName.toLowerCase().replace(/\s+/g, "-"),
      name: newRoleName,
      description: newRoleDescription,
      isSystem: false,
      permissions: [],
    };

    const updatedRoles = [...roles, newRole];
    setRoles(updatedRoles);
    setSelectedRole(newRole);
    setNewRoleName("");
    setNewRoleDescription("");
    setIsAddDialogOpen(false);
    setHasChanges(true);
  };

  // Delete custom role
  const deleteRole = (roleId: string) => {
    const updatedRoles = roles.filter(r => r.id !== roleId);
    setRoles(updatedRoles);
    if (selectedRole.id === roleId) {
      setSelectedRole(updatedRoles[0]);
    }
    setHasChanges(true);
  };

  // Reset to default permissions
  const resetToDefault = () => {
    const defaultRole = defaultRoles.find(r => r.id === selectedRole.id);
    if (defaultRole) {
      const updatedRoles = roles.map(role =>
        role.id === selectedRole.id ? { ...role, permissions: [...defaultRole.permissions] } : role
      );
      setRoles(updatedRoles);
      setSelectedRole({ ...selectedRole, permissions: [...defaultRole.permissions] });
      setHasChanges(false);
    }
  };

  // Save changes
  const saveChanges = () => {
    // In a real app, this would send the updated roles to the server
    console.log("Saving roles:", roles);
    setHasChanges(false);
  };

  // Export permissions as JSON
  const exportPermissions = () => {
    const data = JSON.stringify(roles, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roles-permissions.json";
    a.click();
  };

  // Group pages by category
  const pagesByCategory = allPages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {} as Record<string, typeof allPages>);

  // Filter pages by search and category
  const filteredPagesByCategory = Object.entries(pagesByCategory).reduce((acc, [category, pages]) => {
    const filtered = pages.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchPages.toLowerCase());
      const matchesCategory = filterCategory === "all" || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof allPages>);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("rolesPermissions") || "Roles & Permissions"}</h1>
            <p className="text-muted-foreground mt-1">
              Manage access control and permissions for different user roles
            </p>
          </div>
          <div className="flex gap-2">
            {hasChanges && (
              <>
                <Button variant="outline" onClick={resetToDefault}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={saveChanges}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            )}
            <Button variant="outline" onClick={exportPermissions}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Role Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{roles.length}</p>
                  <p className="text-sm text-muted-foreground">Total Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {roles.filter(r => r.isSystem).length}
                  </p>
                  <p className="text-sm text-muted-foreground">System Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {roles.filter(r => !r.isSystem).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Custom Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Lock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{allPages.length}</p>
                  <p className="text-sm text-muted-foreground">Total Permissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="roles">
              <Shield className="w-4 h-4 mr-2" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <Lock className="w-4 h-4 mr-2" />
              Permission Matrix
            </TabsTrigger>
            <TabsTrigger value="audit">
              <FileText className="w-4 h-4 mr-2" />
              Audit Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Role List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Roles</CardTitle>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Role
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Role</DialogTitle>
                          <DialogDescription>
                            Add a new custom role with specific permissions
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="roleName">Role Name</Label>
                            <Input
                              id="roleName"
                              placeholder="e.g., Data Analyst"
                              value={newRoleName}
                              onChange={(e) => setNewRoleName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="roleDescription">Description</Label>
                            <Textarea
                              id="roleDescription"
                              placeholder="Describe the responsibilities of this role..."
                              value={newRoleDescription}
                              onChange={(e) => setNewRoleDescription(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addNewRole}>Create Role</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {roles.map((role) => (
                        <div
                          key={role.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedRole.id === role.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedRole(role)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {role.isSystem ? (
                                <ShieldCheck className="w-4 h-4 text-primary" />
                              ) : (
                                <Shield className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span className="font-medium">{role.name}</span>
                              {role.isSystem && (
                                <Badge variant="secondary" className="text-xs">
                                  System
                                </Badge>
                              )}
                            </div>
                            <Badge variant="outline">
                              {role.permissions.length} permissions
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {role.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Role Details & Permissions */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedRole.isSystem ? (
                        <ShieldCheck className="w-6 h-6 text-primary" />
                      ) : (
                        <Shield className="w-6 h-6 text-muted-foreground" />
                      )}
                      <div>
                        <CardTitle>{selectedRole.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {selectedRole.description}
                        </p>
                      </div>
                    </div>
                    {!selectedRole.isSystem && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteRole(selectedRole.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Role
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        Object.keys(pagesByCategory).forEach(category => {
                          setCategoryPermissions(category, true);
                        });
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        Object.keys(pagesByCategory).forEach(category => {
                          setCategoryPermissions(category, false);
                        });
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Deselect All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPermissionMatrix(!showPermissionMatrix)}
                    >
                      {showPermissionMatrix ? (
                        <EyeOff className="w-4 h-4 mr-2" />
                      ) : (
                        <Eye className="w-4 h-4 mr-2" />
                      )}
                      {showPermissionMatrix ? "Hide" : "Show"} Matrix
                    </Button>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Object.keys(pagesByCategory).map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search */}
                  <div className="relative mb-4">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search pages..."
                      className="pl-9"
                      value={searchPages}
                      onChange={(e) => setSearchPages(e.target.value)}
                    />
                  </div>

                  {/* Permission Matrix */}
                  {showPermissionMatrix ? (
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-6">
                        {Object.entries(filteredPagesByCategory).map(([category, pages]) => {
                          const CategoryIcon = categoryIcons[category] || Shield;
                          const isFullyEnabled = isCategoryFullyEnabled(category);

                          return (
                            <div key={category}>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-semibold">{category}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {pages.length} pages
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={isFullyEnabled}
                                    onCheckedChange={(checked) =>
                                      setCategoryPermissions(category, checked)
                                    }
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setCategoryPermissions(category, !isFullyEnabled)
                                    }
                                  >
                                    {isFullyEnabled ? "Disable All" : "Enable All"}
                                  </Button>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {pages.map((page) => {
                                  const isEnabled = selectedRole.permissions.includes(page.id);
                                  const PageIcon = page.icon;

                                  return (
                                    <div
                                      key={page.id}
                                      className={`flex items-center justify-between p-3 rounded-lg border ${
                                        isEnabled
                                          ? "border-primary bg-primary/5"
                                          : "border-border"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <PageIcon className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                          <span className="text-sm">{page.name}</span>
                                          {page.roleBased && (
                                            <Badge variant="secondary" className="ml-2 text-xs">
                                              Role-based
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <Switch
                                        checked={isEnabled}
                                        onCheckedChange={() => togglePermission(page.id)}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                              <Separator className="mt-4" />
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  ) : (
                    /* Compact View */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">Total Permissions</span>
                        <Badge variant="outline">
                          {selectedRole.permissions.length} / {allPages.length}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {allPages.map((page) => {
                          const isEnabled = selectedRole.permissions.includes(page.id);
                          const PageIcon = page.icon;

                          return (
                            <Badge
                              key={page.id}
                              variant={isEnabled ? "default" : "outline"}
                              className="flex items-center gap-1 px-3 py-1"
                            >
                              <PageIcon className="w-3 h-3" />
                              {page.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            {/* Permission Matrix Accordion View */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Permission Matrix</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Overview of all permissions across all roles (Accordion View)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Legend:</span>
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Allowed
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <XCircle className="w-3 h-3 text-red-500" />
                      Denied
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Category Accordions */}
                <Accordion type="multiple" className="w-full">
                  {Object.entries(pagesByCategory).map(([category, pages]) => {
                    const CategoryIcon = categoryIcons[category] || Shield;
                    
                    return (
                      <AccordionItem key={category} value={category}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <CategoryIcon className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-lg">{category}</span>
                            <Badge variant="secondary">{pages.length} pages</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {/* Permission Matrix for this Category */}
                          <div className="space-y-4 pt-4">
                            {/* Header Row - Role Names */}
                            <div className="grid grid-cols-1 gap-4">
                              <div className="grid grid-cols-6 gap-4 items-center pb-2 border-b">
                                <div className="font-medium">Page / Feature</div>
                                {roles.map(role => (
                                  <div key={role.id} className="text-center">
                                    <Badge 
                                      variant={role.id === 'admin' ? 'default' : 'outline'}
                                      className="w-full justify-center"
                                    >
                                      {role.name}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Permission Rows */}
                              {pages.map(page => {
                                const PageIcon = page.icon;
                                
                                return (
                                  <div 
                                    key={page.id} 
                                    className="grid grid-cols-6 gap-4 items-center py-3 border-b border-border/50 hover:bg-muted/50 rounded-lg px-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <PageIcon className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-sm">{page.name}</span>
                                    </div>
                                    {roles.map(role => {
                                      const hasPermission = role.permissions.includes(page.id);
                                      return (
                                        <div key={role.id} className="flex justify-center">
                                          {hasPermission ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                          ) : (
                                            <XCircle className="w-5 h-5 text-red-300" />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                            
                            {/* Category Summary */}
                            <div className="bg-muted/50 rounded-lg p-4 mt-4">
                              <h4 className="font-semibold mb-2">{category} Access Summary</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {roles.map(role => {
                                  const categoryPermissions = pages.filter(p => 
                                    role.permissions.includes(p.id)
                                  ).length;
                                  const totalPages = pages.length;
                                  const percentage = Math.round((categoryPermissions / totalPages) * 100);
                                  
                                  return (
                                    <div key={role.id} className="space-y-1">
                                      <div className="flex justify-between text-sm">
                                        <span>{role.name}</span>
                                        <span className="text-muted-foreground">
                                          {categoryPermissions}/{totalPages}
                                        </span>
                                      </div>
                                      <Progress value={percentage} className="h-2" />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            {/* Audit Log */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Permission Audit Log</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Track changes to roles and permissions
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Log
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Performed By</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Changes</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="whitespace-nowrap">
                        2024-12-30 10:45:23
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Permission Updated</Badge>
                      </TableCell>
                      <TableCell>Administrator</TableCell>
                      <TableCell>Manager</TableCell>
                      <TableCell>Added: Manager Vendors, Manager Grievances</TableCell>
                      <TableCell>
                        <Badge variant="default">Completed</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="whitespace-nowrap">
                        2024-12-29 14:30:18
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Role Created</Badge>
                      </TableCell>
                      <TableCell>Administrator</TableCell>
                      <TableCell>Data Analyst</TableCell>
                      <TableCell>New role created with 5 permissions</TableCell>
                      <TableCell>
                        <Badge variant="default">Completed</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="whitespace-nowrap">
                        2024-12-28 09:15:42
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Permission Updated</Badge>
                      </TableCell>
                      <TableCell>Administrator</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Removed: SCADA Management, User Management</TableCell>
                      <TableCell>
                        <Badge variant="default">Completed</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="whitespace-nowrap">
                        2024-12-27 16:22:35
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">Role Deleted</Badge>
                      </TableCell>
                      <TableCell>Administrator</TableCell>
                      <TableCell>Temp User</TableCell>
                      <TableCell>Role deleted after 30-day expiry</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Archived</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
