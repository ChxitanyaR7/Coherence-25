import React, { useRef } from "react";
import "./style/sectionLine.css";
import "./style/Timeline.css";
import { motion } from "framer-motion";


const Schedule = () => {
  const scrollRef = useRef(null);

  return (
   <div>
     <div className="">
      {/* Header */}
      <div className="px-4 md:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white section_header">
          <hr />
          <span>Event Schedule</span>
          <hr />
        </h2>
      </div>
    </div>

   </div>
  );
};

export default Schedule;
