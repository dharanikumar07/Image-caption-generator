import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../helpers/ToastHelper";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("icg_authToken", token);
        showSuccess(response.data.message || "Login successful!");

        // Redirect to /home after success
        navigate("/home");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.error);
        showError(error.response.data.error);
      } else {
        setErrorMsg("An unexpected error occurred.");
        showError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-full bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-xl border border-slate-200 shadow-xl transition-all">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
          Welcome Back
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
              className="w-full px-4 py-3 bg-white/70 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/70 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 transition"
            />
            <div className="text-right mt-2">
              <p className="text-sm text-slate-500">
                Forgot your password?{" "}
                <a
                  href="/forgot-password"
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Click here to reset it
                </a>
              </p>
            </div>
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold transform transition duration-300 hover:bg-indigo-700 hover:shadow-md hover:scale-105"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-slate-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-indigo-600 font-medium hover:underline">
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
