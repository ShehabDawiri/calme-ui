import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import SessionNotes from "./pages/adminpage"
import Register from "./pages/register"
import AudioTranscriber from "./pages/Audio"
import Login_admin from "./pages/Login_admin"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/patient-portal-login" element={<Login />} />
          <Route path="/admin-portal" element={<Login_admin />} />
          <Route path="/session-notes" element={<SessionNotes />} />
          <Route
            path="/patient-portal-login/AudioTranscriber"
            element={<AudioTranscriber />}
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
