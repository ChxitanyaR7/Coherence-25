import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, push } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase"; 

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const RealtimeUpdate = () => {
    const initialTime = 24 * 60 * 60;
    const [timeLeft, setTimeLeft] = useState(initialTime);

    const [tasks, setTasks] = useState([
        { id: 1, title: "Reporting and Registration", time: "12:00 PM" },
        { id: 2, title: "Inauguration", time: "1:00 PM" },
        { id: 3, title: "Coding Begins", time: "2:00 PM" },
        { id: 4, title: "Mentoring Round 1 Starts", time: "4:30 PM" },
        { id: 5, title: "Evening Snacks", time: "5:00 PM" },
        { id: 6, title: "Mentoring Round 2 Starts", time: "8:00 PM" },
        { id: 7, title: "Dinner Break", time: "9:00 PM" },
        { id: 8, title: "Midnight Snacks", time: "12:00 AM" },
        { id: 9, title: "Breakfast", time: "9:00 AM" },
        { id: 10, title: "Lunch", time: "12:00 PM" },
        { id: 11, title: "Coding Ends", time: "2:00 PM" },
        { id: 12, title: "Final Presentation", time: "3:00 PM" },
        { id: 13, title: "Result Announcement and Distribution", time: "5:00 PM" },
        { id: 14, title: "Dispersal", time: "6:00 PM" }
    ]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsLeft = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
    };

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
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const handleEditTime = (id) => {
        const newTime = prompt("Enter new time (HH:MM AM/PM):");
        if (newTime) {
            const updatedTasks = tasks.map(task =>
                task.id === id ? { ...task, time: newTime } : task
            );
            setTasks(updatedTasks);
        }
    };

    // Function to handle adding a new task to Firebase
    const handleAddTask = () => {
        const taskTitle = prompt("Enter task title:");
        const taskTime = prompt("Enter task time (HH:MM AM/PM):");

        if (taskTitle && taskTime) {
            const newTask = {
                title: taskTitle,
                time: taskTime
            };

            // Push to Firebase Realtime Database
            const tasksRef = ref(db, 'tasks');
            const newTaskRef = push(tasksRef);
            set(newTaskRef, newTask);

            
            setTasks((prevTasks) => [
                ...prevTasks,
                { id: newTaskRef.key, ...newTask } 
            ]);
        } else {
            alert("Both title and time are required!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full pt-4 text-white">
            <h1 className="text-6xl mb-6">LIVE</h1>

            <div className="flex justify-center items-center w-[80%] space-x-12 m-4 mb-6 p-auto">
                {tasks.slice(0, 3).map((task) => (
                    <div
                        key={task.id}
                        className="flex-none text-center p-8 rounded-3xl text-xl border-2 w-1/4 shadow-lg shadow-gray-400"
                    >
                        <h2>{task.title}</h2>
                        <p>{task.time}</p>
                    </div>
                ))}
                <div className="my-auto text-center p-8 rounded-3xl text-2xl mb-8 border-2 border-blue-500 shadow-lg shadow-blue-500">
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="w-[80%] mb-8">
                <h2 className="text-2xl mb-4">Full Schedule</h2>
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-md"
                        >
                            <div className="flex items-center space-x-4">
                                <h3 className="text-xl text-white">{task.title}</h3>
                                <p className="text-lg text-gray-400 bg-blue-950 rounded-3xl p-2">
                                    {task.time}
                                </p>
                            </div>
                            <button
                                className="text-blue-500 hover:bg-blue-400 hover:text-black p-3 rounded-3xl transition-all ease-in-out duration-0.7"
                                onClick={() => handleEditTime(task.id)}
                            >
                                Edit Time
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button className="border-2 p-3 m-2 rounded-3xl border-blue-500 hover:scale-105 transition-all ease-in-out duration-0.3">
                Show Timeline
            </button>

            <button
                onClick={handleAddTask}
                className="mt-4 border-2 p-3 m-2 rounded-3xl border-blue-500 hover:scale-105 transition-all ease-in-out duration-0.3"
            >
                Add Task
            </button>
        </div>
    );
};

export default RealtimeUpdate;
