import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import "./style/sectionLine.css";

const ContactUs = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeInUpTransition = {
    delay: 9.5,
    duration: 1,
    ease: "easeInOut",
  };
  return (
    <div id="contact" className="contact-section">
  
    <div className="text-white p-4 md:p-8 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 section_header">
        <hr />
        <span>Reach Us</span>
        <hr />
      </h2>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariants}
        transition={fadeInUpTransition}
        className="your-section-styles"
      >
        <div className="flex flex-col md:flex-row justify-center">
          {/* Contact Information */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h3 className="lg:text-2xl font-semibold text-xl mt-2 mb-2 lg:text-center md:text-center lg:px-20">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              Vidyavardhini's College of Engineering and Technology
            </h3>
            <p className="text-lg md:text-base lg:text-left md:text-center lg:px-20">
              K.T. Marg, Vartak College Campus, Vasai Road,
              <br />
              Vasai-Virar, Maharashtra 401202
            </p>

            <h3 className="text-xl md:text-2xl font-bold mt-4 mb-2 lg:text-left md:text-center px-20">
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              For Enquiries:
            </h3>
            <div className="mb-2">
              <p className="text-lg md:text-base lg:text-left md:text-center lg:px-20">
                Amey Chaudhari: +91 96534 92872
              </p>
            </div>
            <div>
              <p className="text-lg md:text-base mb-2 lg:text-left md:text-center lg:px-20">
                Shreya Wankkhede: +91 96195 08298
              </p>
            </div>
            <div>
              <p className="text-lg md:text-base mb-2 lg:text-left md:text-center lg:px-20">
                Shagun Upadhyay: +91 96193 42859
              </p>
            </div>
            <div>
              <p className="text-xl md:text-base lg:text-left md:text-center lg:px-20">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="mr-2"
                  size="2xl"
                />
                Email: <a href="mailto:mlsc@vcet.edu.in">mlsc@vcet.edu.in</a>
              </p>
            </div>
          </div>

          {/* Embedded Google Maps */}
          <div className="w-full md:w-1/2 overflow-hidden lg:px-20">
            <iframe
              title="College Location"
              className="mt-4 w-full lg:rounded-md"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.659991421949!2d72.82615867523565!3d19.383869581885122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7aec0a4b41bef%3A0xbd1a4ca919d6a613!2sVidyavardhini&#39;s%20College%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1701160672294!5m2!1sen!2sin"
              width="450"
              height="345"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
  );
};

export default ContactUs;
