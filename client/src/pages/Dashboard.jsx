import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">

      {/* Page heading */}
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back, {user?.name || "User"}!
          </p>
        </div>
      </div>


      {/* Welcome card */}
      <div className="welcome-card">
        <div>
          <span className="welcome-label">
            Welcome back 👋
          </span>

          <h2>
            {user?.name || "User"}
          </h2>

          <p>
            You are logged in as{" "}
            <strong>
              {user?.role || "User"}
            </strong>.
          </p>
        </div>

        <div className="welcome-icon">
          👋
        </div>
      </div>


      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">
            👥
          </div>

          <div>
            <span>Total Members</span>
            <strong>120</strong>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">
            ✓
          </div>

          <div>
            <span>Present Today</span>
            <strong>96</strong>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">
            ⏰
          </div>

          <div>
            <span>Absent Today</span>
            <strong>24</strong>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">
            📊
          </div>

          <div>
            <span>Reports</span>
            <strong>18</strong>
          </div>
        </div>

      </div>


      {/* Dashboard bottom section */}
      <div className="dashboard-grid">

        {/* Attendance */}
        <div className="dashboard-card attendance-card">

          <div className="card-header">
            <div>
              <h2>Attendance Overview</h2>
              <p>
                Attendance summary for this week
              </p>
            </div>

            <button className="card-action">
              View all
            </button>
          </div>


          <div className="attendance-chart">

            <div className="chart-bar">
              <span style={{ height: "70%" }}></span>
              <small>Mon</small>
            </div>

            <div className="chart-bar">
              <span style={{ height: "85%" }}></span>
              <small>Tue</small>
            </div>

            <div className="chart-bar">
              <span style={{ height: "65%" }}></span>
              <small>Wed</small>
            </div>

            <div className="chart-bar">
              <span style={{ height: "90%" }}></span>
              <small>Thu</small>
            </div>

            <div className="chart-bar">
              <span style={{ height: "78%" }}></span>
              <small>Fri</small>
            </div>

            <div className="chart-bar">
              <span style={{ height: "55%" }}></span>
              <small>Sat</small>
            </div>

            <div className="chart-bar">
              <span style={{ height: "45%" }}></span>
              <small>Sun</small>
            </div>

          </div>

        </div>


        {/* Recent Activity */}
        <div className="dashboard-card activity-card">

          <div className="card-header">
            <div>
              <h2>Recent Activity</h2>
              <p>
                Latest system activity
              </p>
            </div>
          </div>


          <div className="activity-list">

            <div className="activity-item">
              <div className="activity-dot"></div>

              <div>
                <strong>
                  Member attendance updated
                </strong>

                <span>
                  Today, 10:30 AM
                </span>
              </div>
            </div>


            <div className="activity-item">
              <div className="activity-dot"></div>

              <div>
                <strong>
                  New member registered
                </strong>

                <span>
                  Today, 09:15 AM
                </span>
              </div>
            </div>


            <div className="activity-item">
              <div className="activity-dot"></div>

              <div>
                <strong>
                  Monthly report generated
                </strong>

                <span>
                  Yesterday, 04:20 PM
                </span>
              </div>
            </div>


            <div className="activity-item">
              <div className="activity-dot"></div>

              <div>
                <strong>
                  Profile information updated
                </strong>

                <span>
                  Yesterday, 01:10 PM
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;