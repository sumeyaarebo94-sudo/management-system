import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Attendance = () => {
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    member: "",
    date: "",
    status: "Present",
  });

  const [editingId, setEditingId] = useState(null);

  const canManage =
    user?.role === "Admin" ||
    user?.role === "Supervisor";

  const fetchData = async () => {
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
      console.error("Attendance loading error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      member: "",
      date: "",
      status: "Present",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      if (editingId) {
        await api.put(
          `/attendance/${editingId}`,
          formData
        );
      } else {
        await api.post("/attendance", formData);
      }

      resetForm();
      await fetchData();
    } catch (err) {
      console.error("Attendance save error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save attendance."
      );
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);

    setFormData({
      member: record.member?._id || "",
      date: record.date
        ? record.date.substring(0, 10)
        : "",
      status: record.status,
    });
  };

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <h1>Attendance</h1>
        <p>View and manage member attendance.</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {canManage && (
        <div className="attendance-form-card">
          <h2>
            {editingId
              ? "Update Attendance"
              : "Mark Attendance"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="member">
                Member
              </label>

              <select
                id="member"
                name="member"
                value={formData.member}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select member
                </option>

                {members.map((member) => (
                  <option
                    key={member._id}
                    value={member._id}
                  >
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">
                Date
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Present">
                  Present
                </option>

                <option value="Absent">
                  Absent
                </option>

                <option value="Late">
                  Late
                </option>
              </select>
            </div>

            <button type="submit">
              {editingId
                ? "Update Attendance"
                : "Mark Attendance"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      <div className="attendance-card">
        {loading ? (
          <p>Loading attendance...</p>
        ) : attendance.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Date</th>
                <th>Status</th>
                <th>Marked By</th>

                {canManage && (
                  <th>Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {attendance.map((record) => (
                <tr key={record._id}>
                  <td>
                    {record.member?.name ||
                      "Unknown"}
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

                  {canManage && (
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(record)
                        }
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Attendance;