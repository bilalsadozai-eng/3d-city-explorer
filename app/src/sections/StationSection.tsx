import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Accessibility, 
  Ticket, 
  Shield, 
  HelpCircle, 
  Car, 
  Utensils, 
  CreditCard, 
  Landmark,
  MapPin
} from 'lucide-react';
import type { Station } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface StationSectionProps {
  station: Station;
  index: number;
}

const facilityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Elevator': Accessibility,
  'Ticketing': Ticket,
  'Security': Shield,
  'Help Desk': HelpCircle,
  'Parking': Car,
  'Food Kiosk': Utensils,
  'ATM': CreditCard,
  'VIP Lounge': Landmark,
  'Retail Shops': CreditCard,
  'Prayer Area': Landmark,
};

export function StationSection({ station, index }: StationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Entrance
      scrollTl.fromTo(
        content,
        { x: index % 2 === 0 ? 100 : -100, opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      // Exit
      scrollTl.fromTo(
        content,
        { x: 0, opacity: 1 },
        { x: index % 2 === 0 ? -100 : 100, opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, [index]);

  return (
    <section
      ref={sectionRef}
      className="section-pinned flex items-center"
      style={{ justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start' }}
    >
      <div ref={contentRef} className="ui-layer m-6 lg:m-12">
        <div className="glass-panel rounded-2xl p-8 max-w-md">
          {/* Station number */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-metro-cyan/10 border border-metro-cyan/30 flex items-center justify-center">
                <span className="font-mono text-sm text-metro-cyan">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary">
                Station
              </span>
            </div>
            <span className="font-mono text-xs text-metro-text-secondary">
              {station.distance} km
            </span>
          </div>

          {/* Station name */}
          <h2 className="font-heading font-bold text-2xl lg:text-3xl text-metro-text mb-2">
            {station.name}
          </h2>
          <p className="font-mono text-sm text-metro-cyan/80 mb-4" dir="rtl">
            {station.nameUrdu}
          </p>

          {/* Description */}
          <p className="text-metro-text-secondary leading-relaxed mb-6">
            {station.description}
          </p>

          {/* Facilities */}
          <div className="mb-6">
            <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-3">
              Facilities
            </p>
            <div className="flex flex-wrap gap-2">
              {station.facilities.map((facility) => {
                const Icon = facilityIcons[facility] || Shield;
                return (
                  <div
                    key={facility}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-metro-navy-light border border-metro-cyan/20"
                  >
                    <Icon className="w-3 h-3 text-metro-cyan" />
                    <span className="text-xs text-metro-text">{facility}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connections */}
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-3">
              Connections
            </p>
            <div className="flex flex-wrap gap-2">
              {station.connections.map((connection) => (
                <span
                  key={connection}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-metro-text-secondary bg-metro-navy-light/50 rounded-lg"
                >
                  <MapPin className="w-3 h-3 text-metro-cyan" />
                  {connection}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
