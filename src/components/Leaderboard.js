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
        const pointsRef = ref(db, "team_leaderboard"); // Reference to the 'team_leaderboard' node to get points
    
        // Listen for changes in the 'team_members' section (team names)
        const unsubscribeTeams = onValue(teamRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedTeamNames = Object.keys(data); // Extract team names
                setTeamNames(formattedTeamNames); // Set state with the team names
            } else {
                setTeamNames([]); // Set empty array if no data found
            }
        });
    
        // Listen for changes in the 'team_leaderboard' section (team points)
        const unsubscribePoints = onValue(pointsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedTeamPoints = {};
    
                // Initialize points for teams that don't have points yet
                Object.keys(data).forEach((teamName) => {
                    formattedTeamPoints[teamName] = data[teamName]?.points || 0;
                });
    
                // Add teams without points to the state with points initialized to 0
                teamNames.forEach((teamName) => {
                    if (!formattedTeamPoints[teamName]) {
                        formattedTeamPoints[teamName] = 0;
                    }
                });
    
                setTeamPoints(formattedTeamPoints); // Set state with the team points
            } else {
                const initialPoints = {};
                teamNames.forEach((teamName) => {
                    initialPoints[teamName] = 0; // Set all points to 0 if no data
                });
                setTeamPoints(initialPoints);
            }
        });
    
        return () => {
            unsubscribeTeams();
            unsubscribePoints();
        }; // Cleanup the listeners on component unmount
    }, [teamNames]); // Run this effect whenever `teamNames` changes
    

    // Filter the team names based on the search term
    const filteredTeams = teamNames.filter((teamName) =>
        teamName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort the filtered teams in descending order based on their points
    const sortedTeams = filteredTeams.sort((a, b) => (teamPoints[b] || 0) - (teamPoints[a] || 0));

    // Function to update points in Firebase
    const updatePointsInFirebase = (teamName, pointsToAdd) => {
        const db = getDatabase();
        const pointsRef = ref(db, `team_leaderboard/${teamName}`);
    
        // Make sure the points are valid numbers
        const currentPoints = teamPoints[teamName] || 0;
        const newPoints = currentPoints + pointsToAdd;
    
        if (isNaN(newPoints)) {
            console.error("Invalid points value:", newPoints);
            return;
        }
    
        // Update the points for the specific team in Firebase
        update(pointsRef, { points: newPoints }).then(() => {
            // Update the local state after the Firebase update
            setTeamPoints((prevPoints) => ({
                ...prevPoints,
                [teamName]: newPoints,
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
        <div className="p-6 pt-20 bg-gray-900 text-white min-h-screen flex flex-col items-center">
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
                className="p-2 mb-6 rounded-3xl text-blue-300 border-2 border-blue-300/50 bg-transparent w-full md:w-2/3 px-6"
            />

            <div className="w-full">
                {sortedTeams.length === 0 ? (
                    <p className="text-lg text-center text-gray-400">No teams found.</p>
                ) : (
                    <div>
                        <h3 className="text-2xl font-light mb-4">Teams</h3>
                        <ul className="space-y-4 mx-auto ">
                            {sortedTeams.map((teamName) => (
                                <li key={teamName} className="backdrop-blur-sm border-2 flex flex-col md:flex-row justify-between border-blue-300 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 shadow-blue-400 p-4">
                                    <div className="flex flex-row space-x-12">
                                        <h3 className="text-xl mb-1 text-blue-200">{teamName}</h3>
                                        <p className="text-lg mb-4">Points: {teamPoints[teamName] || 0}</p>
                                    </div>
                                    {/* Buttons to add points */}
                                    <div className="flex space-4 space-x-0 space-y-2 md:space-x-2 md:space-y-0 flex-col md:flex-row">
                                        <button
                                            onClick={() => updatePointsInFirebase(teamName, 5)}
                                            className="bg-blue-900 text-white p-2 rounded-3xl hover:bg-blue-400 border-2 border-blue-400 transition duration-200"
                                        >
                                            Add 5 Points
                                        </button>
                                        <button
                                            onClick={() => updatePointsInFirebase(teamName, 10)}
                                            className="bg-blue-900 text-white p-2 rounded-3xl hover:bg-blue-400 border-2 border-blue-400 transition duration-200"
                                        >
                                            Add 10 Points
                                        </button>
                                        <button
                                            onClick={() => updatePointsInFirebase(teamName, 20)}
                                            className="bg-blue-900 text-white p-2 rounded-3xl hover:bg-blue-400 border-2 border-blue-400 transition duration-200"
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
