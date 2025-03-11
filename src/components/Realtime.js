// src/components/Realtime.js
import React, { useState, useEffect } from "react";

const Realtime = () => {
    // Initial 24-hour countdown (in seconds)
    const initialTime = 24 * 60 * 60;
    const [timeLeft, setTimeLeft] = useState(initialTime);

    const [tasks, setTasks] = useState([
        { title: "Previous Task", time: "10:00 AM" },
        { title: "Current Task", time: "12:00 PM" },
        { title: "Next Task", time: "2:00 PM" },
    ]);

    // Format time in HH:MM:SS
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsLeft = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
    };

    // Countdown logic
    useEffect(() => {
        if (timeLeft === 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [timeLeft]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-white">
            <h1 className="text-6xl">LIVE</h1>
            <div className="text-9xl mb-8 border-b-2 w-3/4 rounded-3xl p-12  border-blue-500 shadow-lg shadow-blue-500">
                {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center items-center w-[80%] space-x-12 m-4 mb-6">
                {/* Previous task */}
                <div className="flex-none text-center p-8 rounded-3xl text-xl border-2 opacity-50 w-1/4 shadow-lg shadow-gray-400">
                    <h2>{tasks[0].title}</h2>
                    <p>{tasks[0].time}</p>
                </div>

                {/* Current task in the center */}
                <div className="flex-grow text-center p-8 rounded-3xl text-3xl font-bold border-2 border-blue-500 shadow-lg shadow-blue-500 hover:scale-105 transition-all ease-in-out duration-0.3">
                    <h2>{tasks[1].title}</h2>
                    <p>{tasks[1].time}</p>
                </div>

                {/* Next task */}
                <div className="flex-none text-center p-8 rounded-3xl text-xl border-2 w-1/4 border-blue-700 shadow-lg shadow-blue-700 hover:scale-105 transition-all ease-in-out duration-0.3">
                    <h2>{tasks[2].title}</h2>
                    <p>{tasks[2].time}</p>
                </div>
            </div>

            <button className="border-2 p-3 m-2 rounded-3xl border-blue-500 hover:scale-105 transition-all ease-in-out duration-0.3">
                Show Timeline
            </button>
        </div>
    );
};
export default Realtime;
