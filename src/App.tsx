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
import SheetDBDemo from "./pages/SheetDBDemo";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <>{children}</>;
}

// Route Redirector based on role
function HomeRedirect() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Index />;
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
