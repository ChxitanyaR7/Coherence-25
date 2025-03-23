import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Background from "./Background";
import krisha from "../assets/coherence logo.png";

export default function Shortlisted() {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetch("/shortlisted.json")
      .then((response) => response.json())
      .then((data) => setTeams(data))
      .catch((error) => console.error("Error fetching teams:", error));
  }, []);

  const filteredTeams = teams.filter((team) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      team.name.toLowerCase().includes(lowerSearch) ||
      team.leader.toLowerCase().includes(lowerSearch) 
      // ||
      // team.college.toLowerCase().includes(lowerSearch) ||
      // team.category.toLowerCase().includes(lowerSearch)
    );
  });

  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTeams = filteredTeams.slice(startIndex, startIndex + itemsPerPage);

  const handleGoHome = () => {
    navigate("/"); // Navigate to the home page
  };

  // Function to calculate the visible page buttons (just two)
  const pageButtons = () => {
    const visiblePages = [];

    // Only show current page and next page or current page and previous page
    if (currentPage < totalPages) {
      visiblePages.push(currentPage, currentPage + 1);
    } else if (currentPage > 1) {
      visiblePages.push(currentPage - 1, currentPage);
    }

    return visiblePages;
  };

  return (
    <div className="home p-4 md:p-8 text-center min-h-screen flex flex-col justify-center items-center w-full">
      <Background />

      <button
        onClick={handleGoHome}
        className="z-50 text-sm md:text-md absolute top-4 left-4 text-blue-500 hover:text-blue-700 bg-transparent border border-blue-500 rounded-full p-2 font-semibold shadow-lg hover:bg-blue-100 hover:scale-110 transition-all ease-in-out duration-300"
      >
        &#8592; Home
      </button>

      <img src={krisha} alt="Coherence Logo" className="mt-10 md:mt-1 w-2/3 md:w-1/3 z-50" />

      <section className="relative z-10 py-2 px-4 w-full max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-white lg:mb-8 xl:mb-8 sm:mb-4 md:mb-4 mb-4">
            Shortlisted Teams
          </h2>
        </motion.div>

        <input
          type="text"
          placeholder="Search Teams"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search change
          }}
          className="w-full text-white max-w-md px-2 py-1.5 md:px-3 md:py-2 mb-4 border bg-transparent backdrop-blur-sm border-gray-300 rounded-3xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="overflow-x-auto md:overflow-hidden w-full rounded-3xl border-4 border-blue-900 shadow-lg shadow-blue-500">
          <table className="w-full min-w-1/2 shadow-lg backdrop-blur-sm bg-slate-400/5 text-white">
            <thead className="bg-blue-900 border-b border-blue-500">
              <tr className="text-xs sm:text-sm md:text-base ">
                <th className="p-4 font-bold border-r border-blue-500 whitespace-nowrap w-1/2">Team Name</th>
                <th className="p-4 font-bold  border-blue-500 whitespace-nowrap w-1/2">Leader</th>
              </tr>
            </thead>

            <tbody>
              {currentTeams.map((team) => (
                <tr key={team.id} className="hover:bg-blue-950 transition-all ease-out duration-300 hover:scale-105 text-xs sm:text-sm md:text-base">
                  <td className="p-4 border-r border-blue-500 text-center whitespace-nowrap w-1/2">{team.name}</td>
                  <td className="p-4  border-blue-500 text-center whitespace-nowrap w-1/2">{team.leader}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
            {/* Back Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-4 pb-2 pt-2 bg-blue-400/90 text-white border border-blue-600 rounded-3xl disabled:opacity-50 text-xs sm:text-sm md:text-base hover:scale-110 transition-all ease-in-out disabled:scale-100"
            >
              Back
            </button>

            {/* Page Buttons */}
            {pageButtons().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-4 py-4 pb-2 pt-2 rounded-3xl border border-blue-600 transition-all text-xs sm:text-sm md:text-base ${
                  pageNumber === currentPage ? "bg-blue-900 shadow-md shadow-blue-100 text-white" : "bg-white text-blue-600"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-4 pb-2 pt-2 bg-transparent text-blue-400 font-bold border-2 border-blue-400 rounded-3xl disabled:opacity-50 text-xs sm:text-sm md:text-base hover:scale-110 transition-all ease-in-out disabled:scale-100"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
