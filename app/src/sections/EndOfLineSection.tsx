import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calculator, Calendar, ArrowRight, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function EndOfLineSection() {
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
          end: '+=140%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Entrance
      scrollTl.fromTo(
        content,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'power2.out' },
        0
      );

      // Exit
      scrollTl.fromTo(
        content,
        { scale: 1, opacity: 1 },
        { scale: 1.1, opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned flex items-center justify-center"
    >
      <div ref={contentRef} className="ui-layer text-center">
        <div className="glass-panel rounded-3xl p-10 lg:p-16 max-w-2xl mx-6">
          {/* Completion icon */}
          <div className="w-20 h-20 rounded-full bg-metro-cyan/10 border-2 border-metro-cyan flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-metro-cyan" />
          </div>

          <h2 className="font-heading font-bold text-3xl lg:text-5xl text-metro-text mb-4">
            End of the Line
          </h2>

          <p className="text-metro-text-secondary text-lg mb-10 max-w-md mx-auto">
            Plan your trip, check fares, and see live departure times for the entire metro network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#schedule"
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Fare Calculator
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#schedule"
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Live Schedule
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
