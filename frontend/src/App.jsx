import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import SessionNotes from "./page/adminpage";
import Register from "./page/register";
import AudioTranscriber from "./page/Audio";
import Login_admin from "./page/Login_admin";


function App() {
  return (
    <>
    <Router>
      <Routes>
      <Route path="/" element={<Register/>} /> 
        <Route path="/login-patient" element={<Login/>} />

        <Route path="/login-admin" element={<Login_admin/>} />


        <Route path="/SessionNotes" element={<SessionNotes/>} />
        <Route path="/login-patient/AudioTranscriber" element={<AudioTranscriber/>} />
        
        
      </Routes>
    </Router></>
  );
}


export default App;
