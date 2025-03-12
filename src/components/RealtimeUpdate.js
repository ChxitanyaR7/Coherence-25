import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, push, onValue, update, remove } from "firebase/database"; // Firebase Realtime Database methods
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase";


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const RealtimeUpdate = () => {
    const initialTime = 24 * 60 * 60;
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTask, setCurrentTask] = useState(null); // New state for current task
    const [previousTask, setPreviousTask] = useState(null); // New state for previous task
    const [nextTask, setNextTask] = useState(null); // New state for next task

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsLeft = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
    };

    // Function to convert 12-hour time format to 24-hour format for comparison
    const convertTo24HourFormat = (time) => {
        const [timeString, period] = time.split(' ');
        let [hours, minutes] = timeString.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes; // Return total minutes
    };

    useEffect(() => {
        // Fetch tasks from Firebase when the component mounts
        const tasksRef = ref(db, 'tasks');

        const unsubscribe = onValue(tasksRef, (snapshot) => {
            const data = snapshot.val();
            const fetchedTasks = data ? Object.keys(data).map((key) => ({
                id: key,
                title: data[key].title,
                time: data[key].time,
                order: data[key].order,
            })) : [];

            // Sort tasks by order field
            fetchedTasks.sort((a, b) => a.order - b.order);
            setTasks(fetchedTasks);
            setLoading(false);

            // Convert the hardcoded time (1:40 PM) to 24-hour format for comparison
            const targetTime = convertTo24HourFormat('1:35 PM'); // Your target time (1:40 PM)

            let matchedTask = null;
            let currentTaskIndex = -1;
            let previousTaskIndex = -1;
            let nextTaskIndex = -1;

            // Iterate through the tasks to find the current, previous, and next tasks
            for (let i = 0; i < fetchedTasks.length; i++) {
                const taskTime = convertTo24HourFormat(fetchedTasks[i].time);

                // If the task's time is less than or equal to the current time, it could be the current task
                if (taskTime <= targetTime) {
                    currentTaskIndex = i;
                }

                // If the task's time is greater than the current time, it's the next task
                if (taskTime > targetTime && nextTaskIndex === -1) {
                    nextTaskIndex = i;
                }
            }

            // Set the previous, current, and next tasks based on their indices
            setCurrentTask(fetchedTasks[currentTaskIndex]);
            setPreviousTask(fetchedTasks[currentTaskIndex - 1] || null);
            setNextTask(fetchedTasks[nextTaskIndex] || null);
        });

        return () => unsubscribe();
    }, []);


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

            // Update the time in the Firebase database
            const taskRef = ref(db, `tasks/${id}`);
            update(taskRef, { time: newTime });
        }
    };

    const handleAddTask = () => {
        const taskTitle = prompt("Enter task title:");
        const taskTime = prompt("Enter task time (HH:MM AM/PM):");

        if (taskTitle && taskTime) {
            const newTask = {
                title: taskTitle,
                time: taskTime,
                order: tasks.length + 1, // Assign order based on the current number of tasks
            };

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

    const handleDeleteTask = (id) => {
        const password = prompt("Enter password to delete the task:");
        if (password === "yash") {
            const taskRef = ref(db, `tasks/${id}`);
            remove(taskRef)
                .then(() => {
                    setTasks(tasks.filter((task) => task.id !== id));
                })
                .catch((error) => {
                    console.error("Error deleting task: ", error);
                });
        } else {
            alert("Incorrect password!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full pt-4 text-white">
            <h1 className="text-6xl mb-6">LIVE</h1>

            {/* Show a loader while fetching tasks */}
            {loading ? (
                <div className="flex justify-center items-center w-full h-24">
                    <div className="spinner-border animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16"></div>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row justify-center items-center w-full md:w-3/4 space-y-4 md:space-y-0 md:space-x-4 m-4 mb-6">
                    {/* Left Box: Previous Task */}
                    <div
                        className="flex-none text-centerp-2 md:p-8 rounded-3xl text-xl border-2 w-3/4 md:w-1/4 shadow-lg shadow-gray-400"
                    >
                        {previousTask ? (
                            <>
                                <h2>{previousTask.title}</h2>
                                <p>{previousTask.time}</p>
                            </>
                        ) : (
                            <p>No previous task</p>
                        )}
                    </div>

                    {/* Center Box: Current Task */}
                    {currentTask && (
                        <div className="my-auto text-center p-2 md:p-8 rounded-3xl w-3/4 md:w-none text-2xl mb-8 border-2 border-blue-500 shadow-lg shadow-blue-500">
                            <h2>{currentTask.title}</h2>
                            <p>{currentTask.time}</p>
                        </div>
                    )}

                    {/* Right Box: Next Task */}
                    <div
                        className="flex-none text-center p-2 md:p-8 rounded-3xl text-xl border-2 w-3/4 md:w-1/4 shadow-lg shadow-gray-400"
                    >
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

            <button
                onClick={handleAddTask}
                className="mt-4 border-2 p-3 m-2 rounded-3xl border-blue-500 hover:scale-105 transition-all ease-in-out duration-0.3"
            >
                Add Task
            </button>

            <div className="w-[80%] mb-8">
                <h2 className="text-2xl mb-4">Full Schedule</h2>
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-md ${task === currentTask ? 'bg-blue-600' : ''}`}
                        >
                            <div className="flex items-center space-x-4">
                                <h3 className="text-xl text-white">{task.title}</h3>
                                <p className="text-lg text-gray-400 bg-blue-950 rounded-3xl p-2">
                                    {task.time}
                                </p>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    className="text-blue-500 hover:bg-blue-400 hover:text-black p-3 rounded-3xl transition-all ease-in-out duration-0.7"
                                    onClick={() => handleEditTime(task.id)}
                                >
                                    Edit Time
                                </button>
                                <button
                                    className="text-red-500 hover:bg-red-400 hover:text-black p-3 rounded-3xl transition-all ease-in-out duration-0.7"
                                    onClick={() => handleDeleteTask(task.id)}
                                >
                                    Delete Task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="border-2 p-3 m-2 rounded-3xl border-blue-500 hover:scale-105 transition-all ease-in-out duration-0.3">
                Show Timeline
            </button>
        </div>
    );
};

export default RealtimeUpdate;