import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, Menu, X, Sun, Moon } from 'lucide-react';

interface NavigationProps {
  isDark?: boolean;
  onThemeToggle?: () => void;
}

const navItems = [
  { label: 'Route', href: '#route' },
  { label: 'Stations', href: '#stations' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Contact', href: '#contact' },
];

export function Navigation({ isDark = true, onThemeToggle }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass-panel py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-metro-cyan to-blue-500 flex items-center justify-center shadow-neon">
              <Train className="w-5 h-5 text-metro-navy" />
            </div>
            <div className="hidden sm:block">
              <p className="font-heading font-bold text-lg leading-tight text-metro-text">
                METRO
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-metro-text-secondary">
                Rawalpindi–Islamabad
              </p>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="relative font-mono text-sm uppercase tracking-wider text-metro-text-secondary hover:text-metro-cyan transition-colors duration-300"
                whileHover={{ y: -2 }}
              >
                {item.label}
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-px bg-metro-cyan"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}

            {/* Theme Toggle */}
            <motion.button
              onClick={onThemeToggle}
              className="w-10 h-10 rounded-full glass-panel-light flex items-center justify-center text-metro-cyan hover:bg-metro-cyan/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-lg glass-panel-light flex items-center justify-center text-metro-cyan"
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-metro-navy/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              className="absolute top-20 left-4 right-4 glass-panel rounded-2xl p-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left py-3 px-4 rounded-lg font-mono text-lg uppercase tracking-wider text-metro-text hover:bg-metro-cyan/10 hover:text-metro-cyan transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
