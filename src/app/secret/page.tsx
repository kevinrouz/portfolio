"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Page: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      if (stage === 6) {
        audio.play().catch((e) => console.error("Audio play failed:", e));
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }, [stage]);

  // End sequence timer
  useEffect(() => {
    if (stage === 4) {
      const timer = setTimeout(() => setStage(5), 2000);
      return () => clearTimeout(timer);
    }
    if (stage === 5) {
      const timer = setTimeout(() => setStage(6), 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const setRandomPosition = () => {
    const newX = Math.random() * 80 + 10;
    const newY = Math.random() * 80 + 10;
    setMousePosition({ x: newX, y: newY });
  };

  const handleButtonClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setStage(1);
      setRandomPosition();
    }, 25);
  };

  const handleStage1Click = () => {
    setStage(2);
    setRandomPosition();
  };

  const handleStage2Click = () => {
    setStage(3);
    setRandomPosition();
  };

  const handleStage3Click = () => {
    setStage(4);
  };

  const getButtonStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${mousePosition.x}%`,
      top: `${mousePosition.y}%`,
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.1s ease-out',
    };

    if (stage === 1) {
      return baseStyle;
    }
    if (stage === 2) {
      return {
        ...baseStyle,
        transition: 'all 0.05s ease-out',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
      };
    }
    if (stage === 3) {
      return {
        ...baseStyle,
        transition: 'none',
      };
    }
    return {};
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (stage === 1 || stage === 2) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const buttonX = mousePosition.x;
      const buttonY = mousePosition.y;
      
      const distance = Math.sqrt(Math.pow(x - buttonX, 2) + Math.pow(y - buttonY, 2));
      
      // Stage 1: Standard evasion
      // Stage 2: More sensitive, moves further
      const threshold = stage === 1 ? 20 : 25;
      const moveAmount = stage === 1 ? 25 : 40;

      if (distance < threshold) {
        const angle = Math.atan2(buttonY - y, buttonX - x);
        
        // Add some randomness to the angle to make it less predictable
        const randomAngleOffset = (Math.random() - 0.5) * 0.5; 
        const finalAngle = angle + randomAngleOffset;

        const newX = Math.max(10, Math.min(90, buttonX + Math.cos(finalAngle) * moveAmount));
        const newY = Math.max(10, Math.min(90, buttonY + Math.sin(finalAngle) * moveAmount));
        setMousePosition({ x: newX, y: newY });
      }
    }
  };

  const handleButtonHover = () => {
    if (stage === 3) {
      // Clear existing timer
      if (timerRef.current) clearTimeout(timerRef.current);

      // Teleport to a random position with a slight delay
      timerRef.current = setTimeout(() => {
        const newX = Math.random() * 80 + 10; // Keep within 10-90%
        const newY = Math.random() * 80 + 10;
        setMousePosition({ x: newX, y: newY });
      }, 15);
    }
  };

  const handleButtonMouseDown = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const getBackgroundColor = () => {
    switch (stage) {
      case 0: return 'bg-blue-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-purple-600';
      case 3: return 'bg-gray-900';
      case 4: return 'bg-black';
      case 5: return 'bg-black';
      case 6: return 'bg-blue-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div 
      className={`relative flex justify-center items-center h-screen overflow-hidden transition-colors duration-500 ${getBackgroundColor()}`}
      onMouseMove={handleMouseMove}
    >
      {stage === 0 && !isClicked && (
        <button
          onClick={handleButtonClick}
          className="px-8 py-4 bg-green-600 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-green-700 transition-colors select-none"
        >
          Do NOT click me either
        </button>
      )}

      {stage === 1 && (
        <button
          onClick={handleStage1Click}
          style={getButtonStyle()}
          className="px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-red-700 z-50 select-none"
        >
          I said do NOT click me!
        </button>
      )}

      {stage === 2 && (
        <button
          onClick={handleStage2Click}
          style={getButtonStyle()}
          className="bg-yellow-500 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-600 z-50 whitespace-nowrap select-none"
        >
          Just give up already.
        </button>
      )}

      {stage === 3 && (
        <button
          onClick={handleStage3Click}
          onMouseEnter={handleButtonHover}
          onMouseDown={handleButtonMouseDown}
          style={getButtonStyle()}
          className="px-8 py-4 bg-red-800 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-red-900 z-50 border-4 border-red-500 animate-pulse select-none"
        >
          LAST WARNING!
        </button>
      )}

      <audio ref={audioRef} src="/gangnam.mp3" />

      {stage === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="text-white text-6xl font-bold z-50"
        >
          Fine...
        </motion.div>
      )}

      {stage === 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="text-white text-6xl font-bold z-50 text-center"
        >
          You asked for it...
        </motion.div>
      )}

      {isClicked && stage === 6 && (
        <>
          <motion.div
            initial={{ y: '-100vh' }}
            animate={{ y: -30 }}
            transition={{ type: 'spring', stiffness: 70, damping: 20 }}
            className="absolute top-0 transform -translate-x-1/2 z-40"
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
            className="z-10 flex flex-col items-center gap-8"
          >
            <img src="/catgroove.gif" alt="Groove Cat" className="w-56" />
            
            <Link 
              href="/"
              className="px-8 py-3 bg-gray-200 bg-opacity-80 text-blue-600 font-bold text-xl rounded-full shadow-xl hover:scale-105 transition-transform z-50"
            >
              Back to Home
            </Link>
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
