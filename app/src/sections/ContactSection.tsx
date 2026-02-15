import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
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
              Get in Touch
            </span>
          </motion.div>

          <h2 className="animate-in font-heading font-bold text-3xl lg:text-5xl text-metro-text mb-4">
            We're Here to <span className="text-gradient">Help</span>
          </h2>

          <p className="animate-in text-metro-text-secondary text-lg">
            Questions, feedback, or accessibility requests? Reach out to our team.
          </p>
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact form */}
          <motion.div
            className="animate-in glass-panel rounded-2xl p-8"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-heading font-semibold text-xl text-metro-text mb-6">
              Send us a Message
            </h3>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="font-heading font-semibold text-xl text-metro-text mb-2">
                  Message Sent!
                </h4>
                <p className="text-metro-text-secondary">
                  We'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-metro-navy-light border border-metro-cyan/20 text-metro-text placeholder:text-metro-text-secondary/50 focus:outline-none focus:border-metro-cyan transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-metro-navy-light border border-metro-cyan/20 text-metro-text placeholder:text-metro-text-secondary/50 focus:outline-none focus:border-metro-cyan transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-2 block">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-metro-navy-light border border-metro-cyan/20 text-metro-text focus:outline-none focus:border-metro-cyan transition-colors appearance-none"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="accessibility">Accessibility Request</option>
                    <option value="lost">Lost & Found</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-2 block">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-metro-navy-light border border-metro-cyan/20 text-metro-text placeholder:text-metro-text-secondary/50 focus:outline-none focus:border-metro-cyan transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact info */}
          <div className="space-y-6">
            <motion.div
              className="animate-in glass-panel rounded-2xl p-6"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-metro-cyan/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-metro-cyan" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:info@metro.gov.pk"
                    className="text-metro-text hover:text-metro-cyan transition-colors"
                  >
                    info@metro.gov.pk
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="animate-in glass-panel rounded-2xl p-6"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-metro-cyan/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-metro-cyan" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-1">
                    Helpline
                  </p>
                  <a
                    href="tel:0800-12345"
                    className="text-metro-text hover:text-metro-cyan transition-colors"
                  >
                    0800-12345
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="animate-in glass-panel rounded-2xl p-6"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-metro-cyan/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-metro-cyan" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-1">
                    Head Office
                  </p>
                  <p className="text-metro-text">
                    Metro Bus Depot, Faizabad, Islamabad
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="animate-in glass-panel rounded-2xl p-6"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-metro-cyan/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-metro-cyan" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-1">
                    Office Hours
                  </p>
                  <p className="text-metro-text">
                    Mon - Fri: 9:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="animate-in glass-panel rounded-2xl p-6"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-metro-cyan/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-metro-cyan" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-1">
                    Social Media
                  </p>
                  <div className="flex gap-4">
                    {['Twitter', 'Facebook', 'Instagram'].map((social) => (
                      <a
                        key={social}
                        href="#"
                        className="text-metro-text hover:text-metro-cyan transition-colors text-sm"
                      >
                        {social}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          className="mt-24 pt-8 border-t border-metro-cyan/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-metro-cyan to-blue-500 flex items-center justify-center">
                <span className="font-heading font-bold text-xs text-metro-navy">M</span>
              </div>
              <span className="font-mono text-sm text-metro-text-secondary">
                Rawalpindi–Islamabad Metro
              </span>
            </div>

            <p className="font-mono text-xs text-metro-text-secondary">
              © 2026 Rawalpindi–Islamabad Metro. All rights reserved.
            </p>

            <div className="flex gap-6">
              {['Privacy', 'Terms', 'Accessibility'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="font-mono text-xs text-metro-text-secondary hover:text-metro-cyan transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </motion.footer>
      </div>
    </section>
  );
}
