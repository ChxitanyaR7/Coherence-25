import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import krisha from "../assets/coherence logo.png";
import Background from "./Background";
import { useNavigate } from "react-router-dom";

function Leaderboard() {
    const [teamData, setTeamData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAdminView, setIsAdminView] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const db = getDatabase();
        const teamRef = ref(db, "team_members");
        const leaderboardRef = ref(db, "team_leaderboard");

        const unsubscribeTeams = onValue(teamRef, (snapshot) => {
            if (snapshot.exists()) {
                const teamsData = snapshot.val();
                const teamNames = Object.keys(teamsData);
                
                
                const initialTeamData = teamNames.map(name => ({
                    name,
                    points: 0,
                    killPoints: 20,
                    playerPoints: 17
                }));
                
                setTeamData(initialTeamData);
            }
        });

        const unsubscribePoints = onValue(leaderboardRef, (snapshot) => {
            if (snapshot.exists()) {
                const pointsData = snapshot.val();
                
                setTeamData(prevData => {
                    return prevData.map(team => ({
                        ...team,
                        points: pointsData[team.name]?.points || 0
                    }));
                });
            }
        });

        return () => {
            unsubscribeTeams();
            unsubscribePoints();
        };
    }, []);

    
    const sortedTeams = [...teamData].sort((a, b) => b.points - a.points);
    
    
    const maxPoints = Math.max(...sortedTeams.map(team => team.points), 10);
    
    const filteredTeams = sortedTeams.filter(team => 
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const updatePointsInFirebase = (teamName, points) => {
        const db = getDatabase();
        const pointsRef = ref(db, `team_leaderboard/${teamName}`);
        
        const currentTeam = teamData.find(t => t.name === teamName);
        const currentPoints = currentTeam ? currentTeam.points : 0;

        update(pointsRef, { points: currentPoints + points });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleGoHome = () => {
        navigate("/");
    };

    const toggleView = () => {
        setIsAdminView(!isAdminView);
    };

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center">
            <Background />
            <img src={krisha} alt="Coherence Logo" className="mb-2 w-2/3 md:w-1/3 z-50" />
            
            <div className="flex justify-between items-center w-full md:w-3/4 mb-6">
                <button
                    onClick={handleGoHome}
                    className="text-blue-500 hover:text-blue-700 bg-transparent border border-blue-500 rounded-full p-2 font-semibold shadow-lg hover:bg-blue-100 hover:scale-110 transition-all ease-in-out duration-300"
                >
                    &#8592; Home
                </button>
                <h2 className="text-3xl font-bold text-center flex-grow">
                    <span className="inline-block mx-2">🏆</span> 
                    LEADERBOARD 
                    <span className="inline-block mx-2">🏆</span>
                </h2>
                <button
                    onClick={toggleView}
                    className="text-blue-500 hover:text-blue-700 bg-transparent border border-blue-500 rounded-full p-2 font-semibold shadow-lg hover:bg-blue-100 hover:scale-110 transition-all ease-in-out duration-300"
                >
                    {isAdminView ? "User View" : "Admin View"}
                </button>
            </div>

            {}
            <input
                type="text"
                placeholder="Search by team name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="p-2 mb-6 rounded-3xl text-blue-300 border-2 border-blue-300/50 bg-transparent w-2/3 px-6"
            />

            {isAdminView ? (
                
                <div className="w-full md:w-3/4">
                    {filteredTeams.length === 0 ? (
                        <p className="text-lg text-center text-gray-400">No teams found.</p>
                    ) : (
                        <div>
                            <h3 className="text-2xl font-light mb-4">Teams</h3>
                            <ul className="space-y-4">
                                {filteredTeams.map((team) => (
                                    <li key={team.name} className="backdrop-blur-sm border-2 border-blue-300 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 shadow-blue-400 p-4">
                                        <h3 className="text-xl mb-1">{team.name}</h3>
                                        <p className="text-lg mb-4">Points: {team.points}</p>

                                        {}
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => updatePointsInFirebase(team.name, 5)}
                                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                                            >
                                                Add 5 Points
                                            </button>
                                            <button
                                                onClick={() => updatePointsInFirebase(team.name, 10)}
                                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                                            >
                                                Add 10 Points
                                            </button>
                                            <button
                                                onClick={() => updatePointsInFirebase(team.name, 20)}
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
            ) : (
        
                <div className="w-full md:w-3/4 bg-blue-900/80 rounded-xl p-6 backdrop-blur-md border border-blue-400/30 shadow-xl">
                    {}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-sm md:text-base font-bold text-blue-200 border-b-2 border-blue-400 pb-2">
                        <div>RANKING</div>
                        <div>TEAM</div>
                        <div className="text-center">POINTS</div>
                    </div>

                    {filteredTeams.length === 0 ? (
                        <p className="text-lg text-center text-blue-200 py-8">No teams found.</p>
                    ) : (
                        filteredTeams.map((team, index) => (
                            <div 
                                key={team.name}
                                className="grid grid-cols-3 gap-2 items-center py-3 border-b border-blue-500/30 relative group hover:bg-blue-800/40 transition-all duration-300"
                            >
                                {/* Rank */}
                                <div className="flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold shadow-md">
                                        {index + 1}
                                    </div>
                                </div>
                                
                                {}
                                <div className="font-semibold text-white">{team.name}</div>
                                
                                {}
                                <div className="text-center relative">
                                    <div className="flex items-center h-8">
                                        <div 
                                            className="absolute left-0 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded-sm z-0 transition-all duration-500"
                                            style={{ width: `${Math.max((team.points / maxPoints) * 100, 5)}%` }}
                                        ></div>
                                        <span className="relative z-10 w-full text-white font-bold">{team.points}</span>
                                    </div>
                                </div>
                                
                                {}
                                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 bg-blue-950 p-3 rounded-lg shadow-xl z-50 transition-all duration-300 pointer-events-none w-48">
                                    <h4 className="font-bold text-lg mb-2 text-blue-200">{team.name}</h4>
                                    <div className="grid grid-cols-2 gap-1 text-sm">
                                        <div className="text-blue-300">Total Points:</div>
                                        <div className="text-white font-bold">{team.points}</div>
                                        {}
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