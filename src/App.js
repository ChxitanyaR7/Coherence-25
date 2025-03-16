import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useParams, Navigate } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Domains from "./components/Domains";
import Schedule from "./components/Schedule";
import GeneralGuidelines from "./components/GeneralGuidelines";
import FAQs from "./components/FAQs";
import Sponsors from "./components/Sponsors";
import ContactUs from "./components/Contact";
import Footer from "./components/Footer";
import PrizePodium from "./components/PrizePodium";
import YetToRevealPage from "./components/YetToRevealPage";
import Introduction from "./components/Introduction";
import Timeline from "./components/Timeline";
import Realtime from "./components/Realtime";
import RealtimeUpdate from "./components/RealtimeUpdate"; // Import your new RealtimeUpdate component
import Form from "./components/NetworkingForm";
import TeamList from "./components/NetworkingList";
import Shortlisted from './components/Shortlisted'

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
                    {/* <Shortlisted></Shortlisted> */}
                    <Schedule />
                    <Timeline />
                    <GeneralGuidelines />
                    <PrizePodium />
                    {/* <Sponsors /> */}
                    <FAQs />
                    <ContactUs />
                    <Footer />
                  </div>
                }
              />
              {/* New route for /realtime */}
              <Route path="/realtime" element={<Realtime />} />

              {/* New route for /NetworkingForm */}
              <Route path="/networking-form" element={<Form />} />

              {/* New route for /NetworkingList */}
              <Route path="/networking-list" element={<TeamList />} />

              {/* New route for /realtime/:password */}
              <Route path="/realtime/:password" element={<PasswordValidation />} />
              <Route path="/shortlisted-teams" element={<Shortlisted />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
}

// Access the password from the environment variable
const SSH_PASSWORD = process.env.REACT_APP_SSH_PASSWORD;

function PasswordValidation() {
  const { password } = useParams();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    if (password === SSH_PASSWORD) {
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

export default App;
