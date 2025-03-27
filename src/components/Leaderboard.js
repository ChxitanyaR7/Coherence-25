import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import krisha from "../assets/coherence logo.png";
import Background from "./Background";
import { useNavigate } from "react-router-dom";

function Leaderboard() {
    const [teamNames, setTeamNames] = useState([]);
    const [teamPoints, setTeamPoints] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);  // Track loading state
    const navigate = useNavigate();

    useEffect(() => {
        const db = getDatabase();
        const teamNamesRef = ref(db, "team_names"); // No change here; we keep the same reference
    
        const pointsRef = ref(db, "team_leaderboard");
    
        const unsubscribeTeams = onValue(teamNamesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedTeamNames = Object.keys(data).map((key) => data[key].name); // Extracting the 'name' property
    
                setTeamNames(formattedTeamNames); // Setting the team names in state
            } else {
                setTeamNames([]); // If no teams are found
            }
        });
    
        const unsubscribePoints = onValue(pointsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedTeamPoints = {};
    
                Object.keys(data).forEach((teamName) => {
                    formattedTeamPoints[teamName] = data[teamName]?.points || 0;
                });
    
                teamNames.forEach((teamName) => {
                    if (!formattedTeamPoints[teamName]) {
                        formattedTeamPoints[teamName] = 0;
                    }
                });
    
                setTeamPoints(formattedTeamPoints);
            } else {
                const initialPoints = {};
                teamNames.forEach((teamName) => {
                    initialPoints[teamName] = 0;
                });
                setTeamPoints(initialPoints);
            }
    
            // Set loading to false after the data is fetched
            setLoading(false);
        });
    
        return () => {
            unsubscribeTeams();
            unsubscribePoints();
        };
    }, [teamNames]); // The dependency on `teamNames` remains the same
    

    const filteredTeams = teamNames.filter((teamName) =>
        teamName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedTeams = filteredTeams.sort((a, b) => (teamPoints[b] || 0) - (teamPoints[a] || 0));

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleGoHome = () => {
        navigate("/");
    };

    const maxPoints = Math.max(...Object.values(teamPoints), 1); // Get the maximum points, ensuring a minimum of 1


    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center">
            <Background />
            <button
                onClick={handleGoHome}
                className=" absolute top-4 left-2 md:top-6 md:left-10 scale-75 md:scale-100 text-blue-500 hover:text-blue-700 bg-transparent border-2 border-blue-500 rounded-full p-2 font-bold shadow-lg hover:bg-blue-100 hover:scale-110 transition-all ease-in-out duration-300">
                &#8592; Home
            </button>
            <img src={krisha} alt="Coherence Logo" className="mb-2 w-2/3 md:w-1/3 z-50 mt-10 md:mt-none" />
            <div className="flex justify-between items-center w-full md:w-3/4 mb-6">

                <h2 className="text-xl md:text-3xl font-bold text-center flex-grow">
                    <span className="inline-block mx-2">🏆</span>
                    LEADERBOARD
                    <span className="inline-block mx-2">🏆</span>
                </h2>
            </div>

            <input
                type="text"
                placeholder="Search by team name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="p-2 mb-6 rounded-3xl text-blue-300 border-2 border-blue-300/50 bg-transparent w-full md:w-2/3 px-6"
            />

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-lg text-blue-200 mt-4">Loading...</p>
                </div>
            ) : (
                <div className="w-full md:w-3/4 backdrop-blur-sm bg-blue-900/15 rounded-xl p-6 border border-blue-400/30 shadow-xl">
                    <div className="grid grid-cols-3 gap-2 mb-4 text-sm md:text-base font-bold text-blue-200 border-b-2 border-blue-400 pb-2">
                        <div>RANKING</div>
                        <div>TEAM</div>
                        <div className="text-center">POINTS</div>
                    </div>

                    {sortedTeams.length === 0 ? (
                        <p className="text-lg text-center text-blue-200 py-8">No teams found.</p>
                    ) : (
                        sortedTeams.map((teamName, index) => (
                            <div
                                key={teamName}
                                className="grid grid-cols-3 gap-0 items-center py-3 border-b border-blue-500/30 relative group hover:bg-blue-900 rounded-3xl transition-all duration-300"
                            >
                                {/* Rank */}
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-6 h-6 text-sm md:w-8 md:h-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold shadow-md">
                                        {index + 1}
                                    </div>
                                </div>

                                {/* Team Name */}
                                <div className="text-sm md:text-xl md:font-semibold text-white">{teamName}</div>

                                {/* Points */}
                                <div className="text-center relative scale-75 md:scale-100 p-2">
                                    <div className="flex items-center h-8">
                                        <div
                                            className="absolute left-0 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded-sm z-0 transition-all duration-500"
                                            style={{ width: `${Math.max((teamPoints[teamName] / maxPoints) * 100, 5)}%` }} // Use maxPoints here
                                        ></div>
                                        <span className="relative z-10 w-full text-white font-bold">
                                            {teamPoints[teamName] || 0}
                                        </span>
                                    </div>
                                </div>

                                {/* Hover details */}
                                <div className="absolute left-1/3 md:left-2/3 opacity-0 group-hover:opacity-100 bg-blue-950 p-3 rounded-lg shadow-xl z-50 transition-all duration-300 pointer-events-none w-48">
                                    <h4 className="font-bold text-lg mb-2 text-blue-200">{teamName}</h4>
                                    <div className="grid grid-cols-2 gap-1 text-sm">
                                        <div className="text-blue-300">Total Points:</div>
                                        <div className="text-white font-bold">{teamPoints[teamName] || 0}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Leaderboard;