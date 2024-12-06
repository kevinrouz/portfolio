"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GiFlyingFlag } from "react-icons/gi";
import { FaFlagCheckered } from "react-icons/fa";
import confetti from "canvas-confetti";

const ProgressBar: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const [labels, setLabels] = useState<string[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const [maxLeft, setMaxLeft] = useState(90);

  useEffect(() => {
    const updateMaxLeft = () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      setMaxLeft(isMobile ? 80 : 90);
    };

    updateMaxLeft();

    window.addEventListener("resize", updateMaxLeft);

    return () => {
      window.removeEventListener("resize", updateMaxLeft);
    };
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll(".section"));
    setTotalSections(sections.length);

    const extractedLabels = sections.map((section) => {
      const className = section.className;
      const label = className.split(" ").find((cls) => cls !== "section");
      return label || "Unknown";
    });
    setLabels(extractedLabels);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = sections.indexOf(entry.target as Element);
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
        threshold: 0.10,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [totalSections]);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center">
      <div className="relative w-3/4 max-w-xl">
        <div className="flex items-center">
          <GiFlyingFlag className="text-white text-sm mr-1" />
          <div
            ref={progressBarRef}
            className="relative w-full h-6 bg-gradient-to-r from-gray-800/95 to-gray-900/95 rounded-full overflow-hidden shadow-lg"
          >
            <motion.div
              ref={carRef}
              className="absolute top-[37%] transform -translate-y-1/2 flex items-center ml-3 z-10"
              animate={{
                left: `${Math.min(
                  (currentSection / (totalSections - 1)) * maxLeft,
                  maxLeft
                )}%`,
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

        <div className="absolute top-8 w-full">
          {labels.map((label, index) => (
            <span
              key={index}
              onClick={() => {
                const sections = document.querySelectorAll(".section");
                sections[index]?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              style={{
                left: `${(index / (totalSections - 1)) * 100}%`,
                transform: "translateX(-50%)",
              }}
              className={`absolute cursor-pointer text-xs text-gray-300 select-none ${
                index === currentSection ? "font-bold text-white" : ""
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
