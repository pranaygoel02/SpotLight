import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingLayout from "./layouts/LandingLayout";
import Login from "./pages/landing/Login";
import Signup from "./pages/landing/Signup";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Account from "./pages/dashboard/Account";
import AuthLayout from "./layouts/AuthLayout";
import { Toaster } from "react-hot-toast";
import Phone from "./pages/landing/Phone";
import Otp from "./pages/landing/Otp";
import ProtectedRoute from "./components/ProtectedRoute";
import Create from "./pages/dashboard/Create";
import Events from "./pages/dashboard/Events";
import Event from "./pages/dashboard/Event";
import AcceptInvite from "./pages/AcceptInvite";
import Invites from "./pages/dashboard/Invites";
import VeirfyEmail from "./pages/VerifyEmail";
import Landing from "./pages/landing/Landing";
import Explore from "./pages/landing/Explore";
import EventPage from "./pages/landing/EventPage";
import Ticket from "./components/Ticket";
import Rsvps from "./pages/dashboard/Rsvp";
import DashboardScreenLayout from "./layouts/DashboardScreenLayout";
import MarkAttendance from "./pages/MarkAttendance";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/ticket" element={<Ticket />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LandingLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Landing />} />
            <Route path="explore" element={<Explore />} />
            <Route path="event/:id" element={<EventPage />} />
            <Route path="auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="phone" element={<Phone />} />
              <Route path="otp" element={<Otp />} />
            </Route>
          </Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<Dashboard />} />
            <Route path="create" element={<Create />} />
            <Route path="event/:id" element={<Event />} />
            <Route path="account" element={<Account />} />
            <Route
              path="events"
              element={
                <DashboardScreenLayout title={"Your Events"}>
                  <Events />
                </DashboardScreenLayout>
              }
            />
            <Route
              path="invities"
              element={
                <DashboardScreenLayout title={"Your Invites"}>
                  <Invites />
                </DashboardScreenLayout>
              }
            />
            <Route
              path="rsvp"
              element={
                <DashboardScreenLayout title={"Your RSVPs"}>
                  {" "}
                  <Rsvps />{" "}
                </DashboardScreenLayout>
              }
            />
          </Route>
          <Route path="/accept-invite/:eventId" element={<AcceptInvite />} />
          <Route path="/verify-email" element={<VeirfyEmail />} />
          <Route path="/mark-attendance" element={<MarkAttendance />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
