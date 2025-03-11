import React from "react";
import "../components/style/Timeline.css";

const Timeline = () => {
  return (
    <div>
      <div className="timeline-wrapper ">
        <h1 className="text-white text-center md:text-left text-3xl">
          Registration Process
        </h1>

        {/* registration section */}

        <div className="flex flex-col sm:flex-row justify-center items-center scale-90 sm:p-10 gap-6">
          <div className="popup-reg mobile-left">
            <div className="popup-number-reg">1</div>
            <div className="popup-details-reg tracking-tight">
              <div className="popup-title-reg">6th March</div>
              Registration goes live on Unstop
            </div>
          </div>
          <div className="bg-blue-400 w-7 h-2 rounded-lg"></div>
          <div className="popup-reg mobile-right">
            <div className="popup-number-reg">2</div>
            <div className="popup-details-reg">
              <div className="popup-title-reg">16th March (11:59 PM)</div>
              Registration Closes.
            </div>
          </div>
          <div className="bg-blue-400 w-7 h-2 rounded-lg"></div>
          <div className="popup-reg mobile-left">
            <div className="popup-number-reg">3</div>
            <div className="popup-details-reg">
              <div className="popup-title-reg">20th - 21st March</div>
              Shortlisted teams
            </div>
          </div>
          <div className="bg-blue-400 w-7 h-2 rounded-lg"></div>
          <div className="popup-reg mobile-right">
            <div className="popup-number-reg">4</div>
            <div className="popup-details-reg">
              <div className="popup-title-reg">28th - 29th March</div>
              Offline Hackathon event dates
            </div>
          </div>
        </div>

        {/* DAY 1 */}

        <h1 className=" text-white text-center md:text-left text-3xl">
          DAY 1 - March 28, 2025
        </h1>
        <div className="time h-[90vh] flex justify-center items-center scale-90 sm:p-20">
          <div className="timeline-container">
            <div className="timeline-point">
              <i className="fa-solid fa-registered"></i>
              <div className="popup">
                <div className="popup-number">1</div>
                <div className="popup-details">
                  <div className="popup-title">12:00 PM</div>
                  Reporting and Registration
                </div>
              </div>
            </div>

            <div className="timeline-point">
              <i className="fa-solid fa-copyright"></i>
              <div className="popup">
                <div className="popup-number">2</div>
                <div className="popup-details">
                  <div className="popup-title text-wrap">1:00 PM</div>
                  Inauguration Ceremony:{" "}
                  <p className="text-gray-400 text-sm">
                    Releasing problem Statements & Overview of Rules and
                    Regulations
                  </p>
                </div>
              </div>
            </div>

            <div className="timeline-point">
              <i class="fa-solid fa-terminal"></i>
              <div className="popup">
                <div className="popup-number">3</div>
                <div className="popup-details">
                  <div className="popup-title">2:00 PM</div>
                  Coding Begins
                </div>
              </div>
            </div>

            <div className="timeline-point">
              <i class="fa-solid fa-person-chalkboard"></i>
              <div className="popup">
                <div className="popup-number">4</div>
                <div className="popup-details">
                  <div className="popup-title">4:30 PM</div>
                  Mentoring Round 1 Starts
                </div>
              </div>
            </div>

            <div className="timeline-point">
              <i class="fa-solid fa-utensils"></i>
              <div className="popup">
                <div className="popup-number">5</div>
                <div className="popup-details">
                  <div className="popup-title">5:00 PM</div>
                  Evening Snacks
                </div>
              </div>
            </div>

            <div className="timeline-point">
              <i class="fa-solid fa-person-chalkboard"></i>
              <div className="popup">
                <div className="popup-number">6</div>
                <div className="popup-details">
                  <div className="popup-title">8:00 PM</div>
                  Mentoring Round 2 Starts
                </div>
              </div>
            </div>

            <div className="timeline-point">
              <i class="fa-solid fa-utensils"></i>
              <div className="popup">
                <div className="popup-number">7</div>
                <div className="popup-details">
                  <div className="popup-title">9:00 PM</div>
                  Dinner Break
                </div>
              </div>
            </div>

            <div className="timeline-point">
              <i class="fa-solid fa-utensils"></i>
              <div className="popup">
                <div className="popup-number">8</div>
                <div className="popup-details">
                  <div className="popup-title">12:00 PM</div>
                  Midnight Snacks
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DAY 2 */}

        <h1 className=" text-white text-center md:text-left text-3xl">
          DAY 2 - March 29, 2025
        </h1>

        <div className="time h-[90vh] flex justify-center items-center scale-90 sm:p-10">
          <div className="timeline-container">
            <div className="timeline-point">
              <i className="fa-solid fa-utensils"></i>
              <div className="popup">
                <div className="popup-number">1</div>
                <div className="popup-details">
                  <div className="popup-title">8:00 AM</div>
                  Breakfast
                </div>
              </div>
            </div>

            <div className="timeline-point">
              <i className="fa-solid fa-utensils"></i>
              <div className="popup">
                <div className="popup-number">2</div>
                <div className="popup-details">
                  <div className="popup-title">12:00 PM</div>
                  Lunch
                </div>
              </div>
            </div>

            <div className="timeline-point">
              <i class="fa-solid fa-laptop"></i>
              <div className="popup">
                <div className="popup-number">3</div>
                <div className="popup-details">
                  <div className="popup-title">2:00 PM</div>
                  Coding Ends
                </div>
              </div>
            </div>

            <div className="timeline-point">
              <i class="fa-solid fa-person-chalkboard"></i>
              <div className="popup">
                <div className="popup-number">4</div>
                <div className="popup-details">
                  <div className="popup-title">3:00 PM</div>
                  Final presentation
                </div>
              </div>
            </div>

            <div className="timeline-point">
              <i class="fa-solid fa-square-poll-vertical"></i>
              <div className="popup">
                <div className="popup-number">5</div>
                <div className="popup-details">
                  <div className="popup-title">5:00 PM</div>
                  Result Announcement and Distribution
                </div>
              </div>
            </div>

            <div className="timeline-point">
              <i class="fa-solid fa-hourglass-end"></i>
              <div className="popup">
                <div className="popup-number">6</div>
                <div className="popup-details">
                  <div className="popup-title">6:00 PM</div>
                  Dispersal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
