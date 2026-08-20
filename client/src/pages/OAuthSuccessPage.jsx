import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosInstance";

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      const token = searchParams.get("token");

      console.log("OAUTH SUCCESS TOKEN EXISTS:", Boolean(token));

      if (!token) {
        console.error("OAUTH SUCCESS: TOKEN MISSING");
        setError("Authentication token is missing.");
        navigate("/login?oauth=google-failed", { replace: true });
        return;
      }

      try {
        console.log("OAUTH SUCCESS: CALLING /auth/me");

        const response = await axiosInstance.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("OAUTH /auth/me RESPONSE:", response.data);

        const user = response.data.user;

        if (!user) {
          throw new Error("User information is missing.");
        }

        console.log("OAUTH USER:", user);

        login(user, token);

        console.log("OAUTH LOGIN SAVED");

        const role = user.role?.toLowerCase();

        if (role === "admin") {
          navigate("/admin/dashboard", { replace: true });
          return;
        }

        if (role === "mentor") {
          navigate("/mentor/dashboard", { replace: true });
          return;
        }

        if (role === "student") {
          navigate("/student/dashboard", { replace: true });
          return;
        }

        console.error("OAUTH UNKNOWN ROLE:", user.role);
        setError("Your account role is not recognized.");
      } catch (err) {
        console.error("OAUTH SUCCESS ERROR:", err);
        console.error("OAUTH ERROR RESPONSE:", err.response?.data);

        setError(
          err.response?.data?.message ||
            "Failed to complete Google authentication."
        );

        navigate("/login?oauth=google-failed", { replace: true });
      }
    };

    handleOAuthSuccess();
  }, [searchParams, navigate, login]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#c89b7b] font-serif">
        <div className="rounded-2xl bg-[#1e1713] px-8 py-6 text-center text-[#f5efe6] shadow-2xl">
          <p className="text-sm">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="mt-4 rounded-xl bg-[#c89b7b] px-5 py-2 text-sm font-semibold text-[#1e1713]"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[#c89b7b] font-serif">
      <div className="rounded-2xl bg-[#1e1713] px-8 py-6 text-center text-[#f5efe6] shadow-2xl">
        <p className="text-sm">Completing Google sign in...</p>
      </div>
    </div>
  );
}