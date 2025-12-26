'use client';

import { motion } from 'framer-motion';
import { primaryFont } from '../utils/fonts';
import BouncingChevron from './BouncingChevron';
import { FaJava, FaPython, FaReact, FaGithub, FaNodeJs, FaGitAlt } from 'react-icons/fa';
import { SiFlask, SiTypescript, SiJavascript, SiTailwindcss, SiKubernetes, SiMongodb, SiPostgresql, SiMysql, SiCplusplus, SiFastapi, SiLangchain, SiDeepgram} from 'react-icons/si';
import { TbBrandNextjs } from 'react-icons/tb';
import { FaGripLinesVertical } from "react-icons/fa";
import { SiCursor, SiCerebras, SiGroq } from './icons/CustomIcons';
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
      { name: 'PostgreSQL', icon: <SiPostgresql /> },
      { name: 'MongoDB', icon: <SiMongodb /> },
      { name: 'MySQL', icon: <SiMysql /> },
    ],
  },
  {
    title: 'AI Tools',
    items: [
      { name: 'LangChain', icon: <SiLangchain /> },
      { name: 'ElevenLabs', icon: <FaGripLinesVertical /> },
      { name: 'Deepgram', icon: <SiDeepgram /> },
      { name: 'Cerebras', icon: <SiCerebras size={24}/> },
      { name: 'Groq', icon: <SiGroq size={28}/> },
      { name: 'Cursor', icon: <SiCursor size={28}/> },
    ],
  }
];



export default function About() {
  return (
    <section
      id="about"
      className={`${primaryFont} min-h-screen flex flex-col justify-center items-center text-center px-4 mt-20`}
    >
      <motion.h2
        className="text-4xl md:text-5xl font-bold mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ willChange: 'transform, opacity' }}
      >
        About Me
      </motion.h2>
      <motion.p
        className="text-lg md:text-xl text-gray-200 max-w-3xl mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        style={{ willChange: 'transform, opacity' }}
      >
        Hey, I&apos;m Kevin! I&apos;m a fourth-year Computer Science student at UTA.
        I love building new things, reading the latest research in Machine Learning and AI, 
        and leading teams to success. In my free time, I enjoy philosophy, photography, and collecting hot wheels.
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-5xl mb-8">
        {categories.map((category, idx) => (
          <motion.div
            key={idx}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 text-left border border-gray-700 shadow-xl hover:border-blue-400 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
            style={{ willChange: 'transform, opacity' }}
          >
            <h3
              className="text-2xl text-center font-bold text-white mb-8 pb-3 border-b-2 border-blue-400"
            >
              {category.title}
            </h3>
            <ul className="grid grid-cols-2 gap-6">
              {category.items.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col items-center text-gray-200 space-y-2 hover:text-blue-400 transition-colors duration-200 cursor-default"
                >
                  <span className="text-3xl text-blue-400 hover:scale-110 transition-transform duration-200">{item.icon}</span>
                  <span className="text-center text-sm font-medium">{item.name}</span>
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
