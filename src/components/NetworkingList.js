import React, { useEffect, useState } from "react";
import { db, ref, onValue } from "../firebase";

function TeamList() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const teamRef = ref(db, "team_members"); // Reference to the Realtime Database

    // Listen for changes
    const unsubscribe = onValue(teamRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const membersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTeamMembers(membersArray);
      } else {
        setTeamMembers([]);
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Team Members</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 w-full ">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2"
          >
            <div className="w-full h-[200px] overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={member.imageUrl || "https://placehold.co/241x178"}
                alt={member.name}
              />
            </div>
            <div className="p-4 flex flex-col justify-start items-start text-gray-900">
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <div className="text-[#959393] text-sm">Team Name: {member.teamName}</div>
              <div className="py-4 flex justify-start items-center gap-3">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  GitHub
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamList;
