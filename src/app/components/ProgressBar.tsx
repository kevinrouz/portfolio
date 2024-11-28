"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GiFlyingFlag } from "react-icons/gi";
import { FaFlagCheckered } from "react-icons/fa";
import confetti from "canvas-confetti";

const ProgressBar: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = document.querySelectorAll(".section");
    setTotalSections(sections.length);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = Array.from(sections).indexOf(entry.target);
            setCurrentSection(sectionIndex);

            if (sectionIndex === totalSections - 1) {
              if (carRef.current) {
                const carPosition = carRef.current.getBoundingClientRect();
                confetti({
                  particleCount: 35,
                  spread: 160,
                  origin: {
                    x: (carPosition.left + carPosition.right) / 2 / window.innerWidth,
                    y: (carPosition.top + carPosition.bottom) / 2 / window.innerHeight,
                  },
                  colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"],
                });
              }
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.5,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [totalSections]);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center items-center">
      <GiFlyingFlag className="text-white text-sm mr-1" />
      <div
        ref={progressBarRef}
        className="relative w-3/4 max-w-xl h-6 bg-gradient-to-r from-gray-800/95 to-gray-900/95 rounded-full overflow-hidden shadow-lg flex items-center"
      >
        <motion.div
          ref={carRef}
          className="absolute top-[37%] transform -translate-y-1/2 flex items-center ml-3 z-10"
          animate={{
            left: `${(currentSection / (totalSections - 1)) * 90}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 15,
            duration: 0.8,
          }}
        >
          <img
            src="/s2ky.png"
            alt="Progress Car"
            className="h-5 w-auto transform scale-150"
          />
        </motion.div>
      </div>

      <FaFlagCheckered className="text-white text-sm ml-1" />
    </div>
  );
};

export default ProgressBar;
