import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useParams, Navigate } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Domains from "./components/Domains";
import Schedule from "./components/Schedule";
import GeneralGuidelines from "./components/GeneralGuidelines";
import FAQs from "./components/FAQs";
import ContactUs from "./components/Contact";
import Footer from "./components/Footer";
import PrizePodium from "./components/PrizePodium";
import YetToRevealPage from "./components/YetToRevealPage";
import Introduction from "./components/Introduction";
import Timeline from "./components/Timeline";
import Realtime from "./components/Realtime";
import RealtimeUpdate from "./components/RealtimeUpdate";
import Form from "./components/NetworkingForm";
import TeamList from "./components/NetworkingList";
import Shortlisted from './components/Shortlisted';
import LeaderboardUpdate from "./components/LeaderboardUpdate";
import Leaderboard from "./components/Leaderboard"; // Assuming this is the Leaderboard component.
import Chatbot from "./components/Chatbot";
import Sponsors from "./components/Sponsors";
import AdminCombinedRoutes from "./AdminCombinedRoutes";

function App() {
  const [showIntroduction, setShowIntroduction] = useState(false);
  const [showYetToRevealPage, setShowYetToRevealPage] = useState(false);
  const [showRemainingComponents, setShowRemainingComponents] = useState(false);

  useEffect(() => {
    const revealDate = new Date("December 3, 2023 01:00:00 GMT+0530");
    const currentDate = new Date();

    if (currentDate < revealDate) {
      setShowYetToRevealPage(true);
    } else {
      setShowIntroduction(true);

      const delay = setTimeout(() => {
        setShowIntroduction(false);
        setShowRemainingComponents(true);
      }, 3000);

      return () => clearTimeout(delay);
    }
  }, []);

  return (
    <div>
      <Router>
        <div className="App bg-black">
          {/* Display YetToRevealPage until reveal date */}
          {showYetToRevealPage && <YetToRevealPage className="yet-to-reveal" />}

          {/* Display Introduction after reveal date */}
          {showIntroduction && <Introduction />}

          {/* Display other components after a delay */}
          {showRemainingComponents && (
            <div style={{ position: "relative", zIndex: 1 }}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <div>
                      <Home />
                      <About />
                      <Domains />
                      <Schedule />
                      <Timeline />
                      <GeneralGuidelines />
                      <PrizePodium />
                      <Sponsors />
                      <FAQs />
                      <ContactUs />
                      <Footer />
                    </div>
                  }
                />
                <Route path="/realtime" element={<Realtime />} />
                <Route path={`/realtime/${process.env.REACT_APP_SSH_PASSWORD}`} element={<RealtimeUpdate />} />

                <Route path="/networking-form" element={<Form />} />
                <Route path="/networking-list" element={<TeamList />} />
                <Route path={`/leaderboard/${process.env.REACT_APP_SSH_PASSWORD}`} element={<LeaderboardPasswordValidation />} />
                <Route path="/shortlisted-teams" element={<Shortlisted />} />

                {/* Add route for /leaderboard */}
                <Route path="/leaderboard" element={<Leaderboard />} />


                {/* Combined Routes */}
                <Route path={`/admin/${process.env.REACT_APP_SSH_PASSWORD}`} element={<AdminCombinedRoutes />} />

              </Routes>
              <Chatbot />
            </div>
          )}
        </div>
      </Router>

    </div>
  );
}

// Access the password from the environment variable
const REACT_APP_REALTIME_PASSWORD = process.env.REACT_APP_REALTIME_PASSWORD;
const REACT_APP_LEADERBOARD_PASSWORD = process.env.REACT_APP_LEADERBOARD_PASSWORD;


function PasswordValidation() {
  const { password } = useParams();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    if (password === REACT_APP_REALTIME_PASSWORD) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [password]);

  if (isValid === null) {
    return <div>Loading...</div>;
  }

  if (isValid === false) {
    return (
      <div>
        <h2>Incorrect Password</h2>
        <Navigate to="/realtime" replace />
      </div>
    );
  }

  // If the password is valid, render the RealtimeUpdate component
  return <RealtimeUpdate />;
}

function LeaderboardPasswordValidation() {
  const { password } = useParams();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    if (password === REACT_APP_LEADERBOARD_PASSWORD) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [password]);

  if (isValid === null) {
    return <div>Loading...</div>;
  }

  if (isValid === false) {
    return (
      <div>
        <h2>Incorrect Password</h2>
        <Navigate to="/leaderboard" replace />
      </div>
    );
  }

  // If the password is valid, render the LeaderboardUpdate component
  return <LeaderboardUpdate />;
}

export default App;
