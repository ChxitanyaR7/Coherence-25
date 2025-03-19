import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase";
import { useNavigate } from "react-router-dom";
import mlscvcet from "../assets/mlsc-vcet.png";
import Background from "./Background";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Define warning times for notifications (in minutes)
const WARNING_TIMES = [5, 3, 1];

const Realtime = () => {
    const navigate = useNavigate();
    const [upcomingNotifications, setUpcomingNotifications] = useState({});

    const handleGoHome = () => {
        navigate("/"); 
    };
    
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
                icon: mlscvcet, // Replace with your icon
            });
            
            // Also display an in-app notification
            console.log(`NOTIFICATION: ${title} - ${body}`);
        }
    };
    
    // Send notification
    const sendNotification = (title, body) => {
        sendBrowserNotification(title, body);
    };
    
    // Schedule notifications for upcoming tasks
    const scheduleNotifications = (taskList) => {
        // Clear any existing notification timeouts
        Object.values(upcomingNotifications).forEach(timeout => clearTimeout(timeout));
        
        const currentTimeInMinutes = getCurrentTimeInMinutes();
        const newNotifications = {};
        
        // Filter out test tasks - only include regular schedule tasks
        const scheduledTasks = taskList.filter(task => !task.id.includes('test-task'));

        scheduledTasks.forEach(task => {
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
    
    // Test notification system - this will only display a single test notification without scheduling
    const testNotification = () => {
        sendNotification(
            "Test Notification",
            `This is a test notification sent at ${new Date().toLocaleTimeString()}`
        );
    };
    
    // Add a test task to the display without scheduling notifications for it
    const addTestTask = () => {
        // Get current time
        const now = new Date();
        
        // Create a time 6 minutes from now
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
            title: 'Test Task',
            time: timeString,
            order: 999, // High order to put it at the end
            isTest: true  // Mark as test task
        };
        
        // Add to Firebase
        const taskRef = ref(db, `tasks/${testTask.id}`);
        set(taskRef, testTask)
            .then(() => {
                sendNotification(
                    "Test Task Added",
                    `A test task has been added to your display for ${timeString} (6 minutes from now).`
                );
            })
            .catch(error => {
                console.error("Error adding test task:", error);
                alert("Error adding test task: " + error.message);
            });
    };

    // Helper function to determine if a time is "after" another time, handling midnight crossing
    const isTimeAfter = (timeA, timeB) => {
        // If both times are on different sides of midnight, handle specially
        if (timeA > 20 * 60 && timeB < 4 * 60) { // If timeA is evening and timeB is early morning
            return false; // timeA is "before" timeB across midnight
        } else if (timeA < 4 * 60 && timeB > 20 * 60) { // If timeA is early morning and timeB is evening
            return true; // timeA is "after" timeB across midnight
        }
        
        // Normal case - simple comparison
        return timeA > timeB;
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
                isTest: data[key].isTest || false
            })) : [];
            
            // Sort tasks by order field
            fetchedTasks.sort((a, b) => a.order - b.order);
            setTasks(fetchedTasks);
            setLoading(false);
            
            // Schedule notifications only for scheduled tasks, not test tasks
            scheduleNotifications(fetchedTasks);
            
            // Get the current time
            const currentTimeInMinutes = getCurrentTimeInMinutes();
            
            // Create a modified version of tasks with their time in minutes for easier comparison
            const tasksWithMinutes = fetchedTasks.map(task => ({
                ...task,
                timeInMinutes: convertTo24HourFormat(task.time)
            }));
            
            // Find the current task based on current time
            let currentTaskIndex = -1;
            
            // First, try to find a task that's currently active
            for (let i = 0; i < tasksWithMinutes.length; i++) {
                const currentTaskTime = tasksWithMinutes[i].timeInMinutes;
                
                // If this is the last task
                if (i === tasksWithMinutes.length - 1) {
                    const nextTaskTime = i === 0 ? 
                        tasksWithMinutes[0].timeInMinutes : 
                        tasksWithMinutes[0].timeInMinutes + 24 * 60; // Next day
                    
                    if (isTimeAfter(currentTimeInMinutes, currentTaskTime) && 
                        !isTimeAfter(currentTimeInMinutes, nextTaskTime)) {
                        currentTaskIndex = i;
                        break;
                    }
                } else {
                    // Check if we're between this task and the next
                    const nextTaskTime = tasksWithMinutes[i + 1].timeInMinutes;
                    
                    // Handle midnight crossing
                    if (nextTaskTime < currentTaskTime) {
                        // Next task is on the next day
                        if (isTimeAfter(currentTimeInMinutes, currentTaskTime) || 
                            !isTimeAfter(currentTimeInMinutes, nextTaskTime)) {
                            currentTaskIndex = i;
                            break;
                        }
                    } else {
                        // Normal case - check if current time is between current task and next task
                        if (isTimeAfter(currentTimeInMinutes, currentTaskTime) && 
                            !isTimeAfter(currentTimeInMinutes, nextTaskTime)) {
                            currentTaskIndex = i;
                            break;
                        }
                    }
                }
            }
            
            // If no current task found, find the next upcoming task
            if (currentTaskIndex === -1) {
                let minTimeDiff = Infinity;
                
                for (let i = 0; i < tasksWithMinutes.length; i++) {
                    let taskTime = tasksWithMinutes[i].timeInMinutes;
                    
                    // If task is in the past, consider it for the next day
                    if (isTimeAfter(currentTimeInMinutes, taskTime)) {
                        taskTime += 24 * 60; // Add a day
                    }
                    
                    const timeDiff = taskTime - currentTimeInMinutes;
                    
                    if (timeDiff < minTimeDiff) {
                        minTimeDiff = timeDiff;
                        currentTaskIndex = i;
                    }
                }
            }
            
           
            if (currentTaskIndex !== -1 && tasksWithMinutes.length > 0) {
                setCurrentTask(fetchedTasks[currentTaskIndex]);
                
               
                const prevIndex = currentTaskIndex === 0 ? fetchedTasks.length - 1 : currentTaskIndex - 1;
                setPreviousTask(fetchedTasks[prevIndex]);
                
                
                const nextIndex = currentTaskIndex === fetchedTasks.length - 1 ? 0 : currentTaskIndex + 1;
                setNextTask(fetchedTasks[nextIndex]);
            }
        });
        
       
        return () => {
            unsubscribe();
            Object.values(upcomingNotifications).forEach(timeout => clearTimeout(timeout));
        };
    }, []);
    
    useEffect(() => {
        if (timeLeft === 0) return;
        
        
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

    // Add a function to reset notifications
    const resetNotifications = () => {
        // Clear all existing timeouts
        Object.values(upcomingNotifications).forEach(timeout => clearTimeout(timeout));
        setUpcomingNotifications({});
        
        // Reschedule notifications for regular tasks only
        scheduleNotifications(tasks);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen text-white md:pt-2">
            <Background />

            <button
                onClick={handleGoHome}
                className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 bg-transparent border border-blue-500 rounded-full p-2 font-semibold shadow-lg hover:bg-blue-100 hover:scale-110 transition-all ease-in-out duration-300"
            >
                &#8592; Home
            </button>
            <div className="flex flex-col mt-56 md:mt-0">
                {/* <img src={coherencelogo} alt="Coherence Logo" className="mb-2 w-2/3 md:w-1/3 z-50 mx-auto" /> */}
                <h1 className="text-3xl md:text-5xl font-bold md:mt-8 text-gray-300 z-50">LIVE</h1>
            </div>
            <div className="backdrop-blur-sm text-5xl md:text-9xl mb-8 border-b-2 w-3/4 rounded-3xl p-8 sm:p-12 border-blue-500 shadow-lg shadow-blue-600">
                {formatTime(timeLeft)}
            </div>
            
            {/* Display loading spinner while fetching tasks */}
            {loading ? (
                <div className="flex justify-center items-center w-full h-24">
                    <div className="spinner-border animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16"></div>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row justify-center items-center w-full md:w-4/5 space-y-4 md:space-y-0 md:space-x-4 m-4 mb-6">
                <div className="backdrop-blur-sm flex-none w-3/4 md:w-1/4 text-center p-4 rounded-3xl text-xl border-2 opacity-50 shadow-lg shadow-gray-400">
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
                        <div className="backdrop-blur-sm flex-none w-3/4 md:w-1/4 text-center p-4 rounded-3xl text-xl md:text-3xl font-bold border-2 border-blue-500 shadow-lg shadow-blue-500 hover:scale-105 transition-all ease-in-out duration-300">                            <h2>{currentTask.title}</h2>
                            <p>{currentTask.time}</p>
                            <div className="mt-4 text-sm bg-green-600 px-3 py-1 rounded-full w-1/2 mx-auto animate-pulse">
                                Now active
                            </div>
                        </div>
                    )}
                    
                    {/* Next task */}
                    <div className="backdrop-blur-sm flex-none w-3/4 md:w-1/4 text-center p-4 rounded-3xl text-xl border-2 border-blue-700 shadow-lg shadow-blue-700 hover:scale-105 transition-all ease-in-out duration-300">                        {nextTask ? (
                            <>
                                <h2>{nextTask.title}</h2>
                                <p>{nextTask.time}</p>
                                <div className="mt-2 text-sm bg-blue-800 px-2 py-1 rounded-full animate-pulse">
                                    Coming up next
                                </div>
                            </>
                        ) : (
                            <p>No next task</p>
                        )}
                    </div>
                </div>
            )}
            
            <div className="flex flex-row flex-wrap justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                <button 
                    className="border-2 p-3 rounded-3xl border-green-500 hover:scale-105 transition-all ease-in-out duration-0.3"
                    onClick={testNotification}
                >
                    Test Notification
                </button>

                <button className="border-2 p-3 m-2 rounded-3xl border-blue-500 hover:scale-105 transition-all ease-in-out duration-300">
                    Show Timeline
                </button>
                
                <button 
                    className="border-2 p-3 rounded-3xl border-yellow-500 hover:scale-105 transition-all ease-in-out duration-0.3"
                    onClick={addTestTask}
                >
                    Add Test Task
                </button>
                
                <button 
                    className="border-2 p-3 rounded-3xl border-red-500 hover:scale-105 transition-all ease-in-out duration-0.3"
                    onClick={resetNotifications}
                >
                    Reset Notifications
                </button>
            </div>
        </div>
    );
};

export default Realtime;