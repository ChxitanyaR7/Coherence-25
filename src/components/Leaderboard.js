import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import krisha from "../assets/coherence logo.png";
import Background from "./Background";
import { useNavigate } from "react-router-dom";

function Leaderboard() {
    const [teamNames, setTeamNames] = useState([]); // State to store the team names
    const [teamPoints, setTeamPoints] = useState({}); // State to store points for each team
    const [searchTerm, setSearchTerm] = useState(""); // State for the search term
    const navigate = useNavigate();

    useEffect(() => {
        const db = getDatabase(); // Get the database instance
        const teamRef = ref(db, "team_members"); // Reference to the 'team_members' node

        // Listen for changes in the 'team_members' section
        const unsubscribe = onValue(teamRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedTeamNames = Object.keys(data); // Extract team names
                setTeamNames(formattedTeamNames); // Set state with the team names

                // Initialize points for each team
                const pointsData = {};
                formattedTeamNames.forEach((teamName) => {
                    pointsData[teamName] = 0; // Initial points set to 0
                });
                setTeamPoints(pointsData); // Set the initial points
            } else {
                setTeamNames([]); // Set empty array if no data found
            }
        });

        return () => unsubscribe(); // Cleanup the listener on component unmount
    }, []);

    // Filter the team names based on the search term
    const filteredTeams = teamNames.filter((teamName) =>
        teamName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to update points in Firebase
    const updatePointsInFirebase = (teamName, points) => {
        const db = getDatabase();
        const pointsRef = ref(db, `team_leaderboard/${teamName}`);

        // Update the points for the specific team in Firebase
        update(pointsRef, { points: teamPoints[teamName] + points }).then(() => {
            // Update the local state after the Firebase update
            setTeamPoints((prevPoints) => ({
                ...prevPoints,
                [teamName]: prevPoints[teamName] + points,
            }));
        });
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleGoHome = () => {
        navigate("/"); // Navigate to the home page
    };

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center">
            <Background />
            <img src={krisha} alt="Coherence Logo" className="mb-2 w-2/3 md:w-1/3 z-50" />
            <h2 className="text-3xl font-bold mb-6">Leaderboard</h2>
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
                onChange={handleSearchChange} // Update search term on input change
                className="p-2 mb-6 rounded-3xl text-blue-300 border-2 border-blue-300/50 bg-transparent w-2/3 px-6"
            />

            <div className="w-full">
                {filteredTeams.length === 0 ? (
                    <p className="text-lg text-center text-gray-400">No teams found.</p>
                ) : (
                    <div>
                        <h3 className="text-2xl font-light mb-4">Teams</h3>
                        <ul className="space-y-4">
                            {filteredTeams.map((teamName) => (
                                <li key={teamName} className="backdrop-blur-sm border-2 border-blue-300 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 shadow-blue-400 p-4">
                                    <h3 className="text-xl mb-1">{teamName}</h3>
                                    <p className="text-lg mb-4">Points: {teamPoints[teamName]}</p>

                                    {/* Buttons to add points */}
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => updatePointsInFirebase(teamName, 5)}
                                            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                                        >
                                            Add 5 Points
                                        </button>
                                        <button
                                            onClick={() => updatePointsInFirebase(teamName, 10)}
                                            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                                        >
                                            Add 10 Points
                                        </button>
                                        <button
                                            onClick={() => updatePointsInFirebase(teamName, 20)}
                                            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                                        >
                                            Add 20 Points
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Leaderboard;
