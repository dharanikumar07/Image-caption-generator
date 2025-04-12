import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaVolumeUp, FaCopy, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext"; 
import { showError, showSuccess } from "../helpers/ToastHelper";

function GenerateCaption() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [selectedLang, setSelectedLang] = useState("");
  const [showCaption, setShowCaption] = useState(false);
  const [generateDisabled, setGenerateDisabled] = useState(false);
  const [userId, setUserId] = useState(null);
  const [settings, setSettings] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const token = localStorage.getItem("icg_authToken");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [meRes, settingsRes] = await Promise.all([
          axios.get("http://localhost:5000/me", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/getsettings", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setUserId(meRes.data.id);
        setSettings(settingsRes.data);
      } catch (err) {
        console.error("Initial fetch error:", err);
        showError("Error loading user/settings");
      }
    };

    fetchInitialData();
  }, [token]);

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

  const handleGenerate = async () => {
    setGenerateDisabled(true); 
    if (!image || !settings || !userId) return showError("Please upload image and wait for settings");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("user_id", userId);
      formData.append("preferredLanguage", settings.preferredLanguage);
      formData.append("automateSpeech", settings.automateSpeech);
      formData.append("speechVoice", settings.speechVoice);

      const genRes = await axios.post("http://localhost:5000/generate_caption", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      let generated = genRes.data.caption;

      if (settings.translateCaptions) {
        const transRes = await axios.post("http://localhost:5000/translate", {
          caption: generated,
          lang: settings.preferredLanguage,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        generated = transRes.data.translated_caption || generated;
      }

      setShowCaption(false);
      showSuccess("Caption Generate Successfully!..")

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
      showError("Failed to generate caption");
    }
  };

  const handleSpeak = async (text) => {
    try {
      await axios.post("http://localhost:5000/speak_caption", { caption: text }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Speak API error:", err);
      showError("Unable to Speak..")
    }
  };

  const handleTranslateButtonManually = async () => {
    if (!caption || !selectedLang) {
      showError("Please generate a caption and select a language");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/translate", {
        caption,
        lang: selectedLang,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const translated = res.data.translated_caption || caption;
      setCaption(translated);

      showSuccess("Caption Translated Successfully!");

      if (settings?.automateSpeech) {
        await handleSpeak(translated);
      }
    } catch (err) {
      console.error("Manual translation failed:", err);
      showError("Translation failed");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    showSuccess("Caption copied!");
  };

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} w-full absolute top-0 left-0 min-h-screen flex items-start justify-center transition-all`}>
      <div className="max-w-3xl w-full p-6 flex flex-col items-center">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Image Caption Generator</h1>&nbsp;&nbsp;&nbsp;
          <button onClick={toggleTheme} className = {`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <input
          type="file"
          accept="image/*"

          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setGenerateDisabled(false); 
          }}

          className="mb-4 w-full file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-64 w-auto rounded-lg mb-4 border border-gray-300 object-contain"
            //className="h-full rounded-lg mb-4 border border-gray-300"
          />
        )}

        <button
          onClick={handleGenerate}
          disabled={generateDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Generate Caption
        </button>

        {showCaption && (
          <div
            className={`transition-all w-full duration-500 ease-in-out opacity-100 scale-100 mt-6 p-4 rounded-lg relative shadow-md ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-[#f5f5dc] text-gray-900"
            }`}
          >
            <div
                className={`relative transition-all w-full duration-500 ease-in-out opacity-100 scale-100 mt-6 p-4 rounded-lg shadow-md ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-[#f5f5dc] text-gray-900"
                }`}
              >
                <p className="text-lg font-medium pr-14">{caption}</p>
                <div className="absolute top-2 right-2 flex space-x-2 z-10">
                  <button
                    onClick={() => handleSpeak(caption)}
                    title="Speak"
                    className={`p-2 rounded-full ${isDarkMode ? "bg-transparent text-white" : "bg-transparent text-black"}`}
                  >
                    <FaVolumeUp className="text-2xl hover:text-blue-300 transition-all" />
                  </button>
                  <button
                    onClick={handleCopy}
                    title="Copy"
                    className={`p-2 rounded-full ${isDarkMode ? "bg-transparent text-white" : "bg-transparent text-black"}`}
                  >
                    <FaCopy className="text-2xl hover:text-green-300 transition-all" />
                  </button>
                </div>
              </div>


            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="w-full sm:w-auto">
                <label
                  className={`${isDarkMode ? "text-white" : "text-black"} block text-sm font-medium mb-1`}
                >
                  Translate to
                </label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className={`w-full sm:w-64 ${isDarkMode ? "bg-white dark:bg-gray-800" : "bg-transparent"} 
                    border border-gray-300 dark:border-gray-700 ${isDarkMode ? "text-white" : "text-black"} 
                    px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option 
                    value="" 
                    className={`${isDarkMode ? "text-white" : "text-black"}`}
                  >
                    Select Language
                  </option>
                  {languages.map((lang) => (
                    <option 
                      key={lang.code} 
                      value={lang.code} 
                      className={`${isDarkMode ? "text-white" : "text-black"}`}
                    >
                      {lang.name}
                    </option>
                  ))}
                </select>

              </div>

              <div className="pt-[26px] w-full sm:w-auto">
                <button
                  onClick={handleTranslateButtonManually}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition-all duration-300 shadow-sm w-full sm:w-auto"
                >
                  Translate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateCaption;
