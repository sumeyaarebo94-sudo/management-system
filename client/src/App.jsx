import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Dashboard - all authenticated users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={[
              "Admin",
              "Supervisor",
              "User",
            ]}
          >
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Members - all authenticated users */}
      <Route
        path="/members"
        element={
          <ProtectedRoute
            allowedRoles={[
              "Admin",
              "Supervisor",
              "User",
            ]}
          >
            <Members />
          </ProtectedRoute>
        }
      />

      {/* Attendance - Admin and Supervisor only */}
      <Route
        path="/attendance"
        element={
          <ProtectedRoute
            allowedRoles={[
              "Admin",
              "Supervisor",
            ]}
          >
            <Attendance />
          </ProtectedRoute>
        }
      />

      {/* Reports - all authenticated users */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute
            allowedRoles={[
              "Admin",
              "Supervisor",
              "User",
            ]}
          >
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* Unknown route */}
      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;