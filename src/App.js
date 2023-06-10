import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingLayout from "./layouts/LandingLayout";
import Home from "./pages/landing/Home";
import Login from "./pages/landing/Login";
import Signup from "./pages/landing/Signup";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Account from "./pages/dashboard/Account";
import Scrum from "./pages/dashboard/Scrum";
import AuthLayout from "./layouts/AuthLayout";
import { Toaster } from "react-hot-toast";
import Phone from "./pages/landing/Phone";
import Otp from "./pages/landing/Otp";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Error from "./pages/Error";

function App() {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><LandingLayout /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="phone" element={<Phone />} />
            <Route path="otp" element={<Otp />} />
          </Route>
        </Route>
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="" element={<Dashboard />} />
          <Route path="account" element={<Account />} />
          <Route path="scrum" element={<Scrum />} />
        </Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
