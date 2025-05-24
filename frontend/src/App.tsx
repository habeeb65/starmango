import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { TenantProvider } from "@/context/TenantContext";
import Login from "@/pages/Login";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import DjangoIntegration from "@/pages/DjangoIntegration";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path="/inventory"
                    element={<div className="p-4">Inventory Page</div>}
                  />
                  <Route
                    path="/purchases"
                    element={<div className="p-4">Purchases Page</div>}
                  />
                  <Route
                    path="/sales"
                    element={<div className="p-4">Sales Page</div>}
                  />
                  <Route
                    path="/vendors"
                    element={<div className="p-4">Vendors Page</div>}
                  />
                  <Route
                    path="/customers"
                    element={<div className="p-4">Customers Page</div>}
                  />
                  <Route
                    path="/reports"
                    element={<div className="p-4">Reports Page</div>}
                  />
                  <Route
                    path="/analytics"
                    element={<div className="p-4">Analytics Page</div>}
                  />
                  <Route
                    path="/products"
                    element={<div className="p-4">Products Page</div>}
                  />
                  <Route
                    path="/profile"
                    element={<div className="p-4">Profile Page</div>}
                  />
                  <Route
                    path="/settings"
                    element={<div className="p-4">Settings Page</div>}
                  />
                  <Route
                    path="/django-integration"
                    element={<DjangoIntegration />}
                  />
                </Route>
              </Route>

              {/* Add a catch-all route that redirects to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            {/* Routes are defined above */}
          </>
        </Suspense>
      </TenantProvider>
    </AuthProvider>
  );
}

export default App;
