'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);
const TreatmentScene = dynamic(() => import('./TreatmentScene'), { ssr: false });
const ease = [0.22, 1, 0.36, 1];

/* plain-language descriptions of facial areas; no treatment claims */
const AREAS = [
  { name: 'Forehead', title: 'Forehead lines', body: 'Horizontal lines across the forehead that show when you raise your eyebrows.', side: 'left', pos: 'top-[27%]' },
  { name: 'Between the brows', title: 'Frown lines', body: 'The vertical “11” lines between the brows that form when you frown or concentrate.', side: 'left', pos: 'top-[54%]' },
  { name: 'Around the eyes', title: 'Crow’s feet', body: 'Fine lines that fan out from the outer corner of the eyes when you smile.', side: 'right', pos: 'top-[33%]' },
  { name: 'Skin & wellbeing', title: 'Skin and wellbeing', body: 'Overall skin quality and health, looked at as part of your wider wellness plan.', side: 'right', pos: 'top-[60%]' },
];

/**
 * Common treatment areas, explained like an annotated diagram: as you scroll, each area on a
 * real 3D face scan is marked and a line draws out to a label that says what it is in plain words.
 */
export default function Treatment() {
  const root = useRef(null);
  const st = useRef(null);
  const container = useRef(null);
  const paths = useRef([]);
  const cards = useRef([]);
  const overlay = useRef({ container, paths, cards, sides: AREAS.map((a) => a.side) });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      gsap.from('.tr-head > *', { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 75%' } });
      if (reduced) { setActive(AREAS.length - 1); return; }
      st.current = ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: '+=320%', pin: true, anticipatePin: 1,
        onUpdate: (self) => setActive(Math.min(AREAS.length - 1, Math.floor(self.progress * AREAS.length * 0.999))),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const pick = (i) => {
    const t = st.current;
    if (!t) { setActive(i); return; }
    const y = t.start + (t.end - t.start) * ((i + 0.5) / AREAS.length);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.1 }); else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section id="treatments" ref={root} className="relative overflow-hidden md:h-[100svh]" aria-labelledby="tr-title">
      <div ref={container} className="relative h-full min-h-[100svh]">
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[42vw] w-[42vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/25 blur-[140px]" />

        {/* heading: what this section is, in one line */}
        <div className="tr-head relative z-20 px-[var(--m)] pt-[6vh] text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-[0.85rem] font-medium ring-1 ring-white/10"><span className="h-2 w-2 rounded-full bg-ice shadow-[0_0_10px_#8BDFFF]" />Treatments, explained</p>
          <h2 id="tr-title" className="h-gs mt-4 text-[clamp(2rem,3.8vw,3.6rem)] leading-[1.05]">Common treatment areas, <span className="bg-[linear-gradient(100deg,#B9AEFF,#8BDFFF)] bg-clip-text text-transparent">explained</span></h2>
          <p className="mt-3 text-white/65">Scroll to see each area marked on a real 3D face scan.</p>
        </div>

        {/* the real 3D face, centred */}
        <div className="relative z-0 mx-auto mt-4 h-[46svh] w-full max-w-[560px] md:absolute md:bottom-[9%] md:left-1/2 md:top-[17%] md:mt-0 md:h-auto md:w-[min(44vw,620px)] md:max-w-none md:-translate-x-1/2 [mask-image:linear-gradient(180deg,#000_72%,transparent_96%)]">
          <TreatmentScene active={active} onPick={pick} overlay={overlay.current} />
        </div>

        {/* callout lines (desktop) */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full md:block">
          {AREAS.map((a, i) => (
            <path
              key={a.name} ref={(el) => { paths.current[i] = el; }} pathLength="1" fill="none"
              stroke={i === active ? '#8BDFFF' : 'rgba(139,223,255,0.45)'} strokeWidth={i === active ? 1.8 : 1.2}
              style={{ strokeDasharray: 1, strokeDashoffset: i <= active ? 0 : 1, transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1), stroke 0.4s', filter: i === active ? 'drop-shadow(0 0 6px rgba(139,223,255,0.9))' : 'none' }}
            />
          ))}
        </svg>

        {/* label cards (desktop) */}
        {AREAS.map((a, i) => {
          const shown = i <= active;
          const on = i === active;
          return (
            <motion.button
              key={a.name} type="button" onClick={() => pick(i)}
              ref={(el) => { cards.current[i] = el; }}
              initial={false}
              animate={{ opacity: shown ? (on ? 1 : 0.55) : 0, x: shown ? 0 : (a.side === 'left' ? -40 : 40), scale: on ? 1 : 0.97 }}
              transition={{ duration: 0.7, ease, delay: shown && on ? 0.35 : 0 }}
              className={`absolute z-20 hidden w-[min(22rem,26vw)] rounded-[1.4rem] p-5 text-left backdrop-blur-md md:block ${a.pos} ${a.side === 'left' ? 'left-[var(--m)]' : 'right-[var(--m)]'} ${on ? 'bg-white/[0.1] ring-1 ring-ice/60 shadow-[0_20px_60px_-20px_rgba(139,223,255,0.6)]' : 'bg-white/[0.04] ring-1 ring-white/10'}`}
              style={{ pointerEvents: shown ? 'auto' : 'none' }}
            >
              <span className="flex items-center gap-2 text-[0.8rem] font-semibold text-ice">
                <span className={`grid h-6 w-6 place-items-center rounded-full text-[0.75rem] ${on ? 'bg-ice text-navy' : 'bg-white/10 text-white/70'}`}>{i + 1}</span>
                {a.name}
              </span>
              <span className="h-gs mt-2 block text-[1.5rem] leading-tight text-white">{a.title}</span>
              <span className="mt-1.5 block text-[0.95rem] leading-snug text-white/70">{a.body}</span>
            </motion.button>
          );
        })}

        {/* mobile: one card under the face */}
        <div className="relative z-20 px-[var(--m)] pb-10 md:hidden">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease }} className="rounded-[1.4rem] bg-white/[0.08] p-5 ring-1 ring-ice/50">
              <p className="text-[0.8rem] font-semibold text-ice">{active + 1}. {AREAS[active].name}</p>
              <p className="h-gs mt-1 text-[1.4rem]">{AREAS[active].title}</p>
              <p className="mt-1 text-white/70">{AREAS[active].body}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* progress + note */}
        <div className="relative z-20 flex flex-col items-center gap-3 px-[var(--m)] pb-6 md:absolute md:inset-x-0 md:bottom-[3vh] md:pb-0">
          <div className="flex items-center gap-2" role="tablist" aria-label="Areas">
            {AREAS.map((a, i) => (
              <button key={a.name} type="button" role="tab" aria-selected={i === active} onClick={() => pick(i)} className={`rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold transition-all duration-500 ${i === active ? 'bg-[linear-gradient(135deg,#7557FF,#6f8dff)] text-white' : i < active ? 'bg-[#122a4a] text-ice ring-1 ring-ice/30' : 'bg-[#121a3a] text-white/50 ring-1 ring-white/10'}`}>
                {i + 1}. {a.name}
              </button>
            ))}
          </div>
          <p className="max-w-[70ch] text-center text-[0.75rem] text-white/45">Educational only. Whether any treatment is suitable is decided in a consultation with Dr. Varney. 3D head scan: Lee Perry-Smith, CC BY 3.0.</p>
        </div>
      </div>
    </section>
  );
}
