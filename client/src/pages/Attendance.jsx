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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="attendance-page">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <p>
            View and manage member attendance.
          </p>
        </div>
      </div>

      {error && (
        <div className="attendance-error">
          {error}
        </div>
      )}

      {/* Mark Attendance */}
      {canManage && (
        <div className="attendance-form-card">

          <div className="attendance-card-header">
            <div>
              <h2>
                {editingId
                  ? "Update Attendance"
                  : "Mark Attendance"}
              </h2>

              <p>
                Record attendance for a member.
              </p>
            </div>
          </div>

          <form
            className="attendance-form"
            onSubmit={handleSubmit}
          >

            {/* Member */}
            <div className="attendance-field">
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

            {/* Date */}
            <div className="attendance-field">
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

            {/* Status */}
            <div className="attendance-field">
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

            {/* Buttons */}
            <div className="attendance-form-actions">

              <button
                type="submit"
                className="primary-button"
              >
                {editingId
                  ? "Update Attendance"
                  : "Mark Attendance"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}

            </div>
          </form>
        </div>
      )}

      {/* Attendance Records */}
      <div className="attendance-table-card">

        <div className="attendance-card-header">
          <div>
            <h2>Attendance Records</h2>

            <p>
              View recorded member attendance.
            </p>
          </div>

          <div className="attendance-count">
            {attendance.length} records
          </div>
        </div>

        {loading ? (
          <div className="attendance-empty">
            <p>Loading attendance...</p>
          </div>
        ) : attendance.length === 0 ? (
          <div className="attendance-empty">
            <p>No attendance records found.</p>
          </div>
        ) : (
          <div className="attendance-table-wrapper">

            <table className="attendance-table">

              <thead>
                <tr>
                  <th>MEMBER</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>MARKED BY</th>

                  {canManage && (
                    <th>ACTIONS</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {attendance.map((record) => (
                  <tr key={record._id}>

                    <td>
                      <div className="attendance-member">
                        <div className="attendance-avatar">
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

                    {canManage && (
                      <td>
                        <button
                          type="button"
                          className="edit-button"
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

          </div>
        )}

      </div>
    </div>
  );
};

export default Attendance;