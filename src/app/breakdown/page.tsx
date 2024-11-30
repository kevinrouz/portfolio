"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const Page: React.FC = () => {
  const [isClicked, setIsClicked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
    }
  }, []);

  const handleButtonClick = () => {
    setIsClicked(true);
    const audio = audioRef.current;
    if (audio) {
      audio.play();
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden bg-blue-500">
      {!isClicked && (
        <button
          onClick={handleButtonClick}
          className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700"
        >
          Do NOT click me either
        </button>
      )}

      <audio ref={audioRef} src="/gangnam.mp3" />

      {isClicked && (
        <>
          <motion.div
            initial={{ y: '-100vh' }}
            animate={{ y: -30 }}
            transition={{ type: 'spring', stiffness: 70, damping: 20 }}
            className="absolute top-0 transform -translate-x-1/2 z-50"
          >
            <img src="/disco.gif" alt="Disco" className="w-36" />
          </motion.div>

          <motion.div
            initial={{ x: '100vw', rotate: 360, scale: 0.5 }}
            animate={{ x: 0, rotate: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 50,
              damping: 15,
              delay: 0.25,
            }}
            className="z-10"
          >
            <img src="/catgroove.gif" alt="Groove Cat" className="w-56" />
          </motion.div>

          <div className="absolute inset-0 bg-blue-500 animate-backgroundShift"></div>
        </>
      )}

      <style jsx>{`
        @keyframes backgroundShift {
          0% {
            background-color: #8b5cf6; /* Purple */
          }
          25% {
            background-color: #facc15; /* Yellow */
          }
          50% {
            background-color: #34d399; /* Green */
          }
          75% {
            background-color: #ef4444; /* Red */
          }
          100% {
            background-color: #3b82f6; /* Blue */
          }
        }
        .animate-backgroundShift {
          animation: backgroundShift 6s infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default Page;
