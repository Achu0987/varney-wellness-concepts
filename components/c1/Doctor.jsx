'use client';
import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export default function Doctor() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const seen = useInView(ref, { once: true, amount: 0.25 });
  const st = seen ? 'show' : 'hide';

  return (
    <section id="doctor" data-chapter="Your doctor" ref={ref} aria-labelledby="doctor-title" className="relative overflow-hidden bg-navy px-[var(--m)] py-[16vh]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-[5fr_6fr] md:gap-20">
        {/* image reveal: the frame opens, the picture settles */}
        <motion.figure
          variants={{ hide: { clipPath: 'inset(100% 0% 0% 0% round 2rem)' }, show: { clipPath: 'inset(0% 0% 0% 0% round 2rem)' } }}
          initial="hide" animate={st}
          transition={{ duration: 1.5, ease }}
          className="relative m-0 aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#0d1630]"
        >
          <motion.div style={{ y }} className="absolute inset-[-10%]">
            <motion.img
              src="/images/doc.jpg" alt="Stock portrait placeholder for Dr. Joseph Varney (not him)"
              initial={{ scale: 1.35 }} animate={{ scale: seen ? 1 : 1.35 }} transition={{ duration: 1.8, ease }}
              className="h-full w-full object-cover object-[50%_20%] saturate-[0.9]"
            />
          </motion.div>
          <figcaption className="absolute bottom-4 left-4 rounded-full bg-navy/80 px-4 py-2 text-[0.85rem] font-medium text-ice">Stock placeholder, not Dr. Varney</figcaption>
        </motion.figure>

        <div>
          <h2 id="doctor-title" className="display text-[clamp(2rem,5vw,5.4rem)]">
            {['Dr. Joseph', 'Varney, MD'].map((l, i) => (
              <span key={l} className="mask-line">
                <motion.span className="block" initial={{ y: '115%' }} animate={{ y: seen ? 0 : '115%' }} transition={{ duration: 1.1, ease, delay: i * 0.12 }}>{l}</motion.span>
              </span>
            ))}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: seen ? 1 : 0, y: seen ? 0 : 30 }} transition={{ duration: 1, ease, delay: 0.3 }}
            className="mt-8 max-w-[34ch] text-[clamp(1.2rem,1.9vw,1.75rem)] leading-snug"
          >
            Introduction placeholder. Dr. Varney's background and approach to care will be written with the practice and verified before publication.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: seen ? 1 : 0 }} transition={{ duration: 1, delay: 0.6 }}
            className="mt-5 text-[0.95rem] text-cool"
          >
            No qualifications, awards or credentials are shown until they are supplied and confirmed.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
