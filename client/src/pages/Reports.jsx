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

  if (loading) {
    return (
      <div className="reports-page">
        <h1>Reports</h1>
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>Reports</h1>
        <p>Attendance and member summary.</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="report-summary">
        <div className="report-card">
          <h3>Total Members</h3>
          <p>{members.length}</p>
        </div>

        <div className="report-card">
          <h3>Present</h3>
          <p>{presentCount}</p>
        </div>

        <div className="report-card">
          <h3>Absent</h3>
          <p>{absentCount}</p>
        </div>

        <div className="report-card">
          <h3>Late</h3>
          <p>{lateCount}</p>
        </div>
      </div>

      <div className="report-table-card">
        <h2>Attendance Report</h2>

        {attendance.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <table className="reports-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Date</th>
                <th>Status</th>
                <th>Marked By</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((record) => (
                <tr key={record._id}>
                  <td>
                    {record.member?.name || "Unknown"}
                  </td>

                  <td>
                    {record.date
                      ? new Date(
                          record.date
                        ).toLocaleDateString()
                      : ""}
                  </td>

                  <td>{record.status}</td>

                  <td>
                    {record.markedBy?.name ||
                      "Unknown"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;