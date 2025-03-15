import React, { useState } from "react";
import { db, ref, push, set } from "../firebase"; // ✅ Use Realtime Database functions
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    teamName: "",
    github: "",
    linkedin: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newMemberRef = push(ref(db, "team_members")); // Create a new child in the database
      await set(newMemberRef, formData); // Set data under the generated ID
      toast.success("Details submitted successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      }); // Use toast instead of alert
      setFormData({ name: "", teamName: "", github: "", linkedin: "" }); // Clear form
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error submitting details."); // Show error toast
    }
  };

  return (
    <div className="flex items-center gap-4 justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Team Member Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="teamName"
            placeholder="Team Name"
            value={formData.teamName}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            name="github"
            placeholder="GitHub Link"
            value={formData.github}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            name="linkedin"
            placeholder="LinkedIn Link"
            value={formData.linkedin}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white p-3 rounded-lg font-semibold"
          >
            Submit
          </button>
        </form>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </div>
    </div>
  );
}

export default Form;
