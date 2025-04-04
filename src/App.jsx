import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TherapyChat from "./pages/user/TherapyChat";
import Login from "./pages/auth/Login";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        {/*Protected routes*/}
        {/* Admin routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* User routes */}
        <Route path="/therapy-chat" element={<TherapyChat />} />
      </Routes>
    </Router>
  );
}
export default App;
