import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onExploreClick?: () => void;
}

export function HeroSection({ onExploreClick }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const subhead = subheadRef.current;
    const cta = ctaRef.current;

    if (!section || !headline || !subhead || !cta) return;

    const ctx = gsap.context(() => {
      // Initial entrance animation
      gsap.fromTo(
        headline,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
      );

      gsap.fromTo(
        subhead,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 }
      );

      gsap.fromTo(
        cta,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.9 }
      );

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      scrollTl
        .fromTo(
          headline,
          { y: 0, opacity: 1 },
          { y: -80, opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          subhead,
          { y: 0, opacity: 1 },
          { y: -60, opacity: 0, ease: 'power2.in' },
          0.72
        )
        .fromTo(
          cta,
          { y: 0, opacity: 1 },
          { y: -40, opacity: 0, ease: 'power2.in' },
          0.74
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned flex items-center justify-start"
    >
      <div className="ui-layer w-full h-full flex items-center">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          {/* Micro label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-metro-cyan animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-metro-text-secondary">
              Route 01 — Rawalpindi to Islamabad
            </span>
          </motion.div>

          {/* Main headline */}
          <h1
            ref={headlineRef}
            className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-metro-text leading-[1.05] max-w-4xl mb-6"
          >
            One line.
            <br />
            <span className="text-gradient">Twenty-five stations.</span>
            <br />
            A city connected.
          </h1>

          {/* Subheadline */}
          <p
            ref={subheadRef}
            className="text-base sm:text-lg md:text-xl text-metro-text-secondary max-w-xl mb-10 leading-relaxed"
          >
            Explore the Rawalpindi–Islamabad Metro in 3D—schedules, fares, and live service info at your fingertips.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <motion.button
              onClick={onExploreClick}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MapPin className="w-4 h-4" />
              Explore the Route
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.a
              href="#schedule"
              className="btn-secondary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Clock className="w-4 h-4" />
              View Schedule
            </motion.a>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap gap-8 mt-16"
          >
            {[
              { value: '24', unit: 'km', label: 'Route Length' },
              { value: '25', unit: '', label: 'Stations' },
              { value: '45', unit: 'min', label: 'Journey Time' },
            ].map((stat) => (
              <div key={stat.label} className="text-left">
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-bold text-3xl sm:text-4xl text-metro-cyan">
                    {stat.value}
                  </span>
                  <span className="font-mono text-sm text-metro-text-secondary">
                    {stat.unit}
                  </span>
                </div>
                <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
