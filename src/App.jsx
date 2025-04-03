import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import AdminDashboard from "./pages/protected/AdminDashboard";
import Register from "./pages/register";
import AudioTranscriber from "./pages/Audio";
import Login_admin from "./pages/Login_admin";

// Layout wrapper for authenticated pages
const AuthLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<AdminDashboard />} />
        {/* <Route path="/" element={<AuthLayout />} /> */}
        <Route path="/login-admin" element={<Login_admin />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login-patient/AudioTranscriber"
          element={<AudioTranscriber />}
        />
        {/* Protected routes */}
        <Route element={<AuthLayout />}>
          {/* <Route
            path="/callback"
            element={
              <ProtectedRoute>
                <Callback />
              </ProtectedRoute>
            }
          /> */}
          <Route path="/home" element={<ProtectedRoute></ProtectedRoute>} />
          {/* <Route
            path="/record"
            element={
              <ProtectedRoute>
                <RecordingPage />
              </ProtectedRoute>
            }
          />{" "} */}
          <Route
            path="/SessionNotes"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
