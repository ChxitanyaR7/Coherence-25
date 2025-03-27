import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AdminCombinedRoutes = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleNavigate = (path) => {
        navigate(path); // Navigate to the desired path
    };

    return (
        <div className="admin-routes p-4 md:p-8 text-center min-h-screen flex flex-col justify-center items-center w-full">
            <button
                onClick={() => handleNavigate(`/realtime/${process.env.REACT_APP_SSH_PASSWORD}`)}
                className="z-50 text-sm md:text-md mb-4 text-blue-500 hover:text-blue-700 bg-transparent border border-blue-500 rounded-full p-2 font-semibold shadow-lg hover:bg-blue-100 hover:scale-110 transition-all ease-in-out duration-300"
            >
                Realtime Update
            </button>

            <button
                onClick={() => handleNavigate("/networking-list")}
                className="z-50 text-sm md:text-md mb-4 text-blue-500 hover:text-blue-700 bg-transparent border border-blue-500 rounded-full p-2 font-semibold shadow-lg hover:bg-blue-100 hover:scale-110 transition-all ease-in-out duration-300"
            >
                Team List
            </button>

            <button
                onClick={() => handleNavigate(`/leaderboard/${process.env.REACT_APP_SSH_PASSWORD}`)}
                className="z-50 text-sm md:text-md mb-4 text-blue-500 hover:text-blue-700 bg-transparent border border-blue-500 rounded-full p-2 font-semibold shadow-lg hover:bg-blue-100 hover:scale-110 transition-all ease-in-out duration-300"
            >
                Leaderboard
            </button>
        </div>
    );
};

export default AdminCombinedRoutes;
