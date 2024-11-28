'use client';

import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

interface BouncingChevronProps {
  mt?: string;
}

export default function BouncingChevron({ mt }: BouncingChevronProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={mt}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          y: {
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        <FaChevronDown size={24} />
      </motion.div>
    </motion.div>
  );
}
