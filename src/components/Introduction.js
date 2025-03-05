import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import imageSrc from "../assets/mlsc-vcet.png"; // Replace with your image path

const SplitLogoEffect = () => {
  const [showText, setShowText] = useState(false);
  const [merged, setMerged] = useState(false);

  useEffect(() => {
    setTimeout(() => setMerged(true), 1000); // Image pieces merge in 1 sec
    setTimeout(() => setShowText(true), 2000); // Show text after merge completes
    setTimeout(() => setShowText(false), 4000); // Hide text after 1.5 sec
  }, []);

  // Merge effect for image pieces
  const mergeVariants = {
    initial: (pos) => ({ x: pos.x, y: pos.y, opacity: 0 }),
    animate: { x: 0, y: 0, opacity: 1, transition: { duration: 1, ease: "easeOut" } },
  };

  // Glitch effect for text with minor shake
  const glitchEffect = {
    x: [0, -2, 2, -2, 2, 0],
    color: ["#1f3860", "#0474cf", "#0078D9", "#1f3860", "#fff"],
    transition: { duration: 0.5, ease: "easeInOut", repeat: Infinity },
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black overflow-hidden">
      {/* Image Merging Animation */}
      <motion.div className="relative w-64 h-64">
        {/* Top-left piece */}
        <motion.div
          custom={{ x: "-50vw", y: "-50vh" }}
          initial="initial"
          animate={merged ? "animate" : "initial"}
          variants={mergeVariants}
          className="absolute w-full h-full"
          style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: "cover", clipPath: "inset(0% 50% 50% 0%)" }}
        />
        {/* Top-right piece */}
        <motion.div
          custom={{ x: "50vw", y: "-50vh" }}
          initial="initial"
          animate={merged ? "animate" : "initial"}
          variants={mergeVariants}
          className="absolute w-full h-full"
          style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: "cover", clipPath: "inset(0% 0% 50% 50%)" }}
        />
        {/* Bottom-left piece */}
        <motion.div
          custom={{ x: "-50vw", y: "50vh" }}
          initial="initial"
          animate={merged ? "animate" : "initial"}
          variants={mergeVariants}
          className="absolute w-full h-full"
          style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: "cover", clipPath: "inset(50% 50% 0% 0%)" }}
        />
        {/* Bottom-right piece */}
        <motion.div
          custom={{ x: "50vw", y: "50vh" }}
          initial="initial"
          animate={merged ? "animate" : "initial"}
          variants={mergeVariants}
          className="absolute w-full h-full"
          style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: "cover", clipPath: "inset(50% 0% 0% 50%)" }}
        />
      </motion.div>

      {/* Text Appears Below Image When Merged Without Shifting Screen */}
      {showText && (
        <motion.h1
          className="text-white text-5xl font-bold mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, ...glitchEffect }}
          style={{padding: "15px"}}
        >
          Endless Possibilities Await You...
        </motion.h1>
      )}
    </div>
  );
};

export default SplitLogoEffect;