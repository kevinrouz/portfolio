'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ProgressBar from './components/ProgressBar';
import CarOverlay from './components/CarOverlay';

export default function Home() {
  const ref = useRef(null);
  const [activeSection, setActiveSection] = useState(0);
  const [sectionHeights, setSectionHeights] = useState<number[]>(() => {
    // Default each checkpoint to at least one viewport tall.
    // This will be refined by the board once content is measured.
    if (typeof window === 'undefined') return [0, 0, 0, 0];
    return [window.innerHeight, window.innerHeight, window.innerHeight, window.innerHeight];
  });

  const sectionCount = useMemo(() => 4, []);

  useEffect(() => {
    // Keep activeSection stable even as checkpoint heights change.
    let raf = 0;

    const computeActiveSection = () => {
      raf = 0;
      const sections = Array.from(document.querySelectorAll<HTMLElement>('.section'));
      if (sections.length === 0) return;

      const mid = window.innerHeight * 0.5;
      let found = 0;
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= mid && rect.bottom > mid) {
          found = i;
          break;
        }
        if (rect.top > mid) break;
        found = i;
      }

      setActiveSection((prev) => (prev === found ? prev : found));
    };

    const onScrollOrResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(computeActiveSection);
    };

    onScrollOrResize();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [sectionCount]);

  useEffect(() => {
    // Ensure we have a height entry per section.
    if (sectionHeights.length === sectionCount) return;
    setSectionHeights((prev) => {
      const next = prev.slice(0, sectionCount);
      while (next.length < sectionCount) next.push(typeof window === 'undefined' ? 0 : window.innerHeight);
      return next;
    });
  }, [sectionCount, sectionHeights.length]);

  const handleSectionHeight = (index: number, height: number) => {
    setSectionHeights((prev) => {
      if (index < 0 || index >= sectionCount) return prev;
      const next = prev.slice();
      const clamped = Math.max(typeof window === 'undefined' ? 0 : window.innerHeight, Math.ceil(height));
      if (next[index] === clamped) return prev;
      next[index] = clamped;
      return next;
    });
  };

  return (
    <main ref={ref} className="min-h-screen flex flex-col justify-between">
      <CarOverlay activeSection={activeSection} onSectionHeight={handleSectionHeight} />
      <div className="relative z-10">
        <ProgressBar activeSection={activeSection} />

        {/* Scroll checkpoints only; visible content is rendered in-world via CarOverlay. */}
        <section
          className="section Me"
          style={{ height: sectionHeights[0] || 1020 }}
          aria-hidden="true"
        />
        <section
          className="section About"
          style={{ height: sectionHeights[1] || 1020 }}
          aria-hidden="true"
        />
        <section
          className="section Experience"
          style={{ height: sectionHeights[2] || 1020 }}
          aria-hidden="true"
        />
        <section
          className="section Projects"
          style={{ height: sectionHeights[3] || 1020 }}
          aria-hidden="true"
        />
      </div>
    </main>
  );
}
