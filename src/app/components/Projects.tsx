import { motion } from 'framer-motion';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { SiGooglecalendar, SiGithub, SiUnrealengine, SiMongodb, SiFastapi, SiNextdotjs, SiSqlite, SiChartdotjs, SiTypescript, SiTailwindcss, SiPython, SiCplusplus, SiFlutter, SiDart, SiFirebase, SiFlask, SiPlotly } from 'react-icons/si';
import { primaryFont } from '../utils/fonts';

const projects = [
  {
    id: 1,
    image: '/mavgrades.jpeg',
    title: 'MavGrades',
    techstack: ['Next.js', 'SQLite', 'Chart.js', 'Typescript', 'Tailwind CSS'],
    repo: 'https://github.com/acmuta/mavgrades',
    link: 'https://www.mavgrades.com/',
    description: 'Project director and lead developer: A platform for UTA students to view and compare course/professor grade distributions. Trusted by over 5,000 students.',
  },
  {
    id: 2,
    image: '/mlnd2.jpeg',
    title: 'Multi-layered Network (MLN) Dashboard',
    techstack: ['Flask', 'Python', 'C++', 'SQLite', 'Plotly', 'Bokeh', 'NetworkX', 'Pyviz'],
    link: 'https://itlab.uta.edu/mlndash-live/',
    description: 'Lead developer: A platform for the analysis and visualization of large datasets using Multi-Layered Networks.',
  },
  {
    id: 3,
    image: '/clusterphoto.png',
    title: 'Cluster',
    techstack: ['Flutter', 'Dart', 'Firebase', 'FireAuth', 'SendGrid'],
    repo: 'https://github.com/KevinRouz/Cluster',
    description: 'A user-friendly mobile app to facilitate group communication among high school and university students.',
  },
  {
    id: 4,
    image: '/acmuta.png',
    title: 'ACM UTA Site',
    techstack: ['Next.js', 'Typescript', 'Tailwind CSS', 'GitHub API', 'Google API'],
    repo: 'https://github.com/acmuta/acmuta-site/',
    link: 'https://www.acmuta.com/',
    description: 'The official site for the ACM Chapter at UT Arlington.',
  },
  // {
  //   id: 5,
  //   image: '/knownonsense.png',
  //   title: 'KnowNonsense',
  //   techstack: ['Unreal Engine', 'C++', 'Next.js', 'MongoDB', 'FastAPI', 'Typescript'],
  //   repo: '',
  //   description: 'A real-time VR application for truth validation and fact-checking for debate points, with transcripts and feedback available on the web.',
  // }
];

export default function Projects() {
  return (
    <section className="py-20 px-4 md:px-8">
      <h2 className={`text-3xl md:text-4xl font-bold mb-12 text-center ${primaryFont}`}>Projects</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
    image,
    title,
    techstack,
    description,
    repo,
    link,
  }: {
    image: string;
    title: string;
    techstack: string[];
    description: string;
    repo?: string;
    link?: string;
  }) {
    const [ref, inView] = useInView({
      triggerOnce: false,
      threshold: 0.1,
    });
  
    const techIcons: { [key: string]: JSX.Element } = {
      "Next.js": <SiNextdotjs />,
      SQLite: <SiSqlite />,
      "Chart.js": <SiChartdotjs />,
      Typescript: <SiTypescript />,
      "Tailwind CSS": <SiTailwindcss />,
      Flask: <SiFlask />,
      Python: <SiPython />,
      "C++": <SiCplusplus />,
      Flutter: <SiFlutter />,
      Dart: <SiDart />,
      Firebase: <SiFirebase />,
      FireAuth: <SiFirebase />,
      Plotly: <SiPlotly />,
      FastAPI: <SiFastapi />,
      MongoDB: <SiMongodb />,
      "Unreal Engine": <SiUnrealengine />,
      "GitHub API": <SiGithub />,
      "Google API": <SiGooglecalendar />,
    };
  
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        className={`bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-300 ease-out ${primaryFont}`}
        whileHover={{
          scale: 1.05,
          y: -10,
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#4A5568",
        }}
      >
        <div className="relative w-full aspect-w-16 aspect-h-9 mb-4">
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
        {techstack.map((tech) => (
          <span
            key={tech}
            className="bg-gray-700 text-white text-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-2"
          >
            <span className="text-blue-400">{techIcons[tech] || null}</span>
            {tech}
          </span>
        ))}
        </div>
        <p className="text-gray-300 mb-4">{description}</p>
        <div className="flex gap-4">
          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md text-sm font-medium flex-1 text-center"
            >
              Repository
            </a>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-700 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md text-sm font-medium flex-1 text-center"
            >
              Live
            </a>
          )}
        </div>
      </motion.div>
    );
  }
  