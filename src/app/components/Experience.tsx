import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import BouncingChevron from './BouncingChevron';
import { primaryFont } from '../utils/fonts';

const experiences = [
  {
    id: 1,
    company: 'ITLab @ UTA',
    role: 'Research Assistant',
    location: 'Arlington, TX',
    timeFrame: 'Aug 2023 - Present',
    description: [
      'Leading the development of a dashboard for the analysis and visualization of large data sets utilizing Multi-Layer Networks (MLN), backed by IEEE-published research.',
      'Engineered a robust backend analysis pipeline that leverages community detection algorithms and a custom expression evaluator to efficiently process and interpret MLN layers for actionable insights.',
      'Utilized Flask and Python for API development and React.js for an intuitive user interface.',
    ],
  },
  {
    id: 2,
    company: 'ACM @ UT Arlington',
    role: 'Director - ACM Create',
    location: 'Arlington, TX',
    timeFrame: 'Aug 2024 - Present',
    description: [
      'Lead and oversee the development of software projects serving the UTA student community.',
      'Directly manage a team of developers through the planning of projects, team collaboration, and ensuring timely delivery of quality applications.',
      'Drive technical innovation and student engagement by creating opportunities for members to contribute and enhance their skills in real-world software development projects.',
    ],
  },
];

export default function Experiences() {
  return (
    <section className="py-20 px-4 md:px-8">
      <h2 className={`${primaryFont} text-3xl md:text-4xl font-bold mb-12 text-center`}>Experience</h2>
      <div className="grid gap-8 justify-center">
        {experiences.map((experience) => (
          <div key={experience.id} className="flex justify-center">
            <ExperienceCard {...experience} />
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <BouncingChevron mt="mt-8" />
      </div>
    </section>
  );
}

function ExperienceCard({
  role,
  company,
  location,
  timeFrame,
  description,
}: {
  role: string;
  company: string;
  location: string;
  timeFrame: string;
  description: string[];
}) {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className={`bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-300 ease-out max-w-screen-md mx-auto ${primaryFont}`}
      whileHover={{
        scale: 1.05,
        y: -10,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#4A5568',
      }}
    >
      <h3 className={`text-2xl md:text-3xl font-bold mb-2`}>{role}</h3>

      <div className={`flex justify-between items-center mb-4`}>
        <p className="italic">{company} — {location}</p>
        <p className="text-sm text-gray-400">{timeFrame}</p>
      </div>

      <ul className="list-disc pl-5 text-gray-300">
        {description.map((item, index) => (
          <li key={index} className={`mb-2`}>
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
