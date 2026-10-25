import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import HrDashboard from "./pages/HrDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./components/Home";
import "./App.css";



const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/employee" element={<ProtectedRoute allowedRoles={["Employee"]}>
        <EmployeeDashboard />
      </ProtectedRoute>} />

      <Route path="/hr" element={<ProtectedRoute allowedRoles={["HR"]}>
        <HrDashboard />
      </ProtectedRoute>} />

      <Route path="/manager" element={<ProtectedRoute allowedRoles={["Manager"]}>
        <ManagerDashboard />
      </ProtectedRoute>} />
    </Routes>
  </BrowserRouter>
);

export default App;
