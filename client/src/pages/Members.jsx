import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Members = () => {
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    division: "",
    year: "",
  });

  const [editingId, setEditingId] = useState(null);

  // Only Admin can add, edit and delete members
  const canManage = user?.role === "Admin";

  // ========================================
  // FETCH MEMBERS
  // ========================================

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

  // ========================================
  // FORM INPUT
  // ========================================

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // ========================================
  // RESET FORM
  // ========================================

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      division: "",
      year: "",
    });

    setEditingId(null);
  };

  // ========================================
  // ADD / UPDATE MEMBER
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      if (editingId) {
        await api.put(
          `/members/${editingId}`,
          formData
        );
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

  // ========================================
  // EDIT MEMBER
  // ========================================

  const handleEdit = (member) => {
    setEditingId(member._id);

    setFormData({
      name: member.name || "",
      email: member.email || "",
      division: member.division || "",
      year: member.year || "",
    });

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // DELETE MEMBER
  // ========================================

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

  // ========================================
  // SEARCH MEMBERS
  // ========================================

  const filteredMembers = members.filter((member) => {
    const searchText = search.toLowerCase();

    return (
      member.name?.toLowerCase().includes(searchText) ||
      member.email?.toLowerCase().includes(searchText) ||
      member.division?.toLowerCase().includes(searchText) ||
      String(member.year)
        .toLowerCase()
        .includes(searchText)
    );
  });

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="members-page">

      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="members-page-header">
        <div>
          <h1>All Members</h1>

          <p>
            Manage and view system members.
          </p>
        </div>
      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* ========================================
          ADMIN FORM
      ======================================== */}

      {canManage && (
        <div className="member-form-card">

          <div className="member-form-header">
            <div>
              <h2>
                {editingId
                  ? "Edit Member"
                  : "Add Member"}
              </h2>

              <p>
                {editingId
                  ? "Update member information."
                  : "Add a new member to the system."}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="member-form"
          >

            {/* Name */}

            <div className="form-group">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Email */}

            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            {/* Division */}

            <div className="form-group">
              <label htmlFor="division">
                Division
              </label>

              <input
                id="division"
                name="division"
                type="text"
                value={formData.division}
                onChange={handleChange}
                placeholder="Enter division"
                required
              />
            </div>

            {/* Year */}

            <div className="form-group">
              <label htmlFor="year">
                Year
              </label>

              <input
                id="year"
                name="year"
                type="text"
                value={formData.year}
                onChange={handleChange}
                placeholder="Enter year"
                required
              />
            </div>

            {/* Buttons */}

            <div className="member-form-buttons">

              <button
                type="submit"
                className="primary-btn"
              >
                {editingId
                  ? "Update Member"
                  : "Add Member"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>
        </div>
      )}

      {/* ========================================
          MEMBERS CARD
      ======================================== */}

      <div className="members-card">

        {/* Card Header */}

        <div className="members-card-header">

          <div>
            <h2>Members</h2>

            <p>
              {members.length}{" "}
              {members.length === 1
                ? "member"
                : "members"}{" "}
              in the system
            </p>
          </div>

          {/* Search */}

          <div className="members-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

        </div>

        {/* ========================================
            LOADING
        ======================================== */}

        {loading ? (
          <div className="members-loading">
            Loading members...
          </div>
        ) : filteredMembers.length === 0 ? (

          <div className="members-empty">
            {search
              ? "No members match your search."
              : "No members found."}
          </div>

        ) : (

          /* ========================================
             TABLE
          ======================================== */

          <div className="members-table-wrapper">

            <table className="members-table">

              <thead>

                <tr>
                  <th>MEMBER</th>
                  <th>EMAIL</th>
                  <th>DIVISION</th>
                  <th>YEAR</th>

                  {canManage && (
                    <th>ACTIONS</th>
                  )}
                </tr>

              </thead>

              <tbody>

                {filteredMembers.map((member) => (

                  <tr key={member._id}>

                    {/* MEMBER */}

                    <td>

                      <div className="member-name-cell">

                        <div className="member-avatar">
                          {member.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {member.name}
                        </strong>

                      </div>

                    </td>

                    {/* EMAIL */}

                    <td>

                      <span className="member-email">
                        {member.email}
                      </span>

                    </td>

                    {/* DIVISION */}

                    <td>

                      <span className="division-badge">
                        {member.division}
                      </span>

                    </td>

                    {/* YEAR */}

                    <td>
                      {member.year}
                    </td>

                    {/* ACTIONS */}

                    {canManage && (

                      <td>

                        <div className="member-actions">

                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() =>
                              handleEdit(member)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                member._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

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