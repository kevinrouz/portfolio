import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import BouncingChevron from './BouncingChevron';
import { primaryFont } from '../utils/fonts';
import Image from 'next/image';

const experiences = [
  {
    id: 1,
    company: 'Skyryse',
    logo: '/skyryse.jpg',
    role: 'AI Software Engineer Intern',
    location: 'El Segundo, CA',
    timeFrame: 'June 2025 - Present',
    description: [
      'Building Skylar™, the Universal AI Flight Assistant focused on Aviation Safety and Efficiency',
      'Press Release: https://www.skyryse.com/resources/skyryse-unveils-skylar-tm-a-universal-ai-flight-assistant-focused-on-aviation-safety-and-efficiency',
    ],
  },
  {
    id: 2,
    company: 'ACM @ UT Arlington',
    logo: '/acm.png',
    role: 'Vice President',
    location: 'Arlington, TX',
    timeFrame: 'Aug 2025 - Present',
    description: [
      'Oversee initiatives within the largest computer science student organization at UTA',
      'Coordinate with industry partners to provide students with networking and career development opportunities',
    ],
  },
  {
    id: 3,
    company: 'Arlington Computational Linguistics Laboratory @ UTA',
    logo: '/acl4.png',
    role: 'Undergraduate Research Assistant',
    location: 'Arlington, TX',
    timeFrame: 'Feb 2025 - May 2025',
    description: [
      'Conducted NLP research analyzing Parus Minor vocalizations to investigate underlying linguistic patterns',
    ],
  },
  {
    id: 4,
    company: 'Information Technology Laboratory @ UTA',
    logo: '/itlab.jpg',
    role: 'Undergraduate Research Assistant',
    location: 'Arlington, TX',
    timeFrame: 'Aug 2023 - May 2025',
    description: [
      'Led the Multi-Layered Networks Team developing the MLN Dashboard',
      'Published in: BDA 2024, VLDB 2025',
    ],
  },
  {
    id: 5,
    company: 'ACM @ UT Arlington',
    logo: '/acm.png',
    role: 'Director, ACM Create',
    location: 'Arlington, TX',
    timeFrame: 'Aug 2024 - Aug 2025',
    description: [
      'Led the largest team at UTA building software projects by students, for students',
      'Collectively, ACM Create\'s applications have been used by over 40% of the student population',
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
  logo,
  location,
  timeFrame,
  description,
}: {
  role: string;
  company: string;
  logo: string;
  location: string;
  timeFrame: string;
  description: string[];
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl transform transition-all duration-300 ease-out min-w-[100%] max-w-screen-md mx-auto border border-gray-700 ${primaryFont}`}
      whileHover={{
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        borderColor: '#60A5FA',
      }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden bg-transparent p-2 shadow-md">
          <Image
            src={logo}
            alt={`${company} logo`}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-grow">
          <h3 className={`text-2xl md:text-3xl font-bold mb-1 text-white`}>{role}</h3>
          <p className="text-blue-400 font-semibold text-lg">{company}</p>
        </div>
      </div>

      <div className={`flex justify-between items-center mb-4 text-sm`}>
        <p className="text-gray-400">{location}</p>
        <p className="text-gray-400">{timeFrame}</p>
      </div>

      <ul className="space-y-3 text-gray-300">
        {description.map((item, index) => {
          const urlMatch = item.match(/^(.*?):\s*(https?:\/\/.+)$/);
          
          if (urlMatch) {
            const [, , url] = urlMatch;
            return (
              <li key={index} className="flex items-start">
                <span className="text-blue-400 mr-2">▸</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400 underline transition-colors duration-200"
                >
                  See The Press Release
                </a>
              </li>
            );
          }
          
          return (
            <li key={index} className="flex items-start">
              <span className="text-blue-400 mr-2">▸</span>
              <span>{item}</span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
