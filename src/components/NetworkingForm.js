import { useEffect, useState } from "react";
import { getDatabase, ref, set, push, get } from "firebase/database";
import { useNavigate } from "react-router-dom"; 
import coherencelogo from "../assets/coherence logo.png";
import Background from "./Background";
import { storage, uploadFile } from "../appwrite"; // Appwrite setup file

const db = getDatabase(); // Get the database instance

const addTeamName = (teamName) => {
  const teamNamesRef = ref(db, 'team_names');
  const newTeamRef = push(teamNamesRef); 

  set(newTeamRef, teamName)
    .then(() => {
      console.log(`${teamName} added successfully.`);
    })
    .catch((error) => {
      console.error("Error adding team name: ", error);
    });
};

// addTeamName("Team Gamma");

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    teamName: "",
    github: "",
    linkedin: "",
    imageUrl: ""
  });

  const [teamNames, setTeamNames] = useState([]); // State to store team names
  const [imageFile, setImageFile] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false); 

  const navigate = useNavigate(); 

  useEffect(() => {
    // Check if the user has already submitted using local storage
    if (localStorage.getItem("formSubmitted") === "true") {
      setAlreadySubmitted(true);
    }

    // Fetch team names from the database when the component mounts
    const fetchTeamNames = async () => {
      try {
        const teamNamesRef = ref(db, "team_names"); 
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

  // Handle image file change
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // url validation regex
  const githubRegex = /^https:\/\/github\.com\/[A-Za-z0-9_-]+\/?$/;
  const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/;

  const validateUrls = () => {
    // Validate GitHub URL
    if (formData.github && !githubRegex.test(formData.github)) {
      alert("Please enter a valid GitHub URL (e.g., https://github.com/username).");
      return false;
    }
    
    // Validate LinkedIn URL
    if (formData.linkedin && !linkedinRegex.test(formData.linkedin)) {
      alert("Please enter a valid LinkedIn URL (e.g., https://www.linkedin.com/in/username).");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if the user has already submitted by checking localStorage
    if (localStorage.getItem("formSubmitted") === "true") {
      alert("You have already submitted your details.");
      return; 
    }
  
    if (!validateUrls()) {
      return; 
    }
  
    try {
      let uploadedImageUrl = "";
      if (imageFile) {
        uploadedImageUrl = await uploadFile(imageFile); 
      }
  
      // Reference to the selected team name in the database
      const teamRef = ref(db, `team_members/${formData.teamName}`);
  
      // Get the current team members
      const snapshot = await get(teamRef);
      if (snapshot.exists()) {
        const teamMembers = Object.values(snapshot.val());
        
        // Check if the team has less than 4 members
        if (teamMembers.length >= 4) {
          alert("Each team can only have a maximum of 4 members.");
          return; // Prevent submission if the team already has 4 members
        }
      }
  
      // Push the form data under the selected team
      const newMemberRef = push(teamRef); // Create a new child under the selected team name
      await set(newMemberRef, {
        name: formData.name,
        github: formData.github,
        linkedin: formData.linkedin,
        imageUrl: uploadedImageUrl
      }); // Set member data under the generated ID
  
      // Mark the form as submitted in localStorage
      localStorage.setItem("formSubmitted", "true");
  
      alert("Details submitted successfully!");
  
      // Redirect to the /networking-list route after successful form submission
      navigate("/networking-list");
  
      setFormData({ name: "", teamName: "", github: "", linkedin: "", imageUrl: "" }); 
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleGoHome = () => {
    navigate("/"); 
  };

  return (
    <div className="flex flex-col items-center gap-4 justify-center min-h-screen bg-gray-900 text-white">
      <Background />
      <img src={coherencelogo} alt="Coherence Logo" className="mb-2 w-2/3 md:w-1/3 z-50" />
      <div className="bg-slate-100/5 backdrop-blur-sm p-8 rounded-3xl border-4 border-blue-700 shadow-lg shadow-blue-500 w-full max-w-sm">
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
          <input type="file" accept="image/*" onChange={handleImageChange} required className="w-full p-3 rounded-3xl bg-transparent border-2 border-blue-200" />
          <button
            type="submit"
            className="w-full rounded-3xl bg-blue-800 hover:bg-transparent hover:border-4 border-blue-500 hover:p-2 transition-all text-white p-3 font-semibold"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Small button on top left for "Back to Home" */}
      <button
        onClick={handleGoHome}
        className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 bg-transparent border border-blue-500 rounded-full p-2 font-semibold shadow-lg hover:bg-blue-100 hover:scale-110 transition-all ease-in-out duration-300"
      >
        &#8592; Home
      </button>
    </div>
  );
}

export default Form;