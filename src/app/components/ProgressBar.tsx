"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GiFlyingFlag } from "react-icons/gi";
import { FaFlagCheckered } from "react-icons/fa";
import confetti from "canvas-confetti";

type ProgressBarProps = {
  activeSection: number;
};

const ProgressBar: React.FC<ProgressBarProps> = React.memo(({ activeSection }) => {
  const [totalSections, setTotalSections] = useState(0);
  const [labels, setLabels] = useState<string[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const [maxLeft, setMaxLeft] = useState(90);
  const lastConfettiSectionRef = useRef<number | null>(null);

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

    return () => {
    };
  }, [totalSections]);

  useEffect(() => {
    if (totalSections <= 0) return;

    // Confetti only once per arrival at the last section.
    const isLast = activeSection === totalSections - 1;
    
    // Reset the ref when not on last section
    if (!isLast) {
      lastConfettiSectionRef.current = null;
      return;
    }

    if (lastConfettiSectionRef.current === activeSection) return;
    lastConfettiSectionRef.current = activeSection;

    if (!carRef.current) return;
    
    // Use RAF for better timing
    requestAnimationFrame(() => {
      if (!carRef.current) return;
      const carPosition = carRef.current.getBoundingClientRect();
      confetti({
        particleCount: 35,
        spread: 160,
        origin: {
          x: (carPosition.left + carPosition.right) / 2 / window.innerWidth,
          y: (carPosition.top + carPosition.bottom) / 2 / window.innerHeight,
        },
        colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"],
        disableForReducedMotion: true,
      });
    });
  }, [activeSection, totalSections]);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center" style={{ willChange: 'transform' }}>
      <div className="relative w-3/4 max-w-xl">
        <div className="flex items-center">
          <GiFlyingFlag className="text-white text-sm mr-1" />
          <div
            ref={progressBarRef}
            className="relative w-full h-6 bg-gradient-to-r from-gray-800/95 to-gray-900/95 rounded-full overflow-hidden shadow-lg"
            style={{ willChange: 'transform' }}
          >
            <motion.div
              ref={carRef}
              className="absolute top-[37%] transform -translate-y-1/2 flex items-center ml-3 z-10"
              style={{ willChange: 'transform' }}
              animate={{
                left: `${Math.min(
                  (activeSection / Math.max(1, totalSections - 1)) * maxLeft,
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
                left: `${
                  index === 0
                  ? 8
                  : index === 1
                  ? (index / (totalSections - 1)) * 109
                  : index === 2
                  ? (index / (totalSections - 1)) * 97
                  : index === 3
                  ? (index / (totalSections - 1)) * 93 
                  : (index / (totalSections - 1)) * 100
                }%`,
                transform: "translateX(-50%)",
              }}
              
              className={`absolute cursor-pointer text-xs text-gray-300 select-none ${
                index === activeSection ? "font-bold text-white" : ""
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
