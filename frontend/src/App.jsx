import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login      from "./pages/Login";
import Dashboard  from "./pages/Dashboard";
import Room       from "./pages/Room";
import Goodbye    from "./pages/Goodbye";
import CreateRoom from "./pages/CreateRoom";
import Landing    from "./pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Landing />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/signup"      element={<Login />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/room"        element={<Room />} />
        <Route path="/goodbye"     element={<Goodbye />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;