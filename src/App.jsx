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
          <Route path="/login-patient" element={<Login />} />
          <Route path="/login-admin" element={<Login_admin />} />
          <Route path="/SessionNotes" element={<SessionNotes />} />
          <Route
            path="/login-patient/AudioTranscriber"
            element={<AudioTranscriber />}
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
