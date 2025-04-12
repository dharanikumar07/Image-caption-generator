import React, { useState } from "react";
import axios from "axios";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { showError, showSuccess } from "../helpers/ToastHelper";

function CaptionTrain() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const token = localStorage.getItem("icg_authToken");

  // Handle image and caption submission to /train API
  const handleTrain = async () => {
    if (!image || !caption) {
      return showError("Please upload an image and provide a caption.");
    }

    setIsTraining(true);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", caption);

      // Hit the /train API endpoint
      const trainRes = await axios.post("http://localhost:5000/train", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // If training is successful
      showSuccess("Caption Trained Sucessfully");

      // Reset the form fields after training
      setImage(null);
      setCaption("");
      setImagePreview(null);
      
      // Reset the file input (this is important to fully clear the image preview)
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";  // Clear the input field

    } catch (err) {
      console.error("Training failed:", err);
      showError("Training failed");
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } w-full absolute top-0 left-0 min-h-screen flex items-start justify-center transition-all`}
    >
      <div className="max-w-3xl w-full p-6 flex flex-col items-center">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Caption Training</h1>&nbsp;&nbsp;&nbsp;
          <button
            onClick={toggleTheme}
            className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
          >
            {isDarkMode ? <FaMoon /> : <FaSun />}
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
          }}
          className="mb-4 w-full file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-64 w-auto rounded-lg mb-4 border border-gray-300 object-contain"
          />
        )}

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Enter Caption"
          className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} w-full p-4 border rounded-md mb-4 resize-none h-32`}
        />

        <button
          onClick={handleTrain}
          disabled={isTraining}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {isTraining ? "Training..." : "Train Model"}
        </button>
      </div>
    </div>
  );
}

export default CaptionTrain;
