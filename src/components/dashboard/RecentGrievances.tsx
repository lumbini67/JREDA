import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGrievance, Ticket, TicketStatus } from "@/context/GrievanceContext";
import { useAuth } from "@/context/AuthContext";

const statusColors: Record<TicketStatus, string> = {
  pending: "bg-warning/10 text-warning border-warning/30",
  in_progress: "bg-info/10 text-info border-info/30",
  resolved: "bg-success/10 text-success border-success/30",
  closed: "bg-muted text-muted-foreground border-border",
};

const priorityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-muted text-muted-foreground",
  critical: "bg-destructive/10 text-destructive",
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
      filteredTickets = tickets.filter((t) => t.userId === user.id);
    }
    // Sort by createdAt descending and take first 5
    const sorted = [...filteredTickets].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setRecentTickets(sorted.slice(0, 5));
  }, [tickets, user]);

  const getTimeAgo = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return created.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            {t("recentGrievances")}
          </CardTitle>
          <Badge variant="outline" className="bg-secondary">
            {recentTickets.filter((g) => g.status === "pending").length} {t("pending")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTickets.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">{t("noTicketsFound")}</p>
        ) : (
          recentTickets.map((grievance) => (
            <div
              key={grievance.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">
                    {grievance.id}
                  </span>
                  <Badge className={priorityColors[grievance.priority] || "bg-muted text-muted-foreground"} variant="secondary">
                    {t(grievance.priority)}
                  </Badge>
                </div>
                <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                  {grievance.issueDescription.slice(0, 50)}...
                </h4>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {grievance.site}, {t(grievance.district.toLowerCase())}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTimeAgo(grievance.createdAt)}
                  </span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={statusColors[grievance.status]}
              >
                {t(grievance.status === "in_progress" ? "inProgress" : grievance.status)}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
