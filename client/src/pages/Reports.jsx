import { useEffect, useState } from "react";
import api from "../services/api";

const Reports = () => {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const [membersResponse, attendanceResponse] =
          await Promise.all([
            api.get("/members"),
            api.get("/attendance"),
          ]);

        setMembers(membersResponse.data);
        setAttendance(attendanceResponse.data);
      } catch (err) {
        console.error("Reports loading error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load reports."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const presentCount = attendance.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    (record) => record.status === "Absent"
  ).length;

  const lateCount = attendance.filter(
    (record) => record.status === "Late"
  ).length;

  const totalAttendance = attendance.length;

  const attendanceRate =
    totalAttendance > 0
      ? Math.round(
          (presentCount / totalAttendance) * 100
        )
      : 0;

  if (loading) {
    return (
      <div className="reports-page">
        <div className="page-header">
          <h1>Reports</h1>
          <p>Attendance and member summary.</p>
        </div>

        <div className="report-loading">
          Loading reports...
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>
            Attendance and member summary.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="attendance-error">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="report-summary">

        <div className="report-card">
          <div className="report-card-top">
            <span>Total Members</span>
          </div>

          <strong>{members.length}</strong>

          <p>
            Members in the system
          </p>
        </div>

        <div className="report-card">
          <div className="report-card-top">
            <span>Present</span>

            <span className="report-status-dot present-dot">
              ●
            </span>
          </div>

          <strong>{presentCount}</strong>

          <p>
            Present attendance
          </p>
        </div>

        <div className="report-card">
          <div className="report-card-top">
            <span>Absent</span>

            <span className="report-status-dot absent-dot">
              ●
            </span>
          </div>

          <strong>{absentCount}</strong>

          <p>
            Absent attendance
          </p>
        </div>

        <div className="report-card">
          <div className="report-card-top">
            <span>Late</span>

            <span className="report-status-dot late-dot">
              ●
            </span>
          </div>

          <strong>{lateCount}</strong>

          <p>
            Late attendance
          </p>
        </div>

      </div>

      {/* Attendance Overview */}
      <div className="report-overview-card">

        <div className="report-card-header">
          <div>
            <h2>Attendance Overview</h2>

            <p>
              Summary of recorded attendance.
            </p>
          </div>

          <div className="attendance-rate">
            {attendanceRate}%
            <span>attendance</span>
          </div>
        </div>

        <div className="report-progress">

          <div className="report-progress-bar">
            <div
              className="report-progress-value"
              style={{
                width: `${attendanceRate}%`,
              }}
            ></div>
          </div>

          <div className="report-progress-labels">
            <span>
              {presentCount} Present
            </span>

            <span>
              {totalAttendance} Total Records
            </span>
          </div>

        </div>

      </div>

      {/* Attendance Report */}
      <div className="report-table-card">

        <div className="report-card-header">
          <div>
            <h2>Attendance Report</h2>

            <p>
              View recorded member attendance.
            </p>
          </div>

          <div className="report-record-count">
            {attendance.length} records
          </div>
        </div>

        {attendance.length === 0 ? (
          <div className="report-empty">
            <p>
              No attendance records found.
            </p>
          </div>
        ) : (
          <div className="reports-table-wrapper">

            <table className="reports-table">

              <thead>
                <tr>
                  <th>MEMBER</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>MARKED BY</th>
                </tr>
              </thead>

              <tbody>
                {attendance.map((record) => (
                  <tr key={record._id}>

                    <td>
                      <div className="report-member">

                        <div className="report-avatar">
                          {record.member?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </div>

                        <span>
                          {record.member?.name ||
                            "Unknown"}
                        </span>

                      </div>
                    </td>

                    <td>
                      {record.date
                        ? new Date(
                            record.date
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <span
                        className={`attendance-status ${record.status
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td>
                      {record.markedBy?.name ||
                        "Unknown"}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default Reports;