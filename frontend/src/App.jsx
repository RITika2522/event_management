import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import VendorDashboard from "./components/VendorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Navbar from "./components/Navbar";
import { useState } from "react";

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || null);

  return (
    <>
      <Navbar setUserRole={setUserRole} userRole={userRole} />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUserRole={setUserRole} />} />
          <Route path="/user" element={userRole === "user" ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/vendor" element={userRole === "vendor" ? <VendorDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin" element={userRole === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;