// App.tsx
import "./App.css";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ManagerDashboard } from "./pages/ManagerDashboard";
import { EmployeeDashboard } from "./pages/EmployeeDashboard";
import { Login } from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Navbar from "./Components/Navbar";

// Main App Component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check the localStorage on app load and update state
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (userId && role) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // Empty dependency array ensures this effect runs once when the component mounts

  return (
    <BrowserRouter>
      <Navbar />
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/employee"
            element={isLoggedIn ? <EmployeeDashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/manager"
            element={isLoggedIn ? <ManagerDashboard /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
