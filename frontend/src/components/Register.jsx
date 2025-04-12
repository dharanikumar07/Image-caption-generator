import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaVolumeUp, FaCopy, FaMoon, FaSun } from "react-icons/fa";

// Predefined languages
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
  { code: "ms", name: "Malay" }
];

function GenerateCaption() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [showCaption, setShowCaption] = useState(false);
  const [userId, setUserId] = useState(null);
  const [settings, setSettings] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedLang, setSelectedLang] = useState("");
  const token = localStorage.getItem("icg_authToken");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [meRes, settingsRes] = await Promise.all([
          axios.get("http://localhost:5000/me", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/getsettings", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUserId(meRes.data.id);
        setSettings(settingsRes.data);
      } catch (err) {
        console.error("Initial fetch error:", err);
        alert("Error loading user/settings");
      }
    };

    if (token) fetchInitialData();
  }, [token]);

  const handleGenerate = async () => {
    if (!image || !settings || !userId)
      return alert("Please upload image and wait for settings");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("user_id", userId);
      formData.append("preferredLanguage", settings.preferredLanguage);
      formData.append("automateSpeech", settings.automateSpeech);
      formData.append("speechVoice", settings.speechVoice);

      const genRes = await axios.post(
        "http://localhost:5000/generate_caption",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      let generated = genRes.data.caption;

      // Translate if auto-enabled
      if (settings.translateCaptions) {
        const transRes = await axios.post(
          "http://localhost:5000/translate",
          {
            caption: generated,
            lang: settings.preferredLanguage
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        generated = transRes.data.translated_caption || generated;
      }

      setShowCaption(false);
      setTimeout(() => {
        setCaption(generated);
        setShowCaption(true);
      }, 100);

      if (settings.automateSpeech) {
        setTimeout(() => {
          handleSpeak(generated);
        }, 500);
      }
    } catch (err) {
      console.error("Caption generation failed:", err);
      alert("Failed to generate caption");
    }
  };

  const handleSpeak = async (text) => {
    try {
      await axios.post(
        "http://localhost:5000/speak_caption",
        { caption: text },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (err) {
      console.error("Speak API error:", err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    alert("Caption copied!");
  };

  const handleManualTranslate = async () => {
    if (!selectedLang || !caption) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/translate",
        { caption, lang: selectedLang },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const translated = res.data.translated_caption || caption;
      setShowCaption(false);
      setTimeout(() => {
        setCaption(translated);
        setShowCaption(true);
      }, 100);
    } catch (err) {
      console.error("Manual translation failed", err);
      alert("Translation failed");
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-screen transition-all`}
    >
      <div className="max-w-xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Image Caption Generator</h1>
          <button onClick={toggleTheme}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-4 w-full file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Generate Caption
        </button>

        {showCaption && (
          <div className="transition-all duration-500 ease-in-out opacity-100 scale-100 mt-6 p-4 bg-gray-800 text-white rounded-lg relative shadow-md">
            <p className="text-lg font-medium mb-3">{caption}</p>
            <div className="absolute top-2 right-2 flex space-x-2">
              <button onClick={() => handleSpeak(caption)} title="Speak">
                <FaVolumeUp className="text-xl hover:text-blue-300" />
              </button>
              <button onClick={handleCopy} title="Copy">
                <FaCopy className="text-xl hover:text-green-300" />
              </button>
            </div>

            {/* Manual translation controls */}\
            <div className="flex items-center mt-4 space-x-2">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="text-black bg-white px-3 py-2 rounded"
              >
                <option value="">Select Language</option>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleManualTranslate}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                ➡️
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateCaption;
