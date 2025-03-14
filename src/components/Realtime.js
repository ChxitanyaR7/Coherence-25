import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase";
import Background from "./Background";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const Realtime = () => {
    // Use server time or local storage to maintain consistent time across refreshes
    const getPersistedTime = () => {
        const savedTime = localStorage.getItem('timeLeft');
        return savedTime ? parseInt(savedTime) : 24 * 60 * 60; // Default to 24 hours
    };
    
    const [timeLeft, setTimeLeft] = useState(getPersistedTime());
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTask, setCurrentTask] = useState(null);
    const [previousTask, setPreviousTask] = useState(null);
    const [nextTask, setNextTask] = useState(null);
    const [upcomingNotifications, setUpcomingNotifications] = useState({});
    const [notificationPermission, setNotificationPermission] = useState(false);
    
    // Time warning constants (in minutes)
    const WARNING_TIMES = [5, 3, 1]; // Notify at 5 mins, 3 mins, and 1 min before task
    
    // Format time in HH:MM:SS
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsLeft = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
    };

    // Convert time to 24-hour format for comparison
    const convertTo24HourFormat = (time) => {
        const [timeString, period] = time.split(' ');
        let [hours, minutes] = timeString.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes; // Return total minutes
    };

    // Convert minutes to readable time format
    const minutesToTimeString = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    // Get current time in minutes (since midnight)
    const getCurrentTimeInMinutes = () => {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    };
    
    // Request notification permission
    const requestNotificationPermission = async () => {
        try {
            // Check if the browser supports notifications
            if (!("Notification" in window)) {
                console.error("This browser does not support desktop notification");
                return false;
            }
            
            // Check if permission is already granted
            if (Notification.permission === "granted") {
                setNotificationPermission(true);
                return true;
            }
            
            // Request permission from the user
            const permission = await Notification.requestPermission();
            
            if (permission === "granted") {
                setNotificationPermission(true);
                return true;
            } else {
                console.warn("Notification permission denied");
                return false;
            }
        } catch (error) {
            console.error("Error requesting notification permission:", error);
            return false;
        }
    };
    
    // Send system notification that works even when in other applications
    const sendSystemNotification = (title, body) => {
        try {
            // Check if we have permission to send notifications
            if (Notification.permission !== "granted") {
                console.warn("Notification permission not granted");
                return;
            }
            
            // Create and display the notification
            const options = {
                body: body,
                icon: "/favicon.ico", // Replace with your icon
                requireInteraction: true, // Keep notification visible until user interacts with it
                silent: false, // Enable sound notification
                vibrate: [200, 100, 200] // Vibration pattern for mobile devices
            };
            
            // Use the Notification constructor directly
            const notification = new Notification(title, options);
            
            // Add event listeners for the notification
            notification.onclick = () => {
                // Focus on the window when notification is clicked
                window.focus();
                notification.close();
            };
            
            notification.onshow = () => {
                console.log(`NOTIFICATION SHOWN: ${title} - ${body}`);
            };
            
            notification.onerror = (err) => {
                console.error("Notification error:", err);
            };
            
        } catch (error) {
            console.error("Error sending notification:", error);
            // Fallback to alert only if system notification fails
            alert(`${title}\n${body}`);
        }
    };

    // Schedule notifications for upcoming tasks
    const scheduleNotifications = (taskList) => {
        const currentTimeInMinutes = getCurrentTimeInMinutes();
        const newNotifications = {};

        // Clear any existing notification timeouts
        Object.values(upcomingNotifications).forEach(timeout => clearTimeout(timeout));

        taskList.forEach(task => {
            const taskTimeInMinutes = convertTo24HourFormat(task.time);

            // Only schedule if the task is in the future
            if (taskTimeInMinutes > currentTimeInMinutes) {
                const WARNING_TIMES = [5, 3, 1]; // Example warning times (in minutes)

                WARNING_TIMES.forEach(warningMin => {
                    const notifyAtTime = taskTimeInMinutes - warningMin;

                    // Only schedule if the notification time is in the future
                    if (notifyAtTime > currentTimeInMinutes) {
                        const minutesUntilNotification = notifyAtTime - currentTimeInMinutes;
                        const millisecondsUntilNotification = minutesUntilNotification * 60 * 1000;

                        const notificationId = `${task.id}-${warningMin}`;
                        newNotifications[notificationId] = setTimeout(() => {
                            sendSystemNotification(
                                `Task Coming Up: ${task.title}`,
                                `"${task.title}" will start in ${warningMin} minute${warningMin !== 1 ? 's' : ''} at ${task.time}`
                            );
                        }, millisecondsUntilNotification);
                    }
                });
            }
        });

        setUpcomingNotifications(newNotifications);
    };

    // Test notification system
    const testNotification = () => {
        sendSystemNotification(
            "Test Notification",
            `This is a test notification sent at ${new Date().toLocaleTimeString()}`
        );
    };
    
    useEffect(() => {
        // Request notification permission when the component mounts
        requestNotificationPermission();
        
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

            // Schedule notifications for upcoming tasks
            scheduleNotifications(fetchedTasks);

            // Get the current time
            const currentTimeInMinutes = getCurrentTimeInMinutes();
            let currentTaskIndex = -1;

            // Find the current task based on current time
            for (let i = 0; i < fetchedTasks.length; i++) {
                const taskTime = convertTo24HourFormat(fetchedTasks[i].time);

                // If this is the last task or we're between this task and the next one
                if (i === fetchedTasks.length - 1) {
                    currentTaskIndex = i;
                    break;
                } else if (i < fetchedTasks.length - 1) {
                    const nextTaskTime = convertTo24HourFormat(fetchedTasks[i + 1].time);
                    if (currentTimeInMinutes >= taskTime && currentTimeInMinutes < nextTaskTime) {
                        currentTaskIndex = i;
                        break;
                    }
                }
            }

            // If no task is found (before first task of the day), default to the first task
            if (currentTaskIndex === -1 && fetchedTasks.length > 0) {
                currentTaskIndex = 0;
            }

            // Set the previous, current, and next tasks based on the index found
            if (currentTaskIndex !== -1) {
                setCurrentTask(fetchedTasks[currentTaskIndex]);
                setPreviousTask(currentTaskIndex > 0 ? fetchedTasks[currentTaskIndex - 1] : null);
                setNextTask(currentTaskIndex < fetchedTasks.length - 1 ? fetchedTasks[currentTaskIndex + 1] : null);
            }
        });

        // Clean up on unmount
        return () => {
            unsubscribe();
            // Clear all notification timeouts
            Object.values(upcomingNotifications).forEach(timeout => clearTimeout(timeout));
        };
    }, []);

    useEffect(() => {
        if (timeLeft === 0) return;

        // Save time to localStorage whenever it changes
        localStorage.setItem('timeLeft', timeLeft.toString());

        const interval = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                const newTime = prevTime - 1;
                localStorage.setItem('timeLeft', newTime.toString());
                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    return (
        <div className="flex flex-col items-center justify-center h-screen text-white">
            <h1 className="text-6xl">LIVE</h1>
            <div className="text-9xl mb-8 border-b-2 w-3/4 rounded-3xl p-12 border-blue-500 shadow-lg shadow-blue-500">
                {formatTime(timeLeft)}
            </div>
            
            {!notificationPermission && (
                <div className="bg-yellow-500 text-black p-4 rounded-lg mb-4">
                    <p className="font-bold">Notifications are not enabled!</p>
                    <button 
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={requestNotificationPermission}
                    >
                        Enable Notifications
                    </button>
                </div>
            )}
            
            {/* Display loading spinner while fetching tasks */}
            {loading ? (
                <div className="flex justify-center items-center w-full h-24">
                    <div className="spinner-border animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16"></div>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row justify-center items-center w-full space-y-4 md:space-y-0 md:space-x-4 m-4 mb-6">
                     <div className="flex-none backdrop-blur-sm w-3/4 md:w-1/4 text-center p-4 rounded-3xl text-xl border-2 opacity-50 shadow-lg shadow-gray-400">
                    {/* Previous task */}
                        {previousTask ? (
                            <>
                                <h2>{previousTask.title}</h2>
                                <p>{previousTask.time}</p>
                            </>
                        ) : (
                            <p>No previous task</p>
                        )}
                    </div>

                    {/* Current task in the center */}
                    {currentTask && (
                        <div className="flex-grow text-center p-8 rounded-3xl text-3xl font-bold border-2 border-blue-500 shadow-lg shadow-blue-500 hover:scale-105 transition-all ease-in-out duration-0.3">
                            <h2>{currentTask.title}</h2>
                            <p>{currentTask.time}</p>
                            <div className="mt-2 text-sm bg-green-600 px-3 py-1 rounded-full">
                                Now active
                            </div>
                        </div>
                    )}
                    
                    {/* Next task */}
                    <div className="flex-none text-center p-8 rounded-3xl text-xl border-2 w-1/4 border-blue-700 shadow-lg shadow-blue-700 hover:scale-105 transition-all ease-in-out duration-0.3">
                        {nextTask ? (
                            <>
                                <h2>{nextTask.title}</h2>
                                <p>{nextTask.time}</p>
                                <div className="mt-2 text-sm bg-blue-600 px-2 py-1 rounded-full animate-pulse">
                                    Coming up next
                                </div>
                            </>
                        ) : (
                            <p>No next task</p>
                        )}
                    </div>
                </div>
            )}
            
            <div className="flex flex-col sm:flex-row flex-wrap justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                <button 
                    className="border-2 p-3 rounded-3xl border-green-500 hover:scale-105 transition-all ease-in-out duration-0.3"
                    onClick={testNotification}
                >
                    Test Notification
                </button>

                <button className="border-2 p-3 m-2 rounded-3xl border-blue-500 hover:scale-105 transition-all ease-in-out duration-300">

                    Show Timeline
                </button>
            </div>
        </div>
    );
};

export default Realtime;
