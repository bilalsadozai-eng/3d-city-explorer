import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, MapPin, ArrowRight, Accessibility, Ticket, Shield } from 'lucide-react';
import { stations } from '@/data/metroData';
import type { Station } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface StationsListSectionProps {
  onStationSelect?: (station: Station) => void;
}

export function StationsListSection({ onStationSelect }: StationsListSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const filteredStations = stations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.station-card'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
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

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
    onStationSelect?.(station);
  };

  const getFacilityIcon = (facility: string) => {
    if (facility === 'Elevator') return <Accessibility className="w-3 h-3 text-metro-cyan" />;
    if (facility === 'Ticketing') return <Ticket className="w-3 h-3 text-metro-cyan" />;
    return <Shield className="w-3 h-3 text-metro-cyan" />;
  };

  return (
    <section
      ref={sectionRef}
      id="stations"
      className="relative py-24 lg:py-32 bg-metro-navy"
    >
      <div className="w-full px-6 lg:px-12 xl:px-20">
        {/* Section header */}
        <div className="max-w-3xl mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-metro-cyan" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-metro-text-secondary">
              All Stations
            </span>
          </motion.div>

          <h2 className="font-heading font-bold text-3xl lg:text-5xl text-metro-text mb-4">
            Explore <span className="text-gradient">Stations</span>
          </h2>

          <p className="text-metro-text-secondary text-lg mb-8">
            Discover all 25 stations along the Rawalpindi–Islamabad Metro corridor.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-metro-text-secondary" />
            <input
              type="text"
              placeholder="Search stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl glass-panel text-metro-text placeholder:text-metro-text-secondary/50 focus:outline-none focus:border-metro-cyan transition-colors"
            />
          </div>
        </div>

        {/* Stations grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStations.map((station, idx) => (
            <motion.div
              key={station.id}
              className="station-card glass-panel rounded-xl p-5 cursor-pointer group"
              onClick={() => handleStationClick(station)}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-metro-cyan/10 border border-metro-cyan/30 flex items-center justify-center">
                  <span className="font-mono text-sm text-metro-cyan">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <span className="font-mono text-xs text-metro-text-secondary">
                  {station.distance} km
                </span>
              </div>

              <h3 className="font-heading font-semibold text-lg text-metro-text mb-1 group-hover:text-metro-cyan transition-colors">
                {station.name}
              </h3>

              <p className="text-sm text-metro-text-secondary mb-4 line-clamp-2">
                {station.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                {station.facilities.slice(0, 3).map((facility) => (
                  <div
                    key={facility}
                    className="w-6 h-6 rounded bg-metro-navy-light flex items-center justify-center"
                    title={facility}
                  >
                    {getFacilityIcon(facility)}
                  </div>
                ))}
                {station.facilities.length > 3 && (
                  <span className="text-xs text-metro-text-secondary">
                    +{station.facilities.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 text-metro-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">View details</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected station detail modal */}
        {selectedStation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-metro-navy/90 backdrop-blur-xl"
            onClick={() => setSelectedStation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel rounded-2xl p-8 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-bold text-2xl text-metro-text">
                  {selectedStation.name}
                </h3>
                <button
                  onClick={() => setSelectedStation(null)}
                  className="w-8 h-8 rounded-full bg-metro-navy-light flex items-center justify-center text-metro-text-secondary hover:text-metro-text transition-colors"
                >
                  ×
                </button>
              </div>

              <p className="text-metro-text-secondary mb-6">
                {selectedStation.description}
              </p>

              <div className="mb-6">
                <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-3">
                  Facilities
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedStation.facilities.map((facility) => (
                    <span
                      key={facility}
                      className="px-3 py-1.5 rounded-full bg-metro-cyan/10 text-metro-cyan text-sm"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-3">
                  Connections
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedStation.connections.map((connection) => (
                    <span
                      key={connection}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-metro-navy-light text-metro-text text-sm"
                    >
                      <MapPin className="w-3 h-3 text-metro-cyan" />
                      {connection}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
