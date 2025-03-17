import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import krisha from "../assets/coherence logo.png";
import Background from "./Background";
import { storage } from "../appwrite";
import { ID } from "../appwrite"; 
import { useNavigate } from "react-router-dom";

const PROJECT_ID = process.env.REACT_APP_APPWRITE_PROJECT_ID;
const BUCKET_ID = process.env.REACT_APP_APPWRITE_BUCKET_ID;


function TeamList() {
  const [teamData, setTeamData] = useState({}); // Store data in an object by team name
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate();

  useEffect(() => {
    const db = getDatabase(); // Get the database instance
    const teamRef = ref(db, "team_members"); // Reference to the 'team_members' node

    // Listen for changes in the 'team_members' section
    const unsubscribe = onValue(teamRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = {}; // Object to store teams and their members

        // Loop through each team and assign members under it
        Object.keys(data).forEach((teamName) => {
          formattedData[teamName] = Object.keys(data[teamName]).map((key) => ({
            id: key,
            ...data[teamName][key],
          }));
        });

        setTeamData(formattedData); // Set state with the formatted data
      } else {
        setTeamData({}); // Set empty object if no data found
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  // Function to generate Appwrite image URL
  const getAppwriteImageUrl = (fileId) => {
    return `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${fileId}/preview?project=${PROJECT_ID}`;
  };



  // Filter teams based on search term
  const filteredTeams = Object.keys(teamData).filter((teamName) =>
    teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGoHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <Background />
      <img src={krisha} alt="Coherence Logo" className="mb-2 w-2/3 md:w-1/3 z-50" />
      <h2 className="text-3xl font-bold mb-6">Happy Networking !</h2>
      <button
        onClick={handleGoHome}
        className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 bg-transparent border border-blue-500 rounded-full p-2 font-semibold shadow-lg hover:bg-blue-100 hover:scale-110 transition-all ease-in-out duration-300"
      >
        &#8592; Home
      </button>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by team name :3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        className="p-2 mb-6 rounded-3xl text-blue-300 border-2 border-blue-300/50 bg-transparent w-2/3 px-6"
      />

      <div className="w-full">
        {filteredTeams.length === 0 ? (
          <p className="text-lg text-center text-gray-400">No teams found.</p>
        ) : (
          filteredTeams.map((teamName) => (
            <div key={teamName} className="mb-8">
              <h3 className="text-2xl font-light mb-4">{teamName}</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
                {teamData[teamName].map((member) => (
                  <div
                    key={member.id}
                    className="backdrop-blur-sm border-2 border-blue-300 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 shadow-blue-400"
                  >
                    <div className="w-full h-[300px] overflow-hidden">
                      <img
                        className="w-full h-full object-cover p-3 rounded-3xl"
                        src={member.imageUrl ? getAppwriteImageUrl(member.imageUrl) : "https://placehold.co/241x178"}
                        alt={member.name}
                      />

                    </div>
                    <div className="p-4 flex flex-col justify-start items-start ">
                      <h3 className="text-xl mb-1">{member.name}</h3>
                      <div className="text-[#959393] text-sm">Team Name: {teamName}</div>
                      <div className="py-4 flex justify-start items-center gap-4">
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 rounded-lg text-3xl hover:text-blue-400 hover:scale-125 transition-all ease-in-out duration-300"
                        >
                          <i className="fa-brands fa-github"></i>
                        </a>
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 rounded-lg text-3xl hover:text-blue-400 hover:scale-125 transition-all ease-in-out duration-300"
                        >
                          <i className="fa-brands fa-linkedin"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TeamList;