import { motion } from 'framer-motion';
import Image from "next/legacy/image";
import { useInView } from 'react-intersection-observer';
import { SiGooglecalendar, SiDiscord, SiGithub, SiUnrealengine, SiMongodb, SiFastapi, SiNextdotjs, SiSqlite, SiChartdotjs, SiTypescript, SiTailwindcss, SiPython, SiCplusplus, SiFlutter, SiDart, SiFirebase, SiFlask, SiPlotly, SiTensorflow, SiNumpy, SiPandas, SiGooglemaps, SiScikitlearn } from 'react-icons/si';
import { primaryFont } from '../utils/fonts';
import { IoMail, IoAnalytics, IoApertureSharp, IoBarChart, IoStatsChart } from 'react-icons/io5';
const projects = [
  {
    id: 1,
    image: '/mavgrades.jpeg',
    title: 'MavGrades',
    techstack: ['Next.js', 'SQLite', 'Chart.js', 'Typescript', 'Tailwind CSS'],
    repo: 'https://github.com/acmuta/mavgrades',
    link: 'https://www.mavgrades.com/',
    description: 'Project director and lead developer: A platform for UTA students to view and compare course/professor grade distributions. Trusted by over 20,000 students.',
  },
  {
    id: 2,
    image: '/mlnd2.jpeg',
    title: 'Multi-layered Network (MLN) Dashboard',
    techstack: ['Flask', 'Python', 'C++', 'SQLite', 'Plotly', 'Bokeh', 'NetworkX', 'Pyviz'],
    link: 'https://itlab.uta.edu/mlndash-live/',
    description: 'Lead developer: A platform for the analysis and visualization of large datasets using Multi-Layered Networks. Backed by published research.',
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
    image: '/sisyphus.png',
    title: 'Sisyphus Counter',
    techstack: ['Python', 'MongoDB', 'Discord.py'],
    repo: 'https://github.com/KevinRouz/SisyphusCounter',
    description: 'A popular Discord bot hosting a collaborative counting game, engaging hundreds of daily users across multiple servers with leaderboards and high score tracking.'
  },
  {
    id: 5,
    image: '/acmuta.png',
    title: 'ACM UTA Site',
    techstack: ['Next.js', 'Typescript', 'Tailwind CSS', 'GitHub API', 'Google API'],
    repo: 'https://github.com/acmuta/acmuta-site/',
    link: 'https://www.acmuta.com/',
    description: 'The official site for the ACM Chapter at UT Arlington.',
  },
  {
    id: 6,
    image: '/knownonsense.png',
    title: 'KnowNonsense',
    techstack: ['Unreal Engine', 'C++', 'Next.js', 'MongoDB', 'FastAPI', 'Typescript'],
    repo: 'https://github.com/KevinRouz/KnowNonsenseVR',
    description: 'A real-time VR application for truth validation and fact-checking for debate points, with transcripts and feedback available on the web.',
  },
  {
    id: 7,
    image: '/geoWizard.png',
    title: 'GeoWizard',
    techstack: ['TensorFlow', 'Python', 'NumPy', 'Pandas', 'Matplotlib', 'Scikitlearn', 'Google Maps API'],
    repo: 'https://github.com/KevinRouz/geoguessr',
    description: 'A machine learning model trained on Google Maps Street View images to predict the location of a given image.',
  },
  

];

export default function Projects() {
  return (
    <section className="py-20 px-4 md:px-8">
      <h2 className={`text-3xl md:text-4xl font-bold mb-12 text-center ${primaryFont}`}>Projects</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
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
      triggerOnce: true,
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
      TensorFlow: <SiTensorflow />,
      NumPy: <SiNumpy />,
      Pandas: <SiPandas />,
      Matplotlib: <IoStatsChart />,
      "Google Maps API": <SiGooglemaps />,
      Scikitlearn: <SiScikitlearn />,
      Bokeh: <IoApertureSharp />,
      NetworkX: <IoAnalytics /> ,
      Pyviz: <IoBarChart />,
      SendGrid: <IoMail />,
      "Discord.py": <SiDiscord />,
    };
  
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        className={`bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl transform transition-all duration-300 ease-out border border-gray-700 flex flex-col ${primaryFont}`}
        whileHover={{
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          borderColor: "#60A5FA",
        }}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="relative w-full aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
        {techstack.map((tech) => (
          <span
            key={tech}
            className="bg-gray-700/50 text-gray-200 text-xs px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5 border border-gray-600 hover:border-blue-400 transition-colors duration-200"
          >
            <span className="text-blue-400 text-sm">{techIcons[tech] || null}</span>
            <span className="font-medium">{tech}</span>
          </span>
        ))}
        </div>
        <p className="text-gray-300 mb-6 flex-grow leading-relaxed">{description}</p>
        <div className="flex gap-3 mt-auto">
          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 rounded-lg shadow-md text-sm font-semibold flex-1 text-center transition-all duration-200 hover:shadow-lg"
            >
              Repository
            </a>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-500 text-white py-2.5 px-4 rounded-lg shadow-md text-sm font-semibold flex-1 text-center transition-all duration-200 hover:shadow-lg"
            >
              Live Demo
            </a>
          )}
        </div>
      </motion.div>
    );
  }
  