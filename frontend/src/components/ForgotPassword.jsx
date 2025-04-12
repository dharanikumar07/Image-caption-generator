import React, { useState } from "react";
import axios from "axios";
import { showSuccess, showError } from "../helpers/ToastHelper";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000//forgot_password", {
        email,
        password,
      });

      if (response.status === 200) {
        showSuccess(response.data.message || "Password reset successful!");
        navigate("/login");
      } else {
        console.log(response.data.error)
        showError(response.data.error || "Password reset failed.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        showError(error.response.data.error);
      } else {
        showError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-10 bg-white border border-slate-200 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
          Reset Your Password
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-transparent border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
              New Password
            </label>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-transparent border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-transparent border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold transform transition duration-300 hover:bg-indigo-700 hover:shadow-md hover:scale-105"
          >
            Reset Password
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="mt-6 text-sm text-center text-slate-600">
          Remembered your password?{" "}
          <a href="/login" className="text-indigo-600 font-medium hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
