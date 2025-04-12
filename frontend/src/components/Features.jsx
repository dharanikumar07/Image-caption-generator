import React from "react";
import { useTheme } from "../context/ThemeContext";

const features = [
  {
    title: "Generate Captions",
    points: [
      "Uploads are analyzed using deep learning.",
      "Automatically generates descriptive captions.",
      "Works for various image types like landscapes or objects.",
      "Delivers real-time, context-aware results.",
    ],
  },
  {
    title: "Manual Caption Training",
    points: [
      "Users can upload their own images and captions.",
      "Improves model accuracy over time.",
      "Helps adapt the model to real-world usage.",
      "Empowers users to personalize results.",
    ],
  },
  {
    title: "Translate Captions",
    points: [
      "Captions can be translated into multiple languages.",
      "Supports a wide variety of global languages.",
      "Ideal for accessibility and localization.",
      "Enhances reach and usability for diverse users.",
    ],
  },
  {
    title: "Speech for Captions",
    points: [
      "Convert captions into spoken audio.",
      "Supports voice in the user's preferred language.",
      "Great for visually impaired users.",
      "Creates a more interactive experience.",
    ],
  },
];

const Features = () => {
  const { isDarkMode } = useTheme();

  const headingColor = isDarkMode ? "#38BDF8" : "#2563EB"; // Light: blue-600, Dark: sky-400

  return (
    <section
      className={`py-16 px-6 md:px-20 absolute top-6 left-0 w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h2
        className="text-4xl font-bold text-center mb-12"
        style={{ color: headingColor }}
      >
        Our Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`rounded-2xl p-6 shadow-lg transition duration-300 transform hover:shadow-2xl hover:scale-[1.02] ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className="text-2xl font-semibold mb-4"
              style={{ color: headingColor }}
            >
              {feature.title}
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-left text-sm md:text-base">
              {feature.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
