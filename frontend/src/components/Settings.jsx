import React, { useEffect, useState } from "react";
import {
  Typography,
  Select,
  MenuItem,
  Switch,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
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

const Settings = () => {
  const { isDarkMode } = useTheme();
  const [userData, setUserData] = useState({
    username: "",
    preferred_language: "en",
    automate_translate: false,
    speech_voice: "female",
    automate_speech: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("icg_authToken");
        const res = await axios.get("http://localhost:5000/getsettings", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        setUserData({
          username: res.data.username || "User",
          preferred_language: res.data.preferredLanguage || "en",
          automate_translate: res.data.translateCaptions || false,
          speech_voice: res.data.speechVoice || "female",
          automate_speech: res.data.automateSpeech || false,
        });
      } catch (err) {
        showError("Error fetching settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("icg_authToken");
      const payload = {
        preferredLanguage: userData.preferred_language,
        translateCaptions: userData.automate_translate,
        speechVoice: userData.speech_voice,
        automateSpeech: userData.automate_speech,
      };
      await axios.post("http://localhost:5000/savesettings", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showSuccess("Settings saved successfully!");
    } catch (err) {
      console.error("Failed to save settings", err);
      showError("Error saving settings.");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading settings...</p>;

  return (
    <div className="w-full top-10 left-0 h-full fixed">
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: isDarkMode ? "#001f3d" : "#f5f7fa",
          color: isDarkMode ? "#ffffff" : "#1f2937",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 6,
          px: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={4} textAlign="center">
          Settings
        </Typography>

        <Box
          sx={{
            width: "100%",
            maxWidth: 650,
            backgroundColor: isDarkMode ? "#2a2d34" : "#ffffff",
            padding: 4,
            borderRadius: 4,
            boxShadow: 3,
            transition: "background-color 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: isDarkMode ? "#353941" : "#f0f4f8",
            },
          }}
        >
          <Typography variant="h5" fontWeight={600} mb={1}>
            Hi, {userData.username} 👋
          </Typography>

          <Typography
            variant="body1"
            mb={4}
            sx={{ color: isDarkMode ? "#ffffff" : "#555555" }}
          >
            Manage your app settings below
          </Typography>

          <Box display="flex" flexDirection="column" gap={3}>
            {/* Language */}
            <Box display="flex" alignItems="center">
              <Typography sx={{ minWidth: "180px" }}>Choose Language:</Typography>
              <Select
                size="small"
                fullWidth
                value={userData.preferred_language}
                onChange={(e) => handleChange("preferred_language", e.target.value)}
                MenuProps={{ disablePortal: true }}
                sx={{
                  color: isDarkMode ? "#ffffff" : "#000000",
                  "& .MuiSelect-icon": {
                    color: isDarkMode ? "#ffffff" : "#000000",
                  },
                }}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Translate Captions */}
            <Box display="flex" alignItems="center">
              <Typography sx={{ minWidth: "180px" }}>Translate Captions:</Typography>
              <Switch
                checked={userData.automate_translate}
                onChange={(e) => handleChange("automate_translate", e.target.checked)}
              />
            </Box>

            {/* Automate Speech */}
            <Box display="flex" alignItems="center">
              <Typography sx={{ minWidth: "180px" }}>Automate Speech:</Typography>
              <Switch
                checked={userData.automate_speech}
                onChange={(e) => handleChange("automate_speech", e.target.checked)}
              />
            </Box>

            {/* Speech Voice */}
            <Box display="flex" alignItems="center">
              <Typography sx={{ minWidth: "180px" }}>Speech Voice:</Typography>
              <RadioGroup
                row
                value={userData.speech_voice}
                onChange={(e) => handleChange("speech_voice", e.target.value)}
              >
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
              </RadioGroup>
            </Box>

            {/* Save Button */}
            <Box textAlign="center" mt={2}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: isDarkMode ? "#38BDF8" : "#2563EB",
                  px: 5,
                  py: 1.5,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: isDarkMode ? "#0ea5e9" : "#1e40af",
                  },
                }}
              >
                Save Settings
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Settings;
