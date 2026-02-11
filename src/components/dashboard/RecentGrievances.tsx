import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGrievance, Ticket } from "@/context/GrievanceContext";
import { useAuth } from "@/context/AuthContext";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/30",
  open: "bg-warning/10 text-warning border-warning/30",
  in_progress: "bg-info/10 text-info border-info/30",
  "in progress": "bg-info/10 text-info border-info/30",
  escalated: "bg-destructive/10 text-destructive border-destructive/30",
  resolved: "bg-success/10 text-success border-success/30",
  closed: "bg-muted text-muted-foreground border-border",
};

const escalationColors: Record<number, string> = {
  0: "bg-muted text-muted-foreground",
  1: "bg-warning/10 text-warning",
  2: "bg-destructive/10 text-destructive",
};

// Helper to check if a status is pending/open
const isPendingStatus = (status: string): boolean => {
  const normalized = status?.toLowerCase();
  return normalized === "pending" || normalized === "open";
};

// Helper to get display-friendly status name
const getDisplayStatus = (status: string): string => {
  const normalized = status?.toLowerCase();
  if (normalized === "in_progress" || normalized === "in progress") {
    return "In Progress";
  }
  return status || "Open";
};

export function RecentGrievances() {
  const { t } = useLanguage();
  const { tickets, refreshTickets } = useGrievance();
  const { user } = useAuth();
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    refreshTickets();
  }, []);

  useEffect(() => {
    // Get recent tickets - all tickets for admin, user tickets for regular users
    let filteredTickets = tickets;
    if (user && user.role !== "admin") {
      filteredTickets = tickets.filter((t) => t.farmer_id === user.id);
    }
    // Sort by created_date descending and take first 5
    const sorted = [...filteredTickets].sort(
      (a, b) => new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime()
    );
    setRecentTickets(sorted.slice(0, 5));
  }, [tickets, user]);

  const getTimeAgo = (created_date: string) => {
    const now = new Date();
    const created = new Date(created_date);
    const diffMs = now.getTime() - created.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return created.toLocaleDateString();
  };

  const getEscalationBadge = (level: number) => {
    const labels = ["L0", "L1", "L2"];
    return <Badge className={escalationColors[level] || escalationColors[0]}>{labels[level] || labels[0]}</Badge>;
  };

  const pendingCount = recentTickets.filter((g) => isPendingStatus(g.current_status)).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            {t("recentGrievances")}
          </CardTitle>
          <Badge variant="outline" className="bg-secondary">
            {pendingCount} Open
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTickets.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">{t("noTicketsFound")}</p>
        ) : (
          recentTickets.map((grievance) => (
            <div
              key={grievance.grievance_id}
              className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">
                    {grievance.grievance_id}
                  </span>
                  {getEscalationBadge(grievance.escalation_level)}
                </div>
                <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                  {grievance.category.slice(0, 50)}...
                </h4>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {grievance.pump_id}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTimeAgo(grievance.created_date)}
                  </span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={statusColors[grievance.current_status?.toLowerCase()] || statusColors.pending}
              >
                {getDisplayStatus(grievance.current_status)}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
