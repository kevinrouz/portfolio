'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import ProgressBar from './components/ProgressBar';
import Experience from './components/Experience';

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <main ref={ref} className="min-h-screen flex flex-col justify-between">
      <ProgressBar />
      <motion.div className="section Me" style={{ opacity, scale }}>
        <Hero />
      </motion.div>
      <div className="section About mt-10">
        <About />
      </div>
      <div className="section Experience mt-10">
        <Experience />
      </div>
      <div className="section Projects mt-10">
        <Projects />
      </div>
      <p className="text-center py-2 mt-4 mb-2">
        &copy; {new Date().getFullYear()} Kevin Farokhrouz. All Rights Reserved. 
        <a href="/secret" className="ml-2 hover:underline font-bold text-red-400">
          Do NOT click me.
        </a>
      </p>
    </main>
  );
}
