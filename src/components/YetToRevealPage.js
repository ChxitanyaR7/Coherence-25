import React from "react";
import underConstructionImage from "../assets/building.jpeg"; // Add the correct path to your image

const YetToRevealPage = () => {
  return (
    <>
      <main className="grid h-screen place-items-center bg-white text-slate-950 px-6 lg:px-8">
        <div className="text-center">
          <p className="text-3xl font-bold text-slate-950">
            <i>Oops! You came little early. We're still building this page...</i>
          </p>

          <img
            src={underConstructionImage}
            alt="Under Construction"
            className="mx-auto mb-8"
            style={{ maxWidth: "40%" }}
          />
          <p className="mt-6 text-base leading-7">
            We're working hard to bring you a better experience. The page you're
            looking for will be back soon! <br />
            <i>- Team MLSC ❤️</i>
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="tel:+91 8291166914" // Replace with your actual contact number
              className="text-sm font-semibold text-gray-300"
            >
              Contact support <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default YetToRevealPage;
