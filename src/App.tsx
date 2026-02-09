import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScadaProvider } from "@/context/ScadaContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { GrievanceProvider } from "@/context/GrievanceContext";
import { Chatbot } from "@/components/Chatbot";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import ScadaMonitoring from "./pages/ScadaMonitoring";
import ScadaDetail from "./pages/ScadaDetail";
import ScadaCrud from "./pages/ScadaCrud";
import ScadaMap from "./pages/ScadaMap";
import ScadaManagement from "./pages/ScadaManagement";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import UserDevices from "./pages/user/UserDevices";
import UserGrievances from "./pages/user/UserGrievances";

// Admin Pages
import AdminGrievances from "./pages/admin/AdminGrievances";
import RolesPermissions from "./pages/admin/RolesPermissions";
import SheetDBDemo from "./pages/SheetDBDemo";

// Manager Pages
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerScadaMonitoring from "./pages/manager/ManagerScadaMonitoring";
import ManagerGrievances from "./pages/manager/ManagerGrievances";
import ManagerVendors from "./pages/manager/ManagerVendors";

// Vendor Pages
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorApplications from "./pages/vendor/VendorApplications";
import VendorPayments from "./pages/vendor/VendorPayments";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false, managerOnly = false, vendorOnly = false }: { children: React.ReactNode; adminOnly?: boolean; managerOnly?: boolean; vendorOnly?: boolean }) {
  const { isAuthenticated, isAdmin, isManager, isVendor } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (managerOnly && !isManager) {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (vendorOnly && !isVendor) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <>{children}</>;
}

// Route Redirector based on role
function HomeRedirect() {
  const { isAuthenticated, isAdmin, isManager, isVendor } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Index />;
  }

  if (isManager) {
    return <Navigate to="/manager/dashboard" replace />;
  }

  if (isVendor) {
    return <Navigate to="/vendor/dashboard" replace />;
  }

  return <Navigate to="/user/dashboard" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />

        {/* Home Route - Redirects based on role */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Admin Routes */}
        <Route
          path="/scada-monitoring"
          element={
            <ProtectedRoute adminOnly>
              <ScadaMonitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scada-monitoring/:id"
          element={
            <ProtectedRoute adminOnly>
              <ScadaDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scada-crud"
          element={
            <ProtectedRoute adminOnly>
              <ScadaCrud />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scada-management"
          element={
            <ProtectedRoute adminOnly>
              <ScadaManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scada-map/:typeId"
          element={
            <ProtectedRoute adminOnly>
              <ScadaMap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute adminOnly>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles-permissions"
          element={
            <ProtectedRoute adminOnly>
              <RolesPermissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute adminOnly>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/grievances"
          element={
            <ProtectedRoute adminOnly>
              <AdminGrievances />
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/devices"
          element={
            <ProtectedRoute>
              <UserDevices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/grievances"
          element={
            <ProtectedRoute>
              <UserGrievances />
            </ProtectedRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute managerOnly>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/scada-monitoring"
          element={
            <ProtectedRoute managerOnly>
              <ManagerScadaMonitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/grievances"
          element={
            <ProtectedRoute managerOnly>
              <ManagerGrievances />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/vendors"
          element={
            <ProtectedRoute managerOnly>
              <ManagerVendors />
            </ProtectedRoute>
          }
        />

        {/* Vendor Routes */}
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute vendorOnly>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/applications"
          element={
            <ProtectedRoute vendorOnly>
              <VendorApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/payments"
          element={
            <ProtectedRoute vendorOnly>
              <VendorPayments />
            </ProtectedRoute>
          }
        />

        {/* SheetDB Demo Route */}
        <Route
          path="/sheetdb-demo"
          element={
            <ProtectedRoute adminOnly>
              <SheetDBDemo />
            </ProtectedRoute>
          }
        />

        {/* Common Routes */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Chatbot - Show only when authenticated */}
      {isAuthenticated && <Chatbot />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <GrievanceProvider>
            <ScadaProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </ScadaProvider>
          </GrievanceProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
