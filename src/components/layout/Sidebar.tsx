import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  FileText,
  Database,
  Ticket,
  Sun,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { t } = useLanguage();

  // Admin menu items
  const adminMenuItems = [
    { icon: LayoutDashboard, label: t("dashboard"), path: "/" },
    { icon: Zap, label: t("scadaMonitoring"), path: "/scada-monitoring" },
    { icon: Database, label: t("scadaManagement"), path: "/scada-management" },
    { icon: Ticket, label: t("grievances"), path: "/admin/grievances" },
    { icon: Users, label: t("userManagement"), path: "/user-management" },
    { icon: FileText, label: t("reports"), path: "/reports" },
    { icon: Settings, label: t("settings"), path: "/settings" },
  ];

  // User menu items
  const userMenuItems = [
    { icon: LayoutDashboard, label: t("dashboard"), path: "/user/dashboard" },
    { icon: Sun, label: t("myDevices"), path: "/user/devices" },
    { icon: Ticket, label: t("myTickets"), path: "/user/grievances" },
    { icon: Settings, label: t("settings"), path: "/settings" },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
        <div className="relative">
          <img 
            src="/JREDA.jpeg" 
            alt="JREDA Logo" 
            className="w-10 h-10 rounded-xl object-contain bg-white"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-sidebar animate-pulse" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight">JREDA</span>
            <span className="text-xs text-sidebar-foreground/70">{t("solarEnergyPlatform")}</span>
          </div>
        )}
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-sidebar-foreground/70 capitalize">{user.role}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow-accent"
                  : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isActive && "scale-110",
                  !isActive && "group-hover:scale-110"
                )}
              />
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Agency Info */}
      {!collapsed && (
        <div className="p-4 mx-4 mb-4 rounded-xl bg-sidebar-accent/50 border border-sidebar-border">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-sidebar-primary" />
            <div>
              <p className="text-xs font-medium text-sidebar-foreground/70">{t("poweredBy")}</p>
              <p className="text-sm font-semibold">{t("govtOfJharkhand")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout & Collapse */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="w-5 h-5 mr-2" />
          {!collapsed && <span>{t("logout")}</span>}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span>{t(collapsed ? "expand" : "collapse")}</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
