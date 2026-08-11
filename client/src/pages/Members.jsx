import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Members = () => {
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    division: "",
    year: "",
  });

  const [editingId, setEditingId] = useState(null);

  const canManage = user?.role === "Admin";

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/members");
      setMembers(response.data);
    } catch (err) {
      console.error("Failed to fetch members:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load members."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      division: "",
      year: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      if (editingId) {
        await api.put(`/members/${editingId}`, formData);
      } else {
        await api.post("/members", formData);
      }

      resetForm();
      await fetchMembers();
    } catch (err) {
      console.error("Member save error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save member."
      );
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);

    setFormData({
      name: member.name,
      email: member.email,
      division: member.division,
      year: member.year,
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/members/${id}`);

      await fetchMembers();
    } catch (err) {
      console.error("Member delete error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete member."
      );
    }
  };

  return (
    <div className="members-page">
      <div className="members-header">
        <div>
          <h1>All Members</h1>
          <p>Manage and view system members.</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {canManage && (
        <div className="member-form-card">
          <h2>
            {editingId ? "Edit Member" : "Add Member"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="division">Division</label>

              <input
                id="division"
                name="division"
                type="text"
                value={formData.division}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">Year</label>

              <input
                id="year"
                name="year"
                type="text"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">
              {editingId
                ? "Update Member"
                : "Add Member"}
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

      <div className="members-card">
        {loading ? (
          <p>Loading members...</p>
        ) : members.length === 0 ? (
          <p>No members found.</p>
        ) : (
          <div className="members-table-wrapper">
            <table className="members-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Division</th>
                  <th>Year</th>

                  {canManage && <th>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {members.map((member) => (
                  <tr key={member._id}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.division}</td>
                    <td>{member.year}</td>

                    {canManage && (
                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(member)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(member._id)
                          }
                        >
                          Delete
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

export default Members;