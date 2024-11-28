'use client'

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { Typed } from 'react-typed';
import Image from 'next/image';

import { primaryFont } from '../utils/fonts';
import BouncingChevron from './BouncingChevron';

const roles = [
  'Computer Science Student',
  'SWE Research Assistant',
  'Director @ ACM Create',
  'Full-Stack Developer',
  'AI Enthusiast',
  'Perpetual Learner',
];

export default function Hero() {
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typedRef.current) {
      const typed = new Typed(typedRef.current, {
        strings: roles,
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        showCursor: true,
        cursorChar: '|',
      });

      return () => {
        typed.destroy();
      };
    }
  }, []);

  return (
    <section className={`${primaryFont} h-screen flex flex-col justify-center items-center text-center px-4`}>
      <motion.div
        className="w-56 h-56 rounded-full overflow-hidden mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/kevinphoto1.jpg"
          alt="Kevin Farokhrouz - Photo"
          width={256}
          height={256}
          className="object-cover"
          priority
        />
      </motion.div>

      <motion.h1
        className={`${primaryFont} text-5xl md:text-7xl font-bold mb-2`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Kevin Farokhrouz
      </motion.h1>

      <motion.div
        className="flex gap-4 justify-center text-xl md:text-2xl mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <a
          href="https://github.com/kevinrouz"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-500 transition-colors"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://linkedin.com/in/kevinrouz"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-500 transition-colors"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>
        <a
          href="mailto:kevinafarokhrouz@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-500 transition-colors"
          aria-label="Email"
        >
          <FaEnvelope />
        </a>
      </motion.div>

      <motion.div
        className={`${primaryFont} text-xl md:text-2xl mb-12 h-8`}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span ref={typedRef}></span>
      </motion.div>

      <BouncingChevron />
    </section>
  );
}
