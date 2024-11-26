'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Hero from './components/Hero'
import Projects from './components/Projects'

export default function Home() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <main ref={ref} className="min-h-screen">
      <motion.div style={{ opacity, scale }}>
        <Hero />
      </motion.div>
      <Projects />
    </main>
  )
}

