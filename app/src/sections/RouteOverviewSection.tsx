import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Route, Clock, Building2, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function RouteOverviewSection() {
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
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Entrance
      scrollTl.fromTo(
        content,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      // Exit
      scrollTl.fromTo(
        content,
        { x: 0, opacity: 1 },
        { x: -100, opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="route"
      className="section-pinned flex items-center justify-end"
    >
      <div ref={contentRef} className="ui-layer right-0 top-0 h-full flex items-center">
        <div className="glass-panel rounded-2xl p-8 m-6 lg:m-12 max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-metro-cyan/10 flex items-center justify-center">
              <Route className="w-6 h-6 text-metro-cyan" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-2xl text-metro-text">
                Route Overview
              </h2>
              <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary">
                Complete Network
              </p>
            </div>
          </div>

          <p className="text-metro-text-secondary mb-8 leading-relaxed">
            25 stations across 24 km. From Saddar to the Secretariat—fast, frequent, and fully accessible.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: Route, value: '~24', unit: 'km', label: 'Distance' },
              { icon: Clock, value: '~45', unit: 'min', label: 'End-to-End' },
              { icon: Building2, value: 'BRT', unit: '', label: 'Corridor' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-xl bg-metro-navy-light/50 border border-metro-cyan/10"
              >
                <stat.icon className="w-5 h-5 text-metro-cyan mx-auto mb-2" />
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="font-heading font-bold text-xl text-metro-text">
                    {stat.value}
                  </span>
                  <span className="font-mono text-xs text-metro-text-secondary">
                    {stat.unit}
                  </span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-metro-text-secondary mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <a
            href="#stations"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-metro-cyan/10 border border-metro-cyan/30 text-metro-cyan font-mono text-sm uppercase tracking-wider hover:bg-metro-cyan/20 transition-colors"
          >
            View All Stations
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
