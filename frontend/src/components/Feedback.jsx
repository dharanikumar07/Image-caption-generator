import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { TextField, Button, Rating } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import axios from "axios";

const Feedback = () => {
  const { isDarkMode } = useTheme();
  const [responses, setResponses] = useState({
    captionQuality: 0,
    trainingEase: 0,
    translationAccuracy: 0,
    speechClarity: 0,
    comment: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (name, value) => {
    setResponses((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/feedback", responses);
      setSubmitted(true);
      setResponses({
        captionQuality: 0,
        trainingEase: 0,
        translationAccuracy: 0,
        speechClarity: 0,
        comment: "",
      });
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Something went wrong.");
    }
  };

  const starProps = {
    size: "large",
    emptyIcon: (
      <StarBorderIcon
        style={{ color: isDarkMode ? "#ffffff" : "#000000", opacity: 0.6 }}
        fontSize="inherit"
      />
    ),
    sx: {
      color: isDarkMode ? "#38BDF8" : "#2563EB",
    },
  };

  return (
    <section
      className={`py-16 px-6 md:px-20 flex flex-col items-center absolute top-2 left-0 w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h2
        className="text-4xl font-bold mb-6"
        style={{ color: isDarkMode ? "#38BDF8" : "#2563EB" }}
      >
        Share Your Feedback!
      </h2>
      <p className="text-base mb-6 text-center text-gray-400 dark:text-gray-300">
  Help us improve your experience by rating the features you used.
</p>

      {submitted ? (
        <p className="text-lg text-green-500">Thanks for your feedback! 🎉</p>
      ) : (
        <div
          className={`w-full md:w-2/3 p-6 rounded-2xl shadow-md ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Question 1 */}
          <div className="mb-4">
            <p className="font-medium mb-1">How would you rate the caption quality?</p>
            <Rating
              value={responses.captionQuality}
              onChange={(e, val) => handleChange("captionQuality", val)}
              {...starProps}
            />
          </div>

          {/* Question 2 */}
          <div className="mb-4">
            <p className="font-medium mb-1">Was manual training easy to use?</p>
            <Rating
              value={responses.trainingEase}
              onChange={(e, val) => handleChange("trainingEase", val)}
              {...starProps}
            />
          </div>

          {/* Question 3 */}
          <div className="mb-4">
            <p className="font-medium mb-1">How accurate was the translation feature?</p>
            <Rating
              value={responses.translationAccuracy}
              onChange={(e, val) => handleChange("translationAccuracy", val)}
              {...starProps}
            />
          </div>

          {/* Question 4 */}
          <div className="mb-6">
            <p className="font-medium mb-1">How clear was the speech output?</p>
            <Rating
              value={responses.speechClarity}
              onChange={(e, val) => handleChange("speechClarity", val)}
              {...starProps}
            />
          </div>

          {/* Comment Box */}
          <TextField
            label="Leave a comment (optional)"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={responses.comment}
            onChange={(e) => handleChange("comment", e.target.value)}
            className="mb-6"
            sx={{
              input: { color: isDarkMode ? "#fff" : "#000" },
              textarea: { color: isDarkMode ? "#fff" : "#000" },
              label: { color: isDarkMode ? "#ccc" : "#333" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: isDarkMode ? "#ccc" : "#aaa",
                },
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              backgroundColor: isDarkMode ? "#38BDF8" : "#2563EB",
              "&:hover": {
                backgroundColor: isDarkMode ? "#0ea5e9" : "#1e40af",
              },
            }}
          >
            Submit Feedback
          </Button>
        </div>
      )}
    </section>
  );
};

export default Feedback;
