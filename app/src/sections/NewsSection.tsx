import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Newspaper, Bell, AlertTriangle, Info, ArrowRight, Calendar } from 'lucide-react';
import { newsItems } from '@/data/metroData';

gsap.registerPlugin(ScrollTrigger);

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  update: Info,
  alert: AlertTriangle,
  announcement: Bell,
};

const categoryColors: Record<string, string> = {
  update: 'text-blue-400 bg-blue-400/10',
  alert: 'text-orange-400 bg-orange-400/10',
  announcement: 'text-green-400 bg-green-400/10',
};

export function NewsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.news-card'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
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

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-metro-navy"
    >
      <div className="w-full px-6 lg:px-12 xl:px-20">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-2 h-2 rounded-full bg-metro-cyan" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-metro-text-secondary">
                Latest Updates
              </span>
            </motion.div>

            <h2 className="font-heading font-bold text-3xl lg:text-5xl text-metro-text mb-4">
              News <span className="text-gradient">& Announcements</span>
            </h2>

            <p className="text-metro-text-secondary text-lg">
              Stay informed about service updates, new features, and important announcements.
            </p>
          </div>

          <motion.a
            href="#"
            className="flex items-center gap-2 text-metro-cyan font-mono text-sm uppercase tracking-wider hover:underline"
            whileHover={{ x: 4 }}
          >
            View all news
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>

        {/* News grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {newsItems.map((news) => {
            const Icon = categoryIcons[news.category];
            const colorClass = categoryColors[news.category];

            return (
              <motion.article
                key={news.id}
                className="news-card glass-panel rounded-2xl p-6 group cursor-pointer"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono uppercase tracking-wider ${colorClass}`}>
                        {news.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-metro-text-secondary">
                        <Calendar className="w-3 h-3" />
                        {new Date(news.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="font-heading font-semibold text-lg text-metro-text mb-2 group-hover:text-metro-cyan transition-colors">
                      {news.title}
                    </h3>

                    <p className="text-metro-text-secondary text-sm line-clamp-2">
                      {news.summary}
                    </p>
                  </div>

                  <ArrowRight className="w-5 h-5 text-metro-text-secondary opacity-0 group-hover:opacity-100 group-hover:text-metro-cyan transition-all flex-shrink-0" />
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Subscribe banner */}
        <motion.div
          className="mt-12 glass-panel rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-metro-cyan/10 flex items-center justify-center">
                <Newspaper className="w-7 h-7 text-metro-cyan" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-xl text-metro-text">
                  Get Service Updates
                </h3>
                <p className="text-metro-text-secondary text-sm">
                  Subscribe to receive notifications about delays, schedule changes, and new features.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-xl bg-metro-navy-light border border-metro-cyan/20 text-metro-text placeholder:text-metro-text-secondary/50 focus:outline-none focus:border-metro-cyan transition-colors w-full lg:w-64"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
