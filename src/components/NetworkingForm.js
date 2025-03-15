import { getDatabase, ref, set, push, get } from "firebase/database";
import { useEffect, useState } from "react";
import coherencelogo from "../assets/coherence logo.png";
import Background from "./Background";

const db = getDatabase(); // Get the database instance

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    teamName: "",
    github: "",
    linkedin: "",
  });

  const [teamNames, setTeamNames] = useState([]); // State to store team names

  useEffect(() => {
    // Fetch team names from the database when the component mounts
    const fetchTeamNames = async () => {
      try {
        const teamNamesRef = ref(db, "team_names"); // Assuming your team names are stored under 'team_names'
        const snapshot = await get(teamNamesRef);
        if (snapshot.exists()) {
          const names = Object.values(snapshot.val()); // Convert the object to an array of team names
          setTeamNames(names); // Update state with team names
        } else {
          console.log("No team names found in the database.");
        }
      } catch (error) {
        console.error("Error fetching team names: ", error);
      }
    };

    fetchTeamNames();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newMemberRef = push(ref(db, "team_members")); // Create a new child in the database
      await set(newMemberRef, formData); // Set data under the generated ID
      alert("Details submitted successfully!");
      setFormData({ name: "", teamName: "", github: "", linkedin: "" }); // Clear form
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error submitting details."); // Show error toast
    }
  };

  return (
    <div className="flex items-center gap-4 justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Team Member Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-3xl bg-transparent border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          
          <select
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-3xl bg-transparent border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-700"
          >
            <option value="" disabled>Select Team Name</option>
            {teamNames.map((team, index) => (
              <option key={index} value={team} className="bg-blue-950 border-2 border-blue-950">
                {team}
              </option>
            ))}
          </select>
          <input
            type="url"
            name="github"
            placeholder="GitHub Link"
            value={formData.github}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-3xl bg-transparent border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          <input
            type="url"
            name="linkedin"
            placeholder="LinkedIn Link"
            value={formData.linkedin}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-3xl bg-transparent border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          <button
            type="submit"
            className="w-full rounded-3xl bg-blue-800 hover:bg-transparent hover:border-4 border-blue-500 hover:p-2 transition-all text-white p-3 font-semibold"
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
