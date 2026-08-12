import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";

import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["Admin", "Supervisor", "User"]}
          >
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>

      {/* Members */}
      <Route
        path="/members"
        element={
          <ProtectedRoute
            allowedRoles={["Admin", "Supervisor", "User"]}
          >
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Members />} />
      </Route>

      {/* Attendance */}
      <Route
        path="/attendance"
        element={
          <ProtectedRoute
            allowedRoles={["Admin", "Supervisor"]}
          >
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Attendance />} />
      </Route>

      {/* Reports */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute
            allowedRoles={["Admin", "Supervisor", "User"]}
          >
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Reports />} />
      </Route>

      {/* Default */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Unknown route */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;