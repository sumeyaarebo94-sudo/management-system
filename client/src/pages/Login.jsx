import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log("Login response:", response.data);

      login(response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
            `Login failed (${error.response.status}).`
        );
      } else if (error.request) {
        setError(
          "Could not connect to the server. Make sure the backend is running on port 5000."
        );
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-form-container">

          {/* Logo */}
          <div className="login-logo">
            <div className="logo-icon">
              <span></span>
              <span></span>
            </div>

            <span className="logo-text">
              LogoIpsum
            </span>
          </div>

          {/* Heading */}
          <h1>Welcome 👋</h1>

          <p className="login-subtitle">
            Please login here
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-eye"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="remember-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  name="remember"
                />

                <span>
                  Remember Me
                </span>
              </label>
            </div>

            {/* Login */}
            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          {/* Signup */}
          <button
            className="signup-link-button"
            type="button"
            onClick={() => navigate("/signup")}
          >
            Don't have an account? Sign Up
          </button>

        </div>
      </div>
    </div>
  );
};

export default Login;