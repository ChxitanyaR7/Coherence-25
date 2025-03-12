import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const Realtime = () => {
    const initialTime = 24 * 60 * 60; // Initial 24-hour countdown in seconds
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTask, setCurrentTask] = useState(null);
    const [previousTask, setPreviousTask] = useState(null);
    const [nextTask, setNextTask] = useState(null);

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
    
    // Send browser notification
    const sendBrowserNotification = (title, body) => {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: "/favicon.ico", // Replace with your icon
            });
            
            // Also display an in-app notification
            // You could implement a toast notification here
            console.log(`NOTIFICATION: ${title} - ${body}`);
        }
    };
    
    
    // Send both browser and mobile notifications
    const sendNotification = async (title, body) => {
        sendBrowserNotification(title, body);
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
                WARNING_TIMES.forEach(warningMin => {
                    const notifyAtTime = taskTimeInMinutes - warningMin;
                    
                    // Only schedule if the notification time is in the future
                    if (notifyAtTime > currentTimeInMinutes) {
                        const minutesUntilNotification = notifyAtTime - currentTimeInMinutes;
                        const millisecondsUntilNotification = minutesUntilNotification * 60 * 1000;
                        
                        const notificationId = `${task.id}-${warningMin}`;
                        newNotifications[notificationId] = setTimeout(() => {
                            sendNotification(
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
        sendNotification(
            "Test Notification",
            `This is a test notification sent at ${new Date().toLocaleTimeString()}`
        );
    };
    
    // Add a test task with notifications 
    const addTestTask = () => {
        // Get current time
        const now = new Date();
        
        // Create a time 6 minutes from now to test all notifications (5min, 3min, 1min)
        now.setMinutes(now.getMinutes() + 6);
        
        // Format the time for display (like "4:30 PM")
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        const timeString = `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
        
        // Create a test task
        const testTask = {
            id: 'test-task-' + Date.now(),
            title: 'Test Notification Task',
            time: timeString,
            order: 999 // High order to put it at the end
        };
        
        // Add to Firebase
        const taskRef = ref(db, `tasks/${testTask.id}`);
        set(taskRef, testTask)
            .then(() => {
                sendNotification(
                    "Test Task Scheduled",
                    `A test task has been scheduled for ${timeString} (6 minutes from now). You should receive notifications at 5, 3, and 1 minute intervals before the task.`
                );
            })
            .catch(error => {
                console.error("Error adding test task:", error);
                alert("Error adding test task: " + error.message);
            });
    };
    
    useEffect(() => {
        // Request notification permission when the component mounts
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
        
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
                    const nextTaskTime = convertTo24HourFormat(fetchedTasks[i+1].time);
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
                {formatTime(timeLeft)} {/* Display countdown */}
            </div>
            
            {/* Display loading spinner while fetching tasks */}
            {loading ? (
                <div className="flex justify-center items-center w-full h-24">
                    <div className="spinner-border animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16"></div>
                </div>
            ) : (
                <div className="flex justify-center items-center w-[80%] space-x-12 m-4 mb-6">
                    {/* Previous task */}
                    <div className="flex-none text-center p-8 rounded-3xl text-xl border-2 opacity-50 w-1/4 shadow-lg shadow-gray-400">
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
                    <div className="flex-grow text-center p-8 rounded-3xl text-3xl font-bold border-2 border-blue-500 shadow-lg shadow-blue-500 hover:scale-105 transition-all ease-in-out duration-300">
                        {currentTask ? (
                            <>
                                <h2>{currentTask.title}</h2>
                                <p>{currentTask.time}</p>
                            </>
                        ) : (
                            <p>No current task</p>
                        )}
                    </div>

                    {/* Next task */}
                    <div className="flex-none text-center p-8 rounded-3xl text-xl border-2 w-1/4 border-blue-700 shadow-lg shadow-blue-700 hover:scale-105 transition-all ease-in-out duration-300">
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
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                <button 
                    className="border-2 p-3 rounded-3xl border-green-500 hover:scale-105 transition-all ease-in-out duration-0.3"
                    onClick={testNotification}
                >
                    Test Notification System
                </button>
                
                <button 
                    className="border-2 p-3 rounded-3xl border-blue-500 hover:scale-105 transition-all ease-in-out duration-0.3"
                >
                    Show Timeline
                </button>
                
                <button 
                    className="border-2 p-3 rounded-3xl border-yellow-500 hover:scale-105 transition-all ease-in-out duration-0.3"
                    onClick={addTestTask}
                >
                    Schedule Test Task (6min from now)
                </button>
            </div>
        </div>
    );
};

export default Realtime;