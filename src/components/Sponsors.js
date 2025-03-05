import React from "react";
import Dummy from "../assets/sponsor_logo.png";
import PSP1 from "../assets/scogo.png";
import TechPartner1 from "../assets/wolfram.png";
import TechPartner2 from "../assets/xyz.png";
import PlatformPartner from "../assets/hacktoskill.png";
import "./style/sectionLine.css";
import { motion } from "framer-motion";

const Sponsors = () => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="text-white p-4 md:p-8 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 section_header">
        <hr />
        <span>Our Sponsors</span>
        <hr />
      </h2>
      {/* <p className="text-2xl italic">Big thankyou to our sponsors!</p> */}

      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ delay: 8.3, duration: 1 }}
        variants={fadeInVariants}
      >
        {/* Title Sponsor */}
        {/* <div className="mb-4 md:mb-8">
          <h3 className="text-lg md:text-3xl font-light mb-2">
            Title Sponsors
          </h3>
          <div className="flex flex-col items-center">
            <img
              src={Dummy}
              alt="sponsor-1"
              className="max-w-full h-auto mb-2"
              width={175} // Set the desired width in pixels
              height={225} // Set the desired height in pixels
            />
            <p className="text-md">Name here!</p>
          </div>
        </div> */}

        {/* PS Partners */}
        <div className="mb-4 md:mb-8">
          <h3 className="text-lg md:text-xl font-semibold mb-2">
            Problem Statement Partners
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-around">
            <div className="mb-4 md:mb-8">
              <div className="flex flex-col items-center">
                <img
                  src={PSP1}
                  alt="sponsor-1"
                  className="max-w-full h-auto mb-2"
                  width={175} // Set the desired width in pixels
                  height={225} // Set the desired height in pixels
                />
                <p className="text-sm">Scogo Networks</p>
              </div>
            </div>

            {/* <div className="mb-4 md:mb-8">
              <div className="flex flex-col items-center">
                <img
                  src={Dummy}
                  alt="sponsor-1"
                  className="max-w-full h-auto mb-2"
                  width={175} // Set the desired width in pixels
                  height={225} // Set the desired height in pixels
                />
                <p className="text-sm">Name here!</p>
              </div>
            </div> */}

            {/* <div className="mb-4 md:mb-8">
              <div className="flex flex-col items-center">
                <img
                  src={Dummy}
                  alt="sponsor-1"
                  className="max-w-full h-auto mb-2"
                  width={175} // Set the desired width in pixels
                  height={225} // Set the desired height in pixels
                />
                <p className="text-sm">Name here!</p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Technology Partners */}
        <div className="mb-4 md:mb-8">
          <h3 className="text-lg md:text-xl font-semibold mb-2">
            Technology Partners
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-around">
            <div className="mb-4 md:mb-8">
              <div className="flex flex-col items-center">
                <img
                  src={TechPartner1}
                  alt="sponsor-1"
                  className="max-w-full h-auto mb-2"
                  width={175} // Set the desired width in pixels
                  height={225} // Set the desired height in pixels
                />
                <p className="text-sm">Wolfram</p>
              </div>
            </div>

            <div className="mb-4 md:mb-8">
              <div className="flex flex-col items-center">
                <img
                  src={TechPartner2}
                  alt="sponsor-1"
                  className="max-w-full h-auto mb-2"
                  width={175} // Set the desired width in pixels
                  height={225} // Set the desired height in pixels
                />
                <p className="text-sm">.xyz Domains</p>
              </div>
            </div>

            {/* <div className="mb-4 md:mb-8">
              <div className="flex flex-col items-center">
                <img
                  src={Dummy}
                  alt="sponsor-1"
                  className="max-w-full h-auto mb-2"
                  width={175} // Set the desired width in pixels
                  height={225} // Set the desired height in pixels
                />
                <p className="text-sm">Name here!</p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Platform Partner */}
        <div className="mb-4 md:mb-8">
          <h3 className="text-lg md:text-xl font-semibold mb-2">
            Platform Partners
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-around">
            <div className="mb-4 md:mb-8">
              <div className="flex flex-col items-center">
                <img
                  src={PlatformPartner}
                  alt="sponsor-1"
                  className="max-w-full h-auto mb-2"
                  width={175} // Set the desired width in pixels
                  height={225} // Set the desired height in pixels
                />
                <p className="text-sm">Hack2Skill</p>
              </div>
            </div>
          </div>
        </div>

        {/* Miscellaneous Sponsors */}
        {/* <div>
        <h3 className="text-lg md:text-xl font-semibold mb-2">
          Miscellaneous Sponsors
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-around">
          <div className="items-center text-center mb-4">
            <img
              src={TitleSponsor}
              alt="co-sponsor-2"
              className="max-w-full h-auto mb-2"
              width={100} // Set the desired width in pixels
              height={150} // Set the desired height in pixels
            />
          </div>

          <div className="text-center mb-4">
            <img
              src={TitleSponsor}
              alt="misc-sponsor-1"
              className="max-w-full h-auto mb-2"
              width={100} // Set the desired width in pixels
              height={150} // Set the desired height in pixels
            />
          </div>

          <div className="text-center mb-4">
            <img
              src={TitleSponsor}
              alt="misc-sponsor-2"
              className="max-w-full h-auto mb-2"
              width={100} // Set the desired width in pixels
              height={150} // Set the desired height in pixels
            />
          </div>
          <div className="text-center mb-4">
            <img
              src={TitleSponsor}
              alt="misc-sponsor-2"
              className="max-w-full h-auto mb-2"
              width={100} // Set the desired width in pixels
              height={150} // Set the desired height in pixels
            />
          </div>
        </div>
      </div> */}
      </motion.div>
    </div>
  );
};

export default Sponsors;
