import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Attendance from "./pages/Attendance";

import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC PAGES ================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />


      {/* ================= DASHBOARD ================= */}

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
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Dashboard />}
        />
      </Route>


      {/* ================= ALL MEMBERS ================= */}

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
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Members />}
        />
      </Route>


      {/* ================= ATTENDANCE ================= */}

      <Route
        path="/attendance"
        element={
          <ProtectedRoute
            allowedRoles={[
              "Admin",
              "Supervisor",
            ]}
          >
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Attendance />}
        />
      </Route>


      {/* ================= DEFAULT ================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />


      {/* ================= UNKNOWN ROUTE ================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;