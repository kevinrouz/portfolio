'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import ProgressBar from './components/ProgressBar';

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <main ref={ref} className="min-h-screen">
      <ProgressBar />
      <motion.div className="section" style={{ opacity, scale }}>
        <Hero />
      </motion.div>
      <div className="section">
        <About />
      </div>
      <div className="section">
        <Projects />
      </div>
    </main>
  );
}
