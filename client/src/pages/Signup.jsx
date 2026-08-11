import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    division: "",
    year: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        division: formData.division,
        year: formData.year,
      });

      setSuccess(
        "Account created successfully. You can now log in."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Sign Up</h1>
        <p>Create your account</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              minLength={8}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              minLength={8}
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
              placeholder="Enter your division"
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
              placeholder="Enter your year"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading
              ? "Creating account..."
              : "Sign Up"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default Signup;