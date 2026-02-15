import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Calendar, ArrowRight, ArrowLeft, MapPin, Calculator } from 'lucide-react';
import { stations, calculateFare, calculateDuration, scheduleInfo } from '@/data/metroData';

gsap.registerPlugin(ScrollTrigger);

export function ScheduleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [fromStation, setFromStation] = useState(stations[0].id);
  const [toStation, setToStation] = useState(stations[stations.length - 1].id);
  const [fare, setFare] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const newFare = calculateFare(fromStation, toStation);
    const newDuration = calculateDuration(fromStation, toStation);
    setFare(newFare);
    setDuration(newDuration);
  }, [fromStation, toStation]);

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

  const swapStations = () => {
    setFromStation(toStation);
    setToStation(fromStation);
  };

  return (
    <section
      ref={sectionRef}
      id="schedule"
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
              Plan Your Journey
            </span>
          </motion.div>

          <h2 className="animate-in font-heading font-bold text-3xl lg:text-5xl text-metro-text mb-4">
            Schedule <span className="text-gradient">& Fares</span>
          </h2>

          <p className="animate-in text-metro-text-secondary text-lg">
            Check real-time departures and calculate fares in seconds.
          </p>
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Next Departures Card */}
          <motion.div
            className="animate-in glass-panel rounded-2xl p-8"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-metro-cyan/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-metro-cyan" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-metro-text">
                  Next Departures
                </h3>
                <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary">
                  Real-time updates
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {[
                { route: 'Saddar → Secretariat', time: 4, status: 'On time' },
                { route: 'Secretariat → Saddar', time: 7, status: 'On time' },
                { route: 'Faizabad → Parade Ground', time: 12, status: 'Delayed 2min' },
              ].map((departure, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-metro-navy-light/50 border border-metro-cyan/10"
                >
                  <div className="flex items-center gap-3">
                    <ArrowRight className="w-4 h-4 text-metro-cyan" />
                    <span className="text-metro-text text-sm">{departure.route}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-bold text-metro-cyan">
                      {departure.time} min
                    </span>
                    <p className="text-xs text-metro-text-secondary">{departure.status}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-metro-navy-light/30">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-1">
                  Weekday Hours
                </p>
                <p className="text-metro-text font-semibold">
                  {scheduleInfo.weekday.firstDeparture} - {scheduleInfo.weekday.lastDeparture}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-1">
                  Weekend Hours
                </p>
                <p className="text-metro-text font-semibold">
                  {scheduleInfo.weekend.firstDeparture} - {scheduleInfo.weekend.lastDeparture}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Fare Calculator Card */}
          <motion.div
            className="animate-in glass-panel rounded-2xl p-8"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-metro-cyan/10 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-metro-cyan" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-metro-text">
                  Fare Calculator
                </h3>
                <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary">
                  Estimate your journey cost
                </p>
              </div>
            </div>

            {/* Station selectors */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-2 block">
                  From
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-metro-cyan" />
                  <select
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-metro-navy-light border border-metro-cyan/20 text-metro-text focus:outline-none focus:border-metro-cyan transition-colors appearance-none"
                  >
                    {stations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap button */}
              <div className="flex justify-center">
                <button
                  onClick={swapStations}
                  className="w-10 h-10 rounded-full bg-metro-cyan/10 border border-metro-cyan/30 flex items-center justify-center text-metro-cyan hover:bg-metro-cyan/20 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <ArrowRight className="w-4 h-4 -ml-1" />
                </button>
              </div>

              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-2 block">
                  To
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-metro-cyan" />
                  <select
                    value={toStation}
                    onChange={(e) => setToStation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-metro-navy-light border border-metro-cyan/20 text-metro-text focus:outline-none focus:border-metro-cyan transition-colors appearance-none"
                  >
                    {stations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Fare result */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-metro-cyan/10 to-metro-cyan/5 border border-metro-cyan/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-1">
                    Estimated Fare
                  </p>
                  <p className="font-heading font-bold text-3xl text-metro-cyan">
                    PKR {fare}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-1">
                    Duration
                  </p>
                  <p className="font-heading font-bold text-xl text-metro-text">
                    ~{duration} min
                  </p>
                </div>
              </div>
              <p className="text-xs text-metro-text-secondary mt-3">
                Affordable pricing, consistent across the corridor.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Service alerts */}
        <motion.div
          className="animate-in mt-8 glass-panel rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-metro-cyan" />
            <h3 className="font-heading font-bold text-lg text-metro-text">
              Service Information
            </h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Peak Hours', value: '7:00 - 9:00 AM, 5:00 - 7:00 PM' },
              { label: 'Frequency', value: 'Every 3-6 minutes' },
              { label: 'Smart Card', value: '10% discount on all fares' },
            ].map((info) => (
              <div key={info.label} className="p-4 rounded-lg bg-metro-navy-light/50">
                <p className="font-mono text-xs uppercase tracking-wider text-metro-text-secondary mb-1">
                  {info.label}
                </p>
                <p className="text-metro-text font-medium">{info.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
