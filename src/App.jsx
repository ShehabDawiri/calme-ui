import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TherapyChat from "./pages/user/TherapyChat";
import Callback from "./pages/auth/Callback";
import WelcomePage from "./pages/public/WelcomePage";
import { useAuth0 } from "@auth0/auth0-react";
import { Loader } from "./components/ui/Loader";
import { Navigate } from "react-router-dom";
import { useToast } from "./hooks/useToast";
import NotFound from "./pages/public/NotFound";
import { InitialRedirect } from "./pages/initialRedirect";

const ROLE_NAMESPACE = `${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`;

const ProtectedRoute = ({
  children,
  requiredRoles,
  onUnauthenticated,
  onUnauthorized,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) return <Loader />;

  if (!isAuthenticated) {
    onUnauthenticated?.();
    return <Navigate to="/" />;
  }

  const userRoles = user?.[ROLE_NAMESPACE] || [];

  if (
    requiredRoles &&
    !userRoles.some((role) => requiredRoles.includes(role))
  ) {
    onUnauthorized?.();
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const { ToastContainer, showToast } = useToast();

  return (
    <div className="app-container">
      <ToastContainer />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/welcome" element={<WelcomePage />} />

          {/* Auth callback - removed protection since it's part of auth flow */}
          <Route path="/callback" element={<Callback />} />

          {/* Role-based routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute
                requiredRoles={["admin"]}
                onUnauthenticated={() =>
                  showToast("Admin access requires login", "warning")
                }
                onUnauthorized={() =>
                  showToast(
                    "Insufficient privileges for admin dashboard",
                    "error",
                  )
                }
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/therapy-chat"
            element={
              <ProtectedRoute
                requiredRoles={["user"]}
                onUnauthenticated={() =>
                  showToast("Please login to start therapy session", "info")
                }
                onUnauthorized={() =>
                  showToast(
                    "Upgrade your account to access therapy features",
                    "error",
                  )
                }
              >
                <TherapyChat />
              </ProtectedRoute>
            }
          />

          {/* Automatic role-based redirect */}
          <Route path="/" element={<InitialRedirect></InitialRedirect>} />

          {/* Fallback route */}
          <Route path="*" element={<NotFound></NotFound>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
