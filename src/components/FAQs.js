import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { motion, useAnimation } from "framer-motion";
import WebAppDevImage from "../assets/web_app.jpeg";
import AIMLImage from "../assets/Aiml.jpg";
import BlockchainImage from "../assets/blockchain.jpg";
import Glimpse1 from "../assets/glimps (1).jpeg";
import Glimpse2 from "../assets/glimps (2).jpg";
import Glimpse3 from "../assets/glimps (3).jpg";
import "./style/sectionLine.css";

const FAQsAndDomains = () => {
  const [expandedQuestions, setExpandedQuestions] = useState([]);
  const controls = useAnimation();
  const [isMounted, setIsMounted] = useState(false);

  const toggleQuestion = (index) => {
    setExpandedQuestions((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const faqsData = [
    { question: "How do I register for the hackathon?", answer: "You can register by visiting our registration page and following the instructions." },
    { question: "What is the allowed Team size?", answer: "1-4 Members in a single team" },
    { question: "What is the registration cost?", answer: "Only ₹500 per team." },
    { question: "When will the problem statements be released?", answer: "All the problem statements will be released a day before the event." },
    { question: "Are travel expenses included too?", answer: "No, the participants are responsible for covering their travel expenses." },
    { question: "Is it an Online or an Offline Hackathon?", answer: "Coherence 25 is being hosted Offline only." },
    { question: "What are the eligibility criteria?", answer: "The hackathon is open to all participants." },
    { question: "Can I participate as an individual or do I need a team?", answer: "Both individual and team participation are allowed. You can participate alone or with a team." },
    { question: "Can a member be a part of two teams?", answer: "No, every member should be part of a single team." },
  ];

  const domains = [
    { title: "Web/App Development", description: "Craft responsive websites and cross-platform mobile apps with the latest technologies.", image: WebAppDevImage },
    { title: "Blockchain", description: "Empower decentralized solutions and build blockchain applications for the future.", image: BlockchainImage },
    { title: "AI/ML", description: "Explore artificial intelligence and machine learning to solve complex problems.", image: AIMLImage },
  ];

  const glimpses = [Glimpse1, Glimpse2, Glimpse3];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      controls.start({ x: 0 });
    }
  }, [isMounted, controls]);

  return (
    <div className="px-8">
      {/* Glimpse of Coherence Section */}
      <h2 className="text-3xl text-white font-bold text-center section_header">
        <hr />
        <span>Glimpse of Coherence</span>
        <hr />
      </h2>

      <motion.div initial={{ x: 1500 }} animate={controls} transition={{ delay: 3, duration: 1 }} className="text-white py-8 md:py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {glimpses.map((image, index) => (
              <motion.div key={index} className="rounded-3xl border border-blue-700 bg-black p-4 sm:p-6 shadow-md" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img src={image} alt={`Glimpse ${index + 1}`} className="w-full h-80 object-cover mb-4 rounded-md" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>



      {/* FAQ Section */}
      <h2 className="text-2xl md:text-3xl text-white font-bold mb-4 section_header">
        <hr />
        <span>Frequently Asked Questions</span>
        <hr />
      </h2>

      <motion.div initial={{ x: -1500 }} animate={controls} transition={{ delay: 8.5, duration: 1 }} className="text-white p-4 md:p-8 px-4 md:px-28">
        {faqsData.map((faq, index) => (
          <div
            key={index}
            onClick={() => toggleQuestion(index)}
            className={`rounded-3xl p-7 mb-4 border border-blue-700 text-left relative transition-colors duration-300 ${expandedQuestions.includes(index)
              ? "bg-blue-700"
              : "bg-black"
              } hover:bg-blue-700`}
          >
            <div className="flex justify-between items-center">
              <div className="font-bold text-xl md:text-2xl mb-2">
                {faq.question}
              </div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`ml-2 transition-transform transform ${expandedQuestions.includes(index) ? "rotate-180" : ""
                  }`}
              />
            </div>
            {expandedQuestions.includes(index) && (
              <div className="mt-2">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default FAQsAndDomains;
