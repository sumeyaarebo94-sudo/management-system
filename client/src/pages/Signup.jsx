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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        confirmPassword: formData.confirmPassword,
        division: formData.division,
        year: formData.year,
      });

      setSuccess("Account created successfully. You can now log in.");

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

        {/* Logo */}
        <div className="signup-logo">
          <div className="signup-logo-icon">
            <span></span>
            <span></span>
          </div>
          <span>LogoIpsum</span>
        </div>

        {/* Heading */}
        <h1>Create Account 👋</h1>
        <p className="signup-subtitle">
          Please create your account here
        </p>

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

          {/* Full Name */}
          <div className="signup-form-group">
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

          {/* Email */}
          <div className="signup-form-group">
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

          {/* Password */}
          <div className="signup-form-group">
            <label htmlFor="password">Password</label>

            <div className="signup-password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />

              <button
                type="button"
                className="signup-password-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? "◉" : "◌"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="signup-form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="signup-password-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="signup-password-eye"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? "◉" : "◌"}
              </button>
            </div>
          </div>

          {/* Division */}
          <div className="signup-form-group">
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

          {/* Year */}
          <div className="signup-form-group">
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

          {/* Signup button */}
          <button
            type="submit"
            className="signup-button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Login */}
        <button
          type="button"
          className="signup-login-button"
          onClick={() => navigate("/login")}
        >
          Already have an account? <span>Login</span>
        </button>
      </div>
    </div>
  );
};

export default Signup;