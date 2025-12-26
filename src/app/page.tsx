'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import ProgressBar from './components/ProgressBar';
import Experience from './components/Experience';
import CarOverlay from './components/CarOverlay';

export default function Home() {
  const ref = useRef(null);
  const [activeSection, setActiveSection] = useState(0);

  const { ref: heroRef } = useInView({
    threshold: 0.5,
    onChange: (inView) => {
      if (inView) setActiveSection(0);
    },
  });

  const { ref: aboutRef } = useInView({
    threshold: 0.35,
    onChange: (inView) => {
      if (inView) setActiveSection(1);
    },
  });

  const { ref: experienceRef } = useInView({
    threshold: 0.35,
    onChange: (inView) => {
      if (inView) setActiveSection(2);
    },
  });

  const { ref: projectsRef } = useInView({
    threshold: 0.35,
    onChange: (inView) => {
      if (inView) setActiveSection(3);
    },
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <main ref={ref} className="min-h-screen flex flex-col justify-between">
      <CarOverlay activeSection={activeSection} />
      <div className="relative z-10">
        <ProgressBar />
        <motion.div ref={heroRef} className="section Me" style={{ opacity, scale }}>
          <Hero />
        </motion.div>
        <div ref={aboutRef} className="section About mt-10">
          <About />
        </div>
        <div ref={experienceRef} className="section Experience mt-10">
          <Experience />
        </div>
        <div ref={projectsRef} className="section Projects mt-10">
          <Projects />
        </div>
        <p className="text-center py-2 mt-4 mb-2">
          &copy; {new Date().getFullYear()} Kevin Farokhrouz. All Rights Reserved.
          <a href="/secret" className="ml-2 hover:underline font-bold text-red-400">
            Do NOT click me.
          </a>
        </p>
      </div>
    </main>
  );
}
