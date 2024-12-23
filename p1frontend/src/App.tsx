import "./App.css";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { ManagerDashboard } from "./pages/ManagerDashboard";
import { EmployeeDashboard } from "./pages/EmployeeDashboard";
import { Login } from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Navbar from "./Components/Navbar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ReimbursementForm } from "./Components/Reimbursements/ReimbursementForm";
import { ReimbursementList } from "./Components/Reimbursements/ReimbursementList";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/employee"
            element={<ProtectedRoute component={EmployeeDashboard} />}
          />
          <Route
            path="/manager"
            element={<ProtectedRoute component={ManagerDashboard} />}
          />

          {/* Reimbursement Routes */}
          <Route
            path="/create-reimbursements"
            element={<ProtectedRoute component={ReimbursementForm} />}
          />
          <Route
            path="/reimbursements"
            element={<ProtectedRoute component={ReimbursementList} />}
          />
      
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

// ProtectedRoute component
const ProtectedRoute: React.FC<{ component: React.FC }> = ({
  component: Component,
}) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Component /> : <Navigate to="/" />;
};
