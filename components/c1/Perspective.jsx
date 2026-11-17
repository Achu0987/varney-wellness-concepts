'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const LAYERS = [
  { name: 'Surface', title: 'See the whole person.', body: 'Every person is more than a list of symptoms. Care starts with the full picture.' },
  { name: 'Structure', title: 'Look beneath the surface.', body: 'Understanding how things connect is the first step toward a plan that fits.' },
  { name: 'Core', title: 'Begin from what matters.', body: 'A relationship built on clarity, so each step feels like yours.' },
];

export default function Perspective() {
  const root = useRef(null);
  const giant = useRef(null);
  const giant2 = useRef(null);
  const ringA = useRef(null);
  const ringB = useRef(null);
  const fill = useRef(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      gsap.from('.persp-line', {
        yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      });
      if (reduced) return;
      const st = { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.8 };
      gsap.fromTo(giant.current, { xPercent: 8 }, { xPercent: -42, ease: 'none', scrollTrigger: st });
      gsap.fromTo(giant2.current, { xPercent: -30 }, { xPercent: 12, ease: 'none', scrollTrigger: st });
      gsap.to(ringA.current, { rotate: 420, scale: 1.25, ease: 'none', scrollTrigger: st });
      gsap.to(ringB.current, { rotate: -300, scale: 0.8, ease: 'none', scrollTrigger: st });
      ScrollTrigger.create({
        ...st, scrub: undefined,
        onUpdate: (self) => {
          setIdx(Math.min(LAYERS.length - 1, Math.floor(self.progress * LAYERS.length)));
          if (fill.current) fill.current.style.transform = `scaleY(${self.progress.toFixed(3)})`;
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="perspective" data-chapter="How we think" ref={root} aria-labelledby="persp-title" className="relative h-[430vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* parallax layers */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div ref={giant} className="display absolute bottom-[6%] left-0 whitespace-nowrap text-[clamp(8rem,26vw,30rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1.5px_rgba(139,223,255,0.22)]">
            Perspective
          </div>
          <div ref={giant2} className="display absolute top-[13%] left-0 whitespace-nowrap text-[clamp(4rem,11vw,13rem)] leading-[0.8] text-white/[0.045]">
            Layer by layer
          </div>
          <div ref={ringA} className="absolute right-[2%] top-1/2 hidden h-[min(78vh,56vw)] w-[min(78vh,56vw)] -translate-y-1/2 rounded-full border border-dashed border-ice/25 md:block" />
          <div ref={ringB} className="absolute right-[7%] top-1/2 hidden h-[min(58vh,42vw)] w-[min(58vh,42vw)] -translate-y-1/2 rounded-full border border-violet/40 md:block" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-center px-[var(--m)] pb-24 pt-28 max-md:justify-end md:max-w-[52%] md:pb-10">
          <div className="max-md:rounded-3xl max-md:bg-navy/80 max-md:p-5">
          <h2 id="persp-title" className="display text-[clamp(2rem,5.4vw,6.2rem)]">
            {['A new', 'perspective', 'on wellness.'].map((l) => (
              <span key={l} className="mask-line"><span className="persp-line block">{l}</span></span>
            ))}
          </h2>

          <p className="mt-5 max-w-[44ch] text-[0.9rem] text-ice/80">What you are seeing: a real 3D head scan with a real skull inside. We look beneath the surface.</p>
          <div className="mt-6 min-h-[9.5rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="text-[clamp(1.4rem,2.2vw,2.1rem)] leading-tight">{LAYERS[idx].title}</h3>
                <p className="mt-3 max-w-[38ch] text-cool">{LAYERS[idx].body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          </div>
        </div>

        {/* layer indicator, tied to the x-ray reveal */}
        <div className="absolute bottom-8 right-[var(--m)] z-10 flex items-end gap-4 max-md:left-[var(--m)] max-md:right-auto">
          <div aria-hidden="true" className="h-28 w-[6px] overflow-hidden rounded-full bg-white/12">
            <div ref={fill} className="h-full w-full origin-top scale-y-0 rounded-full bg-ice" />
          </div>
          <ul className="grid gap-1.5 text-right max-md:text-left" aria-label="Layers">
            {LAYERS.map((l, i) => (
              <li key={l.name} aria-current={i === idx ? 'true' : undefined} className={`display text-[clamp(1rem,1.6vw,1.5rem)] transition-all duration-500 ${i === idx ? 'text-ice' : 'text-white/30'}`}>
                {l.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
