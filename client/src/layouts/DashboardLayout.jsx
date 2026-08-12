import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <span></span>
            <span></span>
          </div>

          <h2>Management</h2>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">

          {/* Dashboard - Everyone */}
          <NavLink to="/dashboard">
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </NavLink>

          {/* All Members - Everyone */}
          <NavLink to="/members">
            <span className="nav-icon">👥</span>
            <span>All Members</span>
          </NavLink>

          {/* Attendance - Admin + Supervisor */}
          {(user?.role === "Admin" ||
            user?.role === "Supervisor") && (
            <NavLink to="/attendance">
              <span className="nav-icon">✓</span>
              <span>Attendance</span>
            </NavLink>
          )}

          {/* Settings - Admin only */}
          {user?.role === "Admin" && (
            <NavLink to="/settings">
              <span className="nav-icon">⚙</span>
              <span>Settings</span>
            </NavLink>
          )}

        </nav>

        {/* User section */}
        <div className="sidebar-bottom">

          <div className="user-info">

            <div className="user-avatar">
              {(user?.name || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="user-details">
              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                {user?.role || "Member"}
              </span>
            </div>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="logout-button"
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">

          <div className="header-title">
            <h1>Management System</h1>
          </div>

          <div className="header-right">

            <div className="header-date">
              <span>Today</span>

              <strong>
                {new Date().toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </strong>
            </div>

            <div className="header-user">

              <div className="header-avatar">
                {(user?.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>
                  {user?.name || "User"}
                </strong>

                <span>
                  {user?.role || "Member"}
                </span>
              </div>

            </div>

          </div>

        </header>

        {/* Page */}
        <section className="dashboard-content">
          <Outlet />
        </section>

      </main>

    </div>
  );
}

export default DashboardLayout;