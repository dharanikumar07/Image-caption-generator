import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../helpers/ToastHelper";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "zh-CN", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "tr", name: "Turkish" },
  { code: "bn", name: "Bengali" },
  { code: "ms", name: "Malay" },
];

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        email,
        password,
        preferred_language: preferredLanguage,
      });

      if (response.status === 201) {
        showSuccess(response.data.message || "Registration successful!");
        navigate("/login");
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
          Create Account
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
              Username
            </label>
            <input
              type="text"
              placeholder="your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/70 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 transition"
            />
          </div>

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
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
              Preferred Language
            </label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 transition"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold transform transition duration-300 hover:bg-indigo-700 hover:shadow-md hover:scale-105"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-slate-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 font-medium hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
