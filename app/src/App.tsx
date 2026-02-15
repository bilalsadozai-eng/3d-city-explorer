import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Train } from 'lucide-react';

import { Navigation } from '@/components/Navigation';
import { Scene } from '@/components/3d/Scene';
import { HeroSection } from '@/sections/HeroSection';
import { RouteOverviewSection } from '@/sections/RouteOverviewSection';
import { StationSection } from '@/sections/StationSection';
import { EndOfLineSection } from '@/sections/EndOfLineSection';
import { ScheduleSection } from '@/sections/ScheduleSection';
import { StationsListSection } from '@/sections/StationsListSection';
import { AboutSection } from '@/sections/AboutSection';
import { NewsSection } from '@/sections/NewsSection';
import { ContactSection } from '@/sections/ContactSection';

import { stations } from '@/data/metroData';
import type { Station } from '@/types';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [cameraProgress, setCameraProgress] = useState(0);
  const [activeStation, setActiveStation] = useState<string | null>(null);
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);
  const [busProgress, setBusProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const mainRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
      
      // Update camera progress based on scroll (for 3D scene)
      setCameraProgress(progress);
      
      // Update bus progress
      setBusProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global snap for pinned sections
  useEffect(() => {
    if (isLoading) return;

    // Wait for all ScrollTriggers to be created
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map((st) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value) => {
            const inPinned = pinnedRanges.some(
              (r) => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  const handleStationClick = (station: Station) => {
    setActiveStation(station.id);
  };

  const handleStationHover = (station: Station | null) => {
    setHoveredStation(station);
  };

  const handleExploreClick = () => {
    const routeSection = document.getElementById('route');
    if (routeSection) {
      routeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-metro-navy flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-metro-cyan to-blue-500 flex items-center justify-center shadow-neon-strong mb-8">
                <Train className="w-12 h-12 text-metro-navy" />
              </div>
              
              {/* Animated rings */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-metro-cyan/30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-metro-cyan/20"
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-heading font-bold text-2xl text-metro-text mb-2"
            >
              METRO
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="font-mono text-xs uppercase tracking-[0.2em] text-metro-text-secondary"
            >
              Rawalpindi–Islamabad
            </motion.p>

            {/* Loading bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="h-0.5 bg-gradient-to-r from-metro-cyan to-blue-500 mt-8 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div
        className="progress-bar"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Navigation */}
      <Navigation />

      {/* 3D Canvas - Fixed background */}
      <div ref={canvasContainerRef} className="canvas-container">
        <Canvas
          camera={{ position: [0, 5, 15], fov: 60 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Scene
              cameraProgress={cameraProgress}
              activeStation={activeStation}
              onStationClick={handleStationClick}
              onStationHover={handleStationHover}
              busProgress={busProgress}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Scrollable content */}
      <main ref={mainRef} className="scroll-content">
        {/* Section 1: Hero */}
        <HeroSection onExploreClick={handleExploreClick} />

        {/* Section 2: Route Overview */}
        <RouteOverviewSection />

        {/* Sections 3-8: Station Scenes */}
        {stations.slice(0, 5).map((station, index) => (
          <StationSection
            key={station.id}
            station={station}
            index={index}
          />
        ))}

        {/* Section 9: End of Line */}
        <EndOfLineSection />

        {/* Section 10: Schedule & Fare (flowing) */}
        <ScheduleSection />

        {/* Section 11: Stations List (flowing) */}
        <StationsListSection onStationSelect={handleStationClick} />

        {/* Section 12: About (flowing) */}
        <AboutSection />

        {/* Section 13: News (flowing) */}
        <NewsSection />

        {/* Section 14: Contact (flowing) */}
        <ContactSection />
      </main>

      {/* Hovered station tooltip */}
      <AnimatePresence>
        {hoveredStation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-panel px-6 py-3 rounded-full"
          >
            <p className="font-mono text-sm text-metro-cyan">
              {hoveredStation.name}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
