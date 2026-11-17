'use client';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Magnetic from './Magnetic';
import { go } from '@/lib/c1/util';

const ease = [0.22, 1, 0.36, 1];
const LINES = ['The future of', 'wellness is', 'personal.'];

export default function Hero() {
  return (
    <section id="hero" data-chapter="Who we are" aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-end px-[var(--m)] pb-[12svh] pt-36 md:items-center md:pb-0 md:pt-28">
      <div className="relative z-10 max-w-[56rem]">
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.4 }}
          className="mb-6 text-[0.95rem] font-bold uppercase tracking-[0.32em] text-ice"
        >
          Varney Wellness
        </motion.p>

        <h1 id="hero-title" className="display text-[clamp(2rem,5.3vw,6.6rem)]">
          {LINES.map((l, i) => (
            <span key={l} className="mask-line">
              <motion.span
                className="block"
                initial={{ y: '115%', rotate: 3 }} animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1.2, ease, delay: 0.55 + i * 0.12 }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 1.15 }}
          className="mt-7 max-w-[30ch] text-[clamp(1.15rem,1.5vw,1.45rem)] leading-snug text-cool"
        >
          A more connected approach to care, designed around you.
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }} className="mt-4 max-w-[44ch] text-[0.98rem] text-white/70">
          Varney Wellness is a physician-led wellness practice in Florida, led by Dr. Joseph Varney, MD. Scroll to see how it works.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 1.3 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <Magnetic><a href="#perspective" onClick={(e) => { e.preventDefault(); go('#perspective'); }} className="btn btn-ice">Explore Our Approach</a></Magnetic>
          <Magnetic><a href="#cta" onClick={(e) => { e.preventDefault(); go('#cta'); }} className="btn btn-glass">Book a Consultation</a></Magnetic>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
        aria-hidden="true" className="absolute bottom-7 left-[var(--m)] hidden items-center gap-3 text-[0.85rem] text-cool md:flex"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/8 ring-1 ring-white/15"><ArrowDown size={16} className="animate-bounce" /></span>
        Move your cursor. Scroll to travel through.
      </motion.div>
    </section>
  );
}
