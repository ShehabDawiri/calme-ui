import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Login from "./pages/Login";
import SessionNotes from "./pages/adminpage";
import Register from "./pages/register";
import AudioTranscriber from "./pages/Audio";
import Login_admin from "./pages/Login_admin";
import Layout from "./components/Layout";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import Callback from "./components/Callback";
import RecordingPage from "./pages/RecordingPage";

// Custom namespace for Auth0 roles (should match Auth0 Actions)
const ROLE_NAMESPACE = `${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`;

// Layout wrapper for authenticated pages
const AuthLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children, requiredRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/" />;

  // Get user roles from ID token
  const userRoles = user?.[ROLE_NAMESPACE] || [];
  console.log({ userRoles });

  // Check if user has at least one required role
  if (
    requiredRoles &&
    !userRoles.some((role) => requiredRoles.includes(role))
  ) {
    return <Navigate to="/home" />; // Redirect unauthorized users
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login-patient" element={<Login />} />
        <Route path="/login-admin" element={<Login_admin />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login-patient/AudioTranscriber"
          element={<AudioTranscriber />}
        />

        {/* Protected routes */}
        <Route element={<AuthLayout />}>
          <Route
            path="/callback"
            element={
              <ProtectedRoute>
                <Callback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/record"
            element={
              <ProtectedRoute>
                <RecordingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SessionNotes"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <SessionNotes />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
