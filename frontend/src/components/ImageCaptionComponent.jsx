import React from "react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ImageCaptionComponent = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleRedirection = (route) => {
    navigate(route);
  };

  return (
    <div
      className={`w-full min-h-screen fixed top-16 left-0 px-4 flex items-center justify-center ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="text-center max-w-4xl w-full">
        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold mb-4"
        >
          Image Caption Generator
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-lg md:text-xl text-gray-400 mb-8"
        >
          Generate intelligent captions or train your model in seconds.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
        >
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105" onClick={() => handleRedirection('/generate_caption')}>
            Generate Caption
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105" onClick={() => handleRedirection('/caption_train')}>
            Train Caption
          </button>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 - Features Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className={`p-6 rounded-lg border shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
          >
            <h3 className="text-2xl font-bold mb-2">Powerful Features</h3>
            <p className="text-sm leading-relaxed">
              This app uses deep learning to generate human-like captions for images.
              Easily train your own model, generate creative descriptions, and
              enhance accessibility with just a click.
            </p>
          </motion.div>

          {/* Card 2 - Feedback Invitation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className={`p-6 rounded-lg border shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
          >
            <h3 className="text-2xl font-bold mb-2">We Value Your Feedback</h3>
            <p className="text-sm leading-relaxed">
              Loved using the app? Want to explore more? Visit the features section
              to learn everything this app can do — and don’t forget to leave your
              valuable feedback to help us improve!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ImageCaptionComponent;
