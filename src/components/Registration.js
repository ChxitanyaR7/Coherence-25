import React, { useState, useEffect } from "react";
import registerImage from "../assets/hackathon-2.jpeg"; // Replace with the actual path to your image

const Register = () => {
  const [isButtonsEnabled, setButtonsEnabled] = useState(false);

  const handleRegistrationClick = () => {
    window.location.href = "https://www.google.com"; // Replace with your actual registration link
  };

  const handleProblemStatementClick = () => {
    window.location.href = "https://www.example.com/problem-statement"; // Replace with your actual problem statement link
  };

  const handleConsentFormClick = () => {
    window.location.href = "https://www.example.com/consent-form"; // Replace with your actual consent form link
  };

  const areConditionsMet = () => {
    // Add your conditions for enabling/disabling buttons
    return true; // Example: always enable buttons
  };

  useEffect(() => {
    setButtonsEnabled(areConditionsMet());
  }, []);

  return (
    <div className="flex p-8">
      {/* Left Side: Smaller Image */}
      <div className="w-1/3">
        <img className="w-full h-auto" src={registerImage} alt="Registration" />
      </div>

      {/* Right Side: Content */}
      <div className="w-2/3 p-8">
        <h2 className="text-3xl font-bold mb-4 text-white">Register for Codefest</h2>
        {/* Add your registration form and other content here */}
        <p className="text-white">
          Explore exciting problem statements, showcase your skills, and be part of an amazing coding experience!
        </p>
        {/* Add your registration form and other content here */}
        <div className="mt-4">
          {/* Register Button */}
          <button
            onClick={handleRegistrationClick}
            className={`bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full ${
              isButtonsEnabled ? "" : "opacity-50 cursor-not-allowed"
            } mb-4`}
            disabled={!isButtonsEnabled}
          >
            Register Now
          </button>

          {/* Other Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleProblemStatementClick}
              className={`bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full ${
                isButtonsEnabled ? "" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!isButtonsEnabled}
            >
              Problem Statements
            </button>
            <button
              onClick={handleConsentFormClick}
              className={`bg-yellow-500 hover:bg-yellow-400 text-purple-800 font-bold py-2 px-4 rounded-full ${
                isButtonsEnabled ? "" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!isButtonsEnabled}
            >
              Consent Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
