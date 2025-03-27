import React, { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import mlscvcet from "../assets/mlsc-vcet.png";
import Background from "./Background";
import { db } from "../firebase";  // Import the initialized db instance

const WARNING_TIMES = [5, 3, 1, 0]; // Added 0 for "event is starting now" notification

const Realtime = () => {
    const navigate = useNavigate();
    const [upcomingNotifications, setUpcomingNotifications] = useState({});
    const [currentDay, setCurrentDay] = useState(1); // Initialize currentDay first
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerStatus, setTimerStatus] = useState('starting_soon');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTask, setCurrentTask] = useState(null);
    const [previousTask, setPreviousTask] = useState(null);
    const [nextTask, setNextTask] = useState(null);
    const [showTimeline, setShowTimeline] = useState(false);

    // Define start and end dates for the hackathon
    const START_DATE = new Date("March 28, 2025 12:00:00 GMT+0530").getTime();
    const END_DATE = new Date("March 29, 2025 18:00:00 GMT+0530").getTime();

    const handleGoHome = () => {
        navigate("/");
    };

    // Get the hackathon end time from localStorage or set default
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
            // On day 2, count down to 6 PM
            endTime.setHours(18, 0, 0, 0); // End at 6 PM

            // If after 6 PM on day 2, show 00:00:00
            if (currentHour >= 18) {
                return now.getTime();
            }
        }

        // If before start time on day 1, count down to start
        if (currentDay === 1 && currentHour < 12) {
            return startTime.getTime();
        }

        return endTime.getTime();
    };

    // Get current time in minutes (since midnight)
    const getCurrentTimeInMinutes = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // If it's after midnight but before 6 AM, consider it as part of the previous day
        if (hours < 6) {
            return (24 + hours) * 60 + minutes;
        }
        return hours * 60 + minutes;
    };

    // Calculate time left based on end time
    const calculateTimeLeft = () => {
        const now = new Date().getTime();

        // Before event starts
        if (now < START_DATE) {
            setTimerStatus('starting_soon');
            return Math.floor((START_DATE - now) / 1000);
        }

        // During event
        if (now >= START_DATE && now <= END_DATE) {
            setTimerStatus('running');
            return Math.floor((END_DATE - now) / 1000);
        }

        // After event ends
        setTimerStatus('event_ended');
        return 0;
    };

    const formatTime = (seconds) => {
        // Handle different timer statuses
        switch (timerStatus) {
            case 'starting_soon':
                return 'Starting Soon';
            case 'event_ended':
                return 'Event Ended';
            default:
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const secondsLeft = seconds % 60;
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const timeRemaining = calculateTimeLeft();
            setTimeLeft(timeRemaining); // Update the time left

        }, 1000); // Update every second

        return () => clearInterval(interval); // Clean up interval on unmount
    }, [currentDay]); // Re-run effect when currentDay changes

    // Improved time conversion function that properly handles midnight (12 AM)
    const convertTo24HourFormat = (time) => {
        try {
            // Check if time already includes AM/PM
            if (time.includes('AM') || time.includes('PM')) {
                const [timeString, period] = time.split(' ');
                let [hours, minutes] = timeString.split(':').map(Number);

                // Handle invalid inputs
                if (isNaN(hours) || isNaN(minutes)) {
                    console.error("Invalid time format:", time);
                    return 0;
                }

                // Special case for 12 AM (midnight)
                if (period === 'AM' && hours === 12) {
                    // Convert 12 AM to 24 (end of day) for sorting purposes
                    return 24 * 60 + minutes;
                }
                // Handle PM times
                else if (period === 'PM' && hours !== 12) {
                    hours += 12;
                }

                return hours * 60 + minutes;
            } else {
                // Handle 24-hour format
                let [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            }
        } catch (error) {
            console.error("Error parsing time:", time, error);
            return 0;
        }
    };

    // Determine the current day of the hackathon (1 or 2) based on real dates or stored preference
    const determineCurrentDay = () => {
        // First check if we have a stored preference
        const storedDay = localStorage.getItem('currentHackathonDay');
        if (storedDay) {
            return parseInt(storedDay);
        }

        // If no stored preference, try to determine from date
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth(); // 0-based, so 2 = March
        const year = today.getFullYear();

        if (year === 2025 && month === 2 && day === 28) {
            return 1;
        } else if (year === 2025 && month === 2 && day === 29) {
            return 2;
        }

        // Default to day 1 if we can't determine
        return 1;
    };

    // Send browser notification
    const sendBrowserNotification = (title, body) => {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: mlscvcet, // Use your icon
            });

            // Also display an in-app notification
            console.log(`NOTIFICATION: ${title} - ${body}`);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    sendBrowserNotification(title, body);
                }
            });
        }
    };

    // Send notification
    const sendNotification = (title, body) => {
        sendBrowserNotification(title, body);
    };

    // Calculate minutes until a specified time, handling day wrapping
    const calculateMinutesUntil = (targetTime, currentTime) => {
        // If target time is earlier today, it means it's for tomorrow
        if (targetTime < currentTime) {
            targetTime += 24 * 60; // Add a day
        }
        return targetTime - currentTime;
    };

    // Schedule notifications for upcoming tasks
    const scheduleNotifications = (taskList) => {
        // Clear any existing notification timeouts
        Object.values(upcomingNotifications).forEach(timeout => clearTimeout(timeout));

        const currentTimeInMinutes = getCurrentTimeInMinutes();
        const newNotifications = {};

        // More strict filtering to exclude test tasks
        const scheduledTasks = taskList.filter(task =>
            !task.id.includes('test-task') &&
            !task.isTest &&
            task.title !== 'Test Task' &&
            task.day === currentDay // Only schedule notifications for current day
        );

        scheduledTasks.forEach(task => {
            const taskTimeInMinutes = convertTo24HourFormat(task.time);
            if (isNaN(taskTimeInMinutes)) {
                console.error("Invalid task time format:", task.time);
                return;
            }

            // Handle notifications for tasks
            WARNING_TIMES.forEach(warningMin => {
                const notifyAtTime = taskTimeInMinutes - warningMin;
                const minutesUntilNotification = calculateMinutesUntil(notifyAtTime, currentTimeInMinutes);

                if (minutesUntilNotification > 0 && minutesUntilNotification < 24 * 60) {
                    const millisecondsUntilNotification = minutesUntilNotification * 60 * 1000;
                    const notificationId = `${task.id}-${warningMin}`;

                    let notificationMessage;
                    if (warningMin === 0) {
                        notificationMessage = `"${task.title}" is starting now!`;
                    } else {
                        notificationMessage = `"${task.title}" will start in ${warningMin} minute${warningMin !== 1 ? 's' : ''} at ${task.time}`;
                    }

                    newNotifications[notificationId] = setTimeout(() => {
                        sendNotification(
                            `${warningMin === 0 ? 'Event Starting' : 'Event Coming Up'}: ${task.title}`,
                            notificationMessage
                        );
                    }, millisecondsUntilNotification);
                }
            });
        });

        setUpcomingNotifications(newNotifications);
    };




    // Initialize the event schedule for day 1 and day 2
    const initializeSchedule = () => {
        // Clear existing tasks first
        const tasksRef = ref(db, 'tasks');
        set(tasksRef, null);

        // Define the schedule for day 1 - Making sure midnight snacks is at end of day 1 (24-hour format)
        const day1Schedule = [
            { id: 'day1-1', title: 'Reporting and Registration', time: '12:00 PM', day: 1, order: 1 },
            { id: 'day1-2', title: 'Inauguration Ceremony', time: '1:00 PM', day: 1, order: 2 },
            { id: 'day1-3', title: 'Coding Begins', time: '2:00 PM', day: 1, order: 3 },
            { id: 'day1-4', title: 'Mentoring Round 1 Starts', time: '4:30 PM', day: 1, order: 4 },
            { id: 'day1-5', title: 'Evening Snacks', time: '5:00 PM', day: 1, order: 5 },
            { id: 'day1-6', title: 'Mentoring Round 2 Starts', time: '8:00 PM', day: 1, order: 6 },
            { id: 'day1-7', title: 'Dinner Break', time: '9:00 PM', day: 1, order: 7 },
            { id: 'day1-8', title: 'Midnight Snacks', time: '12:00 AM', day: 1, order: 8 }, // Fixed - End of day 1
        ];

        // Define the schedule for day 2 - Removed midnight snacks from beginning of day 2
        const day2Schedule = [
            { id: 'day2-1', title: 'Breakfast', time: '8:00 AM', day: 2, order: 9 },
            { id: 'day2-2', title: 'Lunch', time: '12:00 PM', day: 2, order: 10 },
            { id: 'day2-3', title: 'Coding Ends', time: '2:00 PM', day: 2, order: 11 },
            { id: 'day2-4', title: 'Final Presentation', time: '3:00 PM', day: 2, order: 12 },
            { id: 'day2-5', title: 'Result Announcement and Distribution', time: '5:00 PM', day: 2, order: 13 },
            { id: 'day2-6', title: 'Dispersal', time: '6:00 PM', day: 2, order: 14 }
        ];

        // Combine both days
        const fullSchedule = [...day1Schedule, ...day2Schedule];

        // Add each task to Firebase
        fullSchedule.forEach(task => {
            const taskRef = ref(db, `tasks/${task.order}`);
            set(taskRef, task);
        });

        sendNotification(
            "Schedule Initialized",
            "The complete hackathon schedule has been loaded."
        );
    };

    // Improved function to update current, previous, and next tasks
    // Improved function to update current, previous, and next tasks
    const updateCurrentTask = (taskList) => {
        const now = new Date().getTime();

        // Check if we're within the event dates
        const isEventActive = now >= START_DATE && now <= END_DATE;

        // If not during event, don't process tasks
        if (!isEventActive) {
            setCurrentTask(null);
            setNextTask(null);
            setPreviousTask(null);
            return;
        }

        if (!taskList || taskList.length === 0) return;

        // Filter out test tasks before processing
        const scheduledTaskList = taskList.filter(task =>
            !task.id.includes('test-task') &&
            !task.isTest &&
            task.title !== 'Test Task'
        );

        if (scheduledTaskList.length === 0) return;

        const currentTimeInMinutes = getCurrentTimeInMinutes();
        console.log("Current time in minutes:", currentTimeInMinutes);

        // Determine current day based on the event start time
        const currentEventDay = now < new Date("March 29, 2025 00:00:00 GMT+0530").getTime() ? 1 : 2;

        // Filter tasks for the current day
        const currentDayTasks = scheduledTaskList.filter(task =>
            task.day === currentEventDay
        );

        if (currentDayTasks.length === 0) return;

        // Convert task times to minutes and calculate time differences
        const tasksWithTimings = currentDayTasks.map(task => {
            const timeInMinutes = convertTo24HourFormat(task.time);
            let timeDiff = timeInMinutes - currentTimeInMinutes;

            // Handle edge case for early morning hours (after midnight)
            const currentHour = new Date().getHours();
            if (currentHour < 6 && task.time.includes('AM') && !task.time.includes('12:')) {
                timeDiff -= 24 * 60; // Adjust for next day's early morning events
            }

            return {
                ...task,
                timeInMinutes,
                timeDiff
            };
        });

        // Sort by absolute time difference to find closest events
        tasksWithTimings.sort((a, b) => Math.abs(a.timeDiff) - Math.abs(b.timeDiff));

        // Find current, next, and previous tasks
        const closestEvent = tasksWithTimings[0];

        if (closestEvent.timeDiff <= 0) {
            // Current event is the one that started most recently
            setCurrentTask(closestEvent);

            // Next event is the one with smallest positive time difference
            const nextEvents = tasksWithTimings.filter(t => t.timeDiff > 0);
            if (nextEvents.length > 0) {
                nextEvents.sort((a, b) => a.timeDiff - b.timeDiff);
                setNextTask(nextEvents[0]);
            } else {
                setNextTask(null);
            }

            // Previous event is the one that started before the current one
            const prevEvents = tasksWithTimings.filter(t =>
                t.timeDiff < closestEvent.timeDiff && t.id !== closestEvent.id
            );
            if (prevEvents.length > 0) {
                prevEvents.sort((a, b) => b.timeDiff - a.timeDiff);
                setPreviousTask(prevEvents[0]);
            } else {
                setPreviousTask(null);
            }
        } else {
            // The closest event is in the future, so it's the next event
            setNextTask(closestEvent);

            // Sort all events by time
            const timeOrderedTasks = [...tasksWithTimings].sort((a, b) =>
                a.timeInMinutes - b.timeInMinutes
            );

            // Find the index of the next event
            const nextEventIndex = timeOrderedTasks.findIndex(t => t.id === closestEvent.id);

            // Current event is the one before next (or null if next is the first)
            const currentEventIndex = nextEventIndex === 0 ? -1 : nextEventIndex - 1;
            setCurrentTask(currentEventIndex >= 0 ? timeOrderedTasks[currentEventIndex] : null);

            // Previous event is the one before current (or null if current is the first)
            const prevEventIndex = currentEventIndex === 0 ? -1 : currentEventIndex - 1;
            setPreviousTask(prevEventIndex >= 0 ? timeOrderedTasks[prevEventIndex] : null);
        }
    };


    // Toggle timeline view
    const toggleTimeline = () => {
        setShowTimeline(!showTimeline);
    };

    // Toggle between day 1 and day 2 and save preference to localStorage
    const toggleDay = () => {
        const newDay = currentDay === 1 ? 2 : 1;
        // Save to localStorage to persist across refreshes
        localStorage.setItem('currentHackathonDay', newDay.toString());
        setCurrentDay(newDay);
        // Update the current task with the new day
        updateCurrentTask(tasks);
        // Reschedule notifications for the new day
        scheduleNotifications(tasks);
    };

    // Initialize current day and time left
    useEffect(() => {
        const detectedDay = determineCurrentDay();
        setCurrentDay(detectedDay);
        setTimeLeft(calculateTimeLeft());
    }, []);

    // Fetch tasks and setup notifications
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
                day: data[key].day || 1,
                order: data[key].order || 0,
                isTest: data[key].isTest || false
            })) : [];

            console.log("Fetched tasks:", fetchedTasks);

            // If no tasks are found, initialize the schedule
            if (fetchedTasks.length === 0) {
                initializeSchedule();
                return;
            }

            // Sort tasks by day, then by time (with special handling for midnight)
            fetchedTasks.sort((a, b) => {
                if (a.day !== b.day) {
                    return a.day - b.day;
                }

                const timeA = convertTo24HourFormat(a.time);
                const timeB = convertTo24HourFormat(b.time);
                return timeA - timeB;
            });

            setTasks(fetchedTasks);
            setLoading(false);

            // Schedule notifications for the current day
            scheduleNotifications(fetchedTasks);

            // Update current, previous, and next tasks
            updateCurrentTask(fetchedTasks);
        });

        // Clean up on unmount
        return () => {
            unsubscribe();
            Object.values(upcomingNotifications).forEach(timeout => clearTimeout(timeout));
        };
    }, [currentDay]);  // Re-run when current day changes

    // Setup interval to update current task every minute
    useEffect(() => {
        updateCurrentTask(tasks); // Run immediately

        const taskUpdateInterval = setInterval(() => {
            updateCurrentTask(tasks);
        }, 60000); // Check every minute

        return () => clearInterval(taskUpdateInterval);
    }, [tasks, currentDay]);  // Add tasks and currentDay as dependencies

    // Update time left every second
    useEffect(() => {
        const interval = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
        }, 1000);

        return () => clearInterval(interval);
    }, [currentDay]);  // Add currentDay as dependency

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white md:pt-2 pb-8">
            <Background />

            <button
                onClick={handleGoHome}
                className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 bg-transparent border border-blue-500 rounded-full p-2 font-semibold shadow-lg hover:bg-blue-100 hover:scale-110 transition-all ease-in-out duration-300"
            >
                &#8592; Home
            </button>

            <div className="flex flex-col mt-56 md:mt-0">
                <h1 className="text-3xl md:text-5xl font-bold md:mt-8 text-gray-300 z-50">
                    DAY {currentDay} - {currentDay === 1 ? "March 28, 2025" : "March 29, 2025"}
                </h1>
            </div>

            <div
                className={`backdrop-blur-sm text-3xl md:text-6xl mb-8 border-b-2 w-3/4 rounded-3xl p-8 sm:p-12 border-blue-500 shadow-lg 
                ${timerStatus === 'starting_soon' ? 'text-yellow-300' :
                        timerStatus === 'event_ended' ? 'text-red-500' :
                            'text-green-500'}`}
            >
                {formatTime(timeLeft)}
            </div>

            {/* Display loading spinner while fetching tasks */}
            {loading ? (
                <div className="flex justify-center items-center w-full h-24">
                    <div className="spinner-border animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16"></div>
                </div>
            ) : (
                // Check if we're within event dates and have tasks
                timerStatus === 'running' ? (
                    <div className="flex flex-col md:flex-row justify-center items-center w-full md:w-4/5 space-y-4 md:space-y-0 md:space-x-4 m-4 mb-6">
                        {/* Previous task */}
                        <div className="backdrop-blur-sm flex-none w-3/4 md:w-1/4 text-center p-4 rounded-3xl text-xl border-2 opacity-50 shadow-lg shadow-gray-400">
                            {previousTask ? (
                                <>
                                    <h2>{previousTask.title}</h2>
                                    <p>{previousTask.time}</p>
                                </>
                            ) : (
                                <p>No previous task</p>
                            )}
                        </div>

                        {/* Current task */}
                        {currentTask && (
                            <div className="backdrop-blur-sm flex-none w-3/4 md:w-1/4 text-center p-4 rounded-3xl text-xl md:text-3xl font-bold border-2 border-blue-500 shadow-lg shadow-blue-500 hover:scale-105 transition-all ease-in-out duration-300">
                                <h2>{currentTask.title}</h2>
                                <p>{currentTask.time}</p>
                                <div className="mt-4 text-sm bg-green-600 px-3 py-1 rounded-full w-1/2 mx-auto animate-pulse">
                                    Now active
                                </div>
                            </div>
                        )}

                        {/* Next task */}
                        <div className="backdrop-blur-sm flex-none w-3/4 md:w-1/4 text-center p-4 rounded-3xl text-xl border-2 border-blue-700 shadow-lg shadow-blue-700 hover:scale-105 transition-all ease-in-out duration-300">
                            {nextTask ? (
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
                ) : (
                    // Outside event dates or no tasks
                    <div className="text-center text-2xl text-gray-300 mt-8">
                        {timerStatus === 'starting_soon'
                            ? 'Event will start soon'
                            : 'Event has concluded'}
                    </div>
                )
            )}

            {/* Timeline View (conditionally rendered) */}
            {showTimeline && !loading && (
                <div className="backdrop-blur-sm w-3/4 md:w-2/3 p-4 rounded-3xl border-2 border-blue-500 shadow-lg shadow-blue-600 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-center">Day {currentDay} Timeline</h2>
                    <div className="max-h-64 overflow-y-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-blue-500">
                                    <th className="p-2 text-left">Event</th>
                                    <th className="p-2 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks
                                    .filter(task =>
                                        !task.isTest &&
                                        !task.id.includes('test-task') &&
                                        task.day === currentDay
                                    )
                                    .sort((a, b) => convertTo24HourFormat(a.time) - convertTo24HourFormat(b.time))
                                    .map((task, index) => (
                                        <tr
                                            key={task.id}
                                            className={`border-b border-blue-700 ${currentTask && task.id === currentTask.id
                                                ? 'bg-blue-900 bg-opacity-50 font-bold'
                                                : ''
                                                }`}
                                        >
                                            <td className="p-2">{task.title}</td>
                                            <td className="p-2 text-right">{task.time}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="flex flex-row flex-wrap justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                <button
                    className="border-2 p-3 m-2 rounded-3xl border-blue-500 hover:scale-105 transition-all ease-in-out duration-300"
                    onClick={toggleTimeline}
                >
                    {showTimeline ? "Hide Timeline" : "Show Timeline"}
                </button>
            </div>
        </div>
    );

};

export default Realtime;