'use client'

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { Typed } from 'react-typed';
import { Tomorrow } from 'next/font/google';
import { Anta } from 'next/font/google';
import { Saira } from 'next/font/google';
import Image from 'next/image';

const tomorrow = Tomorrow({ weight: '500', subsets: ['latin'] });
const anta = Anta({ weight: '400', subsets: ['latin'] });
const saira = Saira({ weight: '500', subsets: ['latin'] });

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
  const primaryFont = saira.className || tomorrow.className || anta.className;

  useEffect(() => {
    if (typedRef.current) {
      const typed = new Typed(typedRef.current, {
        strings: roles,
        typeSpeed: 40,
        backSpeed: 50,
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
            className="w-52 h-52 md:w-64 md:h-64 rounded-full overflow-hidden mb-6"
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
        className={`${primaryFont} text-5xl md:text-7xl font-bold mb-6`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Kevin Farokhrouz
      </motion.h1>
      <motion.div
        className={`${primaryFont}text-xl md:text-2xl mb-12 h-8`}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span ref={typedRef}></span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="animate-bounce"
      >
        <FaChevronDown size={24} />
      </motion.div>
    </section>
  );
}
