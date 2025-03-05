import React from "react";
import { motion } from "framer-motion";
import winnerImg from "../assets/1.png";
import firstrunnerupImg from "../assets/2.png";
import secondrunnerupImg from "../assets/3.png";

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const fadeInTransition = {
  delay: 7,
  duration: 1, // You can adjust the duration as needed
};

const PrizePodium = () => {
  const scaleVariants = {
    hover: { scale: 1.1 },
  };

  return (
    <div className="px-4 sm:px-8">
      <h2 className="text-3xl font-bold mb-6 sm:mb-12 section_header text-white">
        <hr /> <span>Prizes up for grabs!</span>
        <hr />
      </h2>
      <motion.div
        className="flex flex-col sm:flex-row justify-around items-center sm:mx-60"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        transition={fadeInTransition}
      >
        {/* Podium Item 1 */}
        <motion.div
          className="text-center flex flex-col items-center mb-4 sm:mb-0"
          whileHover="hover"
          variants={scaleVariants}
        >
          <motion.h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
            1st Runner-up
          </motion.h3>
          <motion.img
            className="max-w-full h-auto w-32 sm:w-48"
            src={firstrunnerupImg}
            alt="1st Runner-up"
            style={{ zIndex: 1 }}
          />
          <motion.p className="text-white text-sm sm:text-xl mt-2">
            ₹ 5,000 + Certificate + <br />Internship Opportunity <br /> + Goodies
          </motion.p>
        </motion.div>

        {/* Podium Item 2 (Bigger Image) */}
        <motion.div
          className="text-center flex flex-col items-center mb-4 sm:mb-0"
          whileHover="hover"
          variants={scaleVariants}
        >
          <motion.h3 className="text-white text-2xl sm:text-4xl font-bold mb-2">
            Winner
          </motion.h3>
          <motion.img
            className="max-w-full h-auto w-44 sm:w-64"
            src={winnerImg}
            alt="Winner"
            style={{ zIndex: 1 }}
          />
          <motion.p className="text-white text-sm sm:text-xl mt-2">
            ₹ 10,000 + Certificate + <br />Internship Opportunity + Goodies
          </motion.p>
        </motion.div>

        {/* Podium Item 3 */}
        <motion.div
          className="text-center flex flex-col items-center"
          whileHover="hover"
          variants={scaleVariants}
        >
          <motion.h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
            2nd Runner-up
          </motion.h3>
          <motion.img
            className="max-w-full h-auto w-32 sm:w-48"
            src={secondrunnerupImg}
            alt="2nd Runner-up"
            style={{ zIndex: 1 }}
          />
          <motion.p className="text-white sm:text-xl text-sm mt-2">
            ₹ 2,500 + Certificate + <br />Internship Opportunity <br /> + Goodies
          </motion.p>
        </motion.div>
      </motion.div>
      <div className="text-white text-right mr-20 mt-4 mb-2 text-sm">
        *Prizes are for each track
      </div>
    </div>
  );
};

export default PrizePodium;