import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Route, Clock, Users, Bus, Zap, Award } from 'lucide-react';
import { metroFacts } from '@/data/metroData';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  route: Route,
  stations: Route,
  time: Clock,
  speed: Zap,
  passengers: Users,
  bus: Bus,
};

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.animate-in'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-metro-navy"
    >
      <div className="w-full px-6 lg:px-12 xl:px-20">
        {/* Section header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-metro-cyan" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-metro-text-secondary">
              About the Metro
            </span>
          </motion.div>

          <h2 className="animate-in font-heading font-bold text-3xl lg:text-5xl text-metro-text mb-4">
            Transforming <span className="text-gradient">Urban Transit</span>
          </h2>

          <p className="animate-in text-metro-text-secondary text-lg">
            The Rawalpindi–Islamabad Metro is Pakistan's first modern bus rapid transit system, 
            connecting the twin cities with efficient, affordable, and eco-friendly transportation.
          </p>
        </div>

        {/* Facts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {metroFacts.map((fact) => {
            const Icon = iconMap[fact.icon] || Award;
            return (
              <motion.div
                key={fact.label}
                className="animate-in glass-panel rounded-2xl p-6 group"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-14 h-14 rounded-xl bg-metro-cyan/10 flex items-center justify-center mb-4 group-hover:bg-metro-cyan/20 transition-colors">
                  <Icon className="w-7 h-7 text-metro-cyan" />
                </div>
                <p className="font-heading font-bold text-3xl text-metro-text mb-1">
                  {fact.value}
                </p>
                <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary">
                  {fact.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* History timeline */}
        <div className="animate-in glass-panel rounded-2xl p-8">
          <h3 className="font-heading font-bold text-xl text-metro-text mb-8">
            Journey Through Time
          </h3>

          <div className="space-y-8">
            {[
              {
                year: '2015',
                title: 'Project Launch',
                description: 'Construction begins on the 24-kilometer BRT corridor connecting Rawalpindi and Islamabad.',
              },
              {
                year: '2017',
                title: 'First Test Run',
                description: 'Initial test runs begin with prototype buses on completed sections of the route.',
              },
              {
                year: '2018',
                title: 'Public Inauguration',
                description: 'The Rawalpindi–Islamabad Metro officially opens to the public with 24 stations.',
              },
              {
                year: '2023',
                title: 'Expansion & Modernization',
                description: 'Smart card system introduced and fleet expanded to meet growing demand.',
              },
            ].map((milestone, idx) => (
              <div key={milestone.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-metro-cyan shadow-neon" />
                  {idx < 3 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-metro-cyan/50 to-transparent mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <span className="font-mono text-sm text-metro-cyan mb-1 block">
                    {milestone.year}
                  </span>
                  <h4 className="font-heading font-semibold text-lg text-metro-text mb-2">
                    {milestone.title}
                  </h4>
                  <p className="text-metro-text-secondary text-sm">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
