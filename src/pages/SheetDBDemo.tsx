import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SheetDBManager } from "@/components/SheetDBManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Database, RefreshCw } from "lucide-react";

const SheetDBDemo = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">SheetDB API Integration</h1>
        <p className="text-muted-foreground mt-1">
          Manage tickets using Google Sheets as a database via SheetDB API
        </p>
      </div>

      {/* API Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            API Configuration
          </CardTitle>
          <CardDescription>
            SheetDB API endpoint for JREDA Ticket Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground mb-1">API Endpoint</p>
              <code className="text-xs break-all">https://sheetdb.io/api/v1/uj1y32yara8fx</code>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-success">API Connected</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Ready to sync data</p>
              </div>
              <a
                href="https://sheetdb.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                View SheetDB Docs
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-secondary/30">
              <h4 className="font-medium mb-2">GET Tickets</h4>
              <p className="text-sm text-muted-foreground">
                Fetch all tickets from the Google Sheet using GET requests
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <h4 className="font-medium mb-2">POST Tickets</h4>
              <p className="text-sm text-muted-foreground">
                Create new tickets directly to the Google Sheet
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <h4 className="font-medium mb-2">Update & Delete</h4>
              <p className="text-sm text-muted-foreground">
                Modify and remove tickets with PUT and DELETE operations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SheetDB Manager Component */}
      <SheetDBManager />
    </DashboardLayout>
  );
};

export default SheetDBDemo;
