'use client';

import { motion } from 'framer-motion';
import { primaryFont } from '../utils/fonts';
import BouncingChevron from './BouncingChevron';

export default function About() {

  return (
    <section
      id="about"
      className={`${primaryFont} min-h-screen flex flex-col justify-center items-center text-center px-4`}
    >
      <motion.h2
        className="text-4xl md:text-5xl font-bold mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        About Me
      </motion.h2>
      <motion.p
        className="text-lg md:text-xl text-gray-200 max-w-3xl mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      >
        Hey, I&apos;m Kevin! I&apos;m a third-year Computer Science student passionate about software engineering,
        AI, and creating meaningful digital experiences. With a focus on full-stack development and leading teams,
        my goal is to build innovative solutions that have a real impact. In my free time,
        I enjoy exploring web development, diving into machine learning, and picking up knowledge
        on just about anything that sparks my curiosity.
      </motion.p>
      <BouncingChevron mt="mt-6"/>
    </section>
  );
}
