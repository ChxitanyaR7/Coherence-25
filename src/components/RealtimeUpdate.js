import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, push, onValue, update, remove } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase";
import { useNavigate } from "react-router-dom";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const RealtimeUpdate = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTask, setCurrentTask] = useState(null);
    const [previousTask, setPreviousTask] = useState(null);
    const [nextTask, setNextTask] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerStatus, setTimerStatus] = useState("starting_soon");
    const [currentDay, setCurrentDay] = useState(1); // Initialize currentDay first

    const navigate = useNavigate();

    const START_DATE = new Date("March 28, 2025 12:00:00 GMT+0530").getTime();
    const END_DATE = new Date("March 29, 2025 18:00:00 GMT+0530").getTime();

    const handleGoHome = () => {
        navigate("/");
    };

    const getHackathonEndTime = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Set up start and end times
        const startTime = new Date(now);
        startTime.setHours(12, 0, 0, 0); // Start at 12 PM

        const endTime = new Date(startTime);
        if (currentDay === 1) {
            endTime.setDate(endTime.getDate() + 1); // Add 1 day
            endTime.setHours(12, 0, 0, 0); // End at 12 PM next day
        } else {
            endTime.setHours(18, 0, 0, 0); // End at 6 PM

            if (currentHour >= 18) {
                return now.getTime();
            }
        }

        if (currentDay === 1 && currentHour < 12) {
            return startTime.getTime();
        }

        return endTime.getTime();
    };

    const getCurrentTimeInMinutes = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        if (hours < 6) {
            return (24 + hours) * 60 + minutes;
        }
        return hours * 60 + minutes;
    };

    const calculateTimeLeft = () => {
        const now = new Date().getTime();

        if (now < START_DATE) {
            setTimerStatus("starting_soon");
            return Math.floor((START_DATE - now) / 1000);
        }

        if (now >= START_DATE && now <= END_DATE) {
            setTimerStatus("running");
            return Math.floor((END_DATE - now) / 1000);
        }

        setTimerStatus("event_ended");
        return 0;
    };

    const formatTime = (seconds) => {
        switch (timerStatus) {
            case "starting_soon":
                return "Starting Soon";
            case "event_ended":
                return "Event Ended";
            default:
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const secondsLeft = seconds % 60;
                return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secondsLeft).padStart(2, "0")}`;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const timeRemaining = calculateTimeLeft();
            setTimeLeft(timeRemaining);
        }, 1000);

        return () => clearInterval(interval);
    }, [currentDay]);

    const convertTo24HourFormat = (time) => {
        if (!time) return null;
        const timeRegex = /^(\d{1,2}):(\d{2})\s*([AP]M)?$/i;
        const match = time.trim().match(timeRegex);
        if (!match) return null;

        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const period = match[3]?.toUpperCase() || "";

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

        return hours * 60 + minutes;
    };

    const isValidTime = (time) => {
        return /^(\d{1,2}):(\d{2})\s*([AP]M)?$/i.test(time);
    };

    useEffect(() => {
        const tasksRef = ref(db, "tasks");
        const unsubscribe = onValue(tasksRef, (snapshot) => {
            const data = snapshot.val();
            const fetchedTasks = data
                ? Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }))
                : [];
            fetchedTasks.sort((a, b) => a.order - b.order);
            setTasks(fetchedTasks);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const updateCurrentTask = () => {
            const systemTime = new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            const targetTime = convertTo24HourFormat(systemTime);
            if (targetTime === null) return;

            const sortedTasks = [...tasks].sort((a, b) => {
                const aTime = convertTo24HourFormat(a.time) || 0;
                const bTime = convertTo24HourFormat(b.time) || 0;
                return aTime - bTime;
            });

            let currentTaskIndex = -1;
            let nextTaskIndex = -1;

            for (let i = 0; i < sortedTasks.length; i++) {
                const taskTime = convertTo24HourFormat(sortedTasks[i].time) || 0;
                if (taskTime <= targetTime) currentTaskIndex = i;
                if (taskTime > targetTime && nextTaskIndex === -1) nextTaskIndex = i;
            }

            setCurrentTask(sortedTasks[currentTaskIndex] || null);
            setPreviousTask(currentTaskIndex >= 0 ? sortedTasks[currentTaskIndex - 1] : null);
            setNextTask(nextTaskIndex !== -1 ? sortedTasks[nextTaskIndex] : null);
        };

        updateCurrentTask();
        const interval = setInterval(updateCurrentTask, 60000);
        return () => clearInterval(interval);
    }, [tasks]);

    const handleEditTime = (id) => {
        const newTime = prompt("Enter new time (HH:MM AM/PM):");
        if (!newTime) return;

        if (!isValidTime(newTime)) {
            alert("Invalid format. Use HH:MM AM/PM.");
            return;
        }

        const convertedTime = convertTo24HourFormat(newTime);
        if (convertedTime === null) {
            alert("Invalid time values.");
            return;
        }

        const taskRef = ref(db, `tasks/${id}`);
        update(taskRef, { time: newTime });
        setTasks(tasks.map((task) => (task.id === id ? { ...task, time: newTime } : task)));
    };

    const handleAddTask = () => {
        const taskTitle = prompt("Enter task title:");
        const taskTime = prompt("Enter task time (HH:MM AM/PM):");

        if (!taskTitle || !taskTime) {
            alert("Both fields required!");
            return;
        }

        if (!isValidTime(taskTime)) {
            alert("Invalid format. Use HH:MM AM/PM.");
            return;
        }

        const convertedTime = convertTo24HourFormat(taskTime);
        if (convertedTime === null) {
            alert("Invalid time values.");
            return;
        }

        const newTask = {
            title: taskTitle,
            time: taskTime,
            order: tasks.length + 1,
        };

        const tasksRef = ref(db, "tasks");
        const newTaskRef = push(tasksRef);
        set(newTaskRef, newTask);
        setTasks((prev) => [...prev, { id: newTaskRef.key, ...newTask }]);
    };

    const handleDeleteTask = (id) => {
        const password = prompt("Enter password:");
        if (password !== "yash") {
            alert("Incorrect password!");
            return;
        }
        const taskRef = ref(db, `tasks/${id}`);
        remove(taskRef);
        setTasks(tasks.filter((task) => task.id !== id));
    };

    return (
        <div className="flex flex-col items-center justify-center h-full pt-4 text-white">
            <h1 className="text-6xl mb-6">LIVE</h1>
            {loading ? (
                <div className="spinner-border animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16"></div>
            ) : (
                <div className="flex flex-col md:flex-row justify-center items-center w-full md:w-3/4 space-y-4 md:space-y-0 md:space-x-4 m-4 mb-6">
                    <div className="flex-none text-center p-2 md:p-8 rounded-3xl text-xl border-2 w-3/4 md:w-1/4 shadow-lg shadow-gray-400">
                        {previousTask ? (
                            <>
                                <h2>{previousTask.title}</h2>
                                <p>{previousTask.time}</p>
                            </>
                        ) : (
                            <p>No previous task</p>
                        )}
                    </div>

                    {currentTask && (
                        <div className="my-auto text-center p-2 md:p-8 rounded-3xl w-3/4 md:w-none text-2xl mb-8 border-2 border-blue-500 shadow-lg shadow-blue-500">
                            <h2>{currentTask.title}</h2>
                            <p>{currentTask.time}</p>
                        </div>
                    )}

                    <div className="flex-none text-center p-2 md:p-8 rounded-3xl text-xl border-2 w-3/4 md:w-1/4 shadow-lg shadow-gray-400">
                        {nextTask ? (
                            <>
                                <h2>{nextTask.title}</h2>
                                <p>{nextTask.time}</p>
                            </>
                        ) : (
                            <p>No next task</p>
                        )}
                    </div>
                </div>
            )}
            <div className="w-[80%] mb-8">
                <h2 className="text-2xl mb-4">Full Schedule</h2>
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`flex justify-between items-center p-4 rounded-lg ${task.id === currentTask?.id ? "bg-blue-600" : "bg-gray-800"
                                }`}
                        >
                            <div className="flex items-center space-x-4">
                                <h3 className="text-xl">{task.title}</h3>
                                <p className="text-lg bg-blue-950 rounded-3xl p-2">{task.time}</p>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleEditTime(task.id)}
                                    className="text-blue-500 hover:bg-blue-400 p-3 rounded-3xl"
                                >
                                    Edit Time
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RealtimeUpdate;
