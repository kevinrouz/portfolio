'use client';

import { motion } from 'framer-motion';
import { primaryFont } from '../utils/fonts';
import BouncingChevron from './BouncingChevron';
import { FaJava, FaPython, FaReact, FaGithub, FaNodeJs, FaGitAlt } from 'react-icons/fa';
import { SiFlask, SiTypescript, SiJavascript, SiTailwindcss, SiKubernetes, SiMongodb, SiFirebase, SiPostgresql, SiMysql, SiCplusplus, SiUnrealengine, SiUnity, SiKotlin, SiDart, SiFastapi } from 'react-icons/si';
import { TbBrandNextjs } from 'react-icons/tb';
import { CiDatabase } from "react-icons/ci";

const categories = [
  {
    title: 'Languages',
    items: [
      { name: 'Python', icon: <FaPython /> },
      { name: 'Java', icon: <FaJava /> },
      { name: 'JavaScript', icon: <SiJavascript /> },
      { name: 'TypeScript', icon: <SiTypescript /> },
      { name: 'SQL', icon: <CiDatabase /> },
      { name: 'C/C++', icon: <SiCplusplus /> },
      { name: 'Kotlin', icon: <SiKotlin /> },
      { name: 'Dart', icon: <SiDart /> },

    ],
  },
  {
    title: 'Frameworks',
    items: [
      { name: 'React', icon: <FaReact /> },
      { name: 'Next.js', icon: <TbBrandNextjs /> },
      { name: 'Tailwind CSS', icon: <SiTailwindcss /> },
      { name: 'Node.js', icon: <FaNodeJs /> },
      { name: 'Flask', icon: <SiFlask /> },
      { name: 'FastAPI', icon: <SiFastapi/> },

    ],
  },
  {
    title: 'Dev Tools',
    items: [
      { name: 'Git', icon: <FaGitAlt /> },
      { name: 'GitHub', icon: <FaGithub /> },
      { name: 'Kubernetes', icon: <SiKubernetes /> },
      { name: 'Firebase', icon: <SiFirebase /> },
      { name: 'PostgreSQL', icon: <SiPostgresql /> },
      { name: 'MongoDB', icon: <SiMongodb /> },
      { name: 'MySQL', icon: <SiMysql /> },
      { name: 'Unreal Engine', icon: <SiUnrealengine /> }, 
      { name: 'Unity', icon: <SiUnity /> },
    ],
  },
];



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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full max-w-6xl mb-8">
        {categories.map((category, idx) => (
          <motion.div
            key={idx}
            className="bg-gray-800 rounded-lg p-6 text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
          >
            <h3
              className="text-xl text-center font-bold text-blue-400 mb-12 transition-colors duration-300 hover:text-blue-500"
            >
              {category.title}
            </h3>
            <ul className="grid grid-cols-2 gap-6">
              {category.items.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col items-center text-gray-200 space-y-2"
                >
                  <span className="text-2xl text-blue-400">{item.icon}</span>
                  <span className="text-center">{item.name}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <BouncingChevron mt="mt-6" />
      <div className="mt-20 mb-20"></div>
    </section>
  );
}
