import React, { useEffect, useState } from "react";
import { db, ref, onValue } from "../firebase";

function TeamList() {
  const [teams, setTeams] = useState({});

  useEffect(() => {
    const teamRef = ref(db, "team_members"); // fixed this line

    const unsubscribe = onValue(teamRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const membersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        const groupedTeams = {};
        membersArray.forEach((member) => {
          if (!groupedTeams[member.teamName]) {
            groupedTeams[member.teamName] = [];
          }
          groupedTeams[member.teamName].push(member);
        });

        setTeams(groupedTeams);
      } else {
        setTeams({});
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Hackathon Teams</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
        {Object.keys(teams).map((teamName) => (
          <div
            key={teamName}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 group relative"
          >
            <div className="w-full h-64 overflow-hidden relative">
              <img
                className="w-full h-full object-cover"
                src={teams[teamName][0]?.imageUrl || "https://placehold.co/400x300"}
                alt={teamName}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">{teamName}</h3>
              </div>
            </div>

            <div className="absolute inset-0 bg-white p-4 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-y-auto">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">{teamName}</h3>
              <div className="flex flex-col gap-4">
                {teams[teamName].map((member) => (
                  <div key={member.id} className="border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={member.imageUrl || "https://placehold.co/100x100"}
                          alt={member.name}
                        />
                      </div>
                      <div className="text-gray-900">
                        <p className="font-medium">{member.name}</p>
                        <div className="flex gap-2 mt-1">
                          {member.github && (
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-900 transition"
                            >
                              GitHub
                            </a>
                          )}
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                            >
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamList;
