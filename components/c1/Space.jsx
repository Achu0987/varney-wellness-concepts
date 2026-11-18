'use client';
import { A } from '@/lib/asset';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { t: 'Meet.', b: 'One conversation about you: your goals, your history, your pace.' },
  { t: 'Plan.', b: 'A care plan built around your life, explained in plain language.' },
  { t: 'Follow through.', b: 'Check-ins and updates that keep everything connected over time.' },
];

/** How care works, over a full-bleed photograph that slowly scales as you scroll. */
export default function Space() {
  const root = useRef(null);
  const img = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.space-line', { yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: 0.12, scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } });
      gsap.from('.space-step', { y: 60, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: root.current, start: 'top 40%', once: true } });
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.fromTo(img.current, { scale: 1.25, yPercent: -6 }, { scale: 1, yPercent: 6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="space" data-chapter="How care works" ref={root} aria-labelledby="space-title" className="relative flex min-h-[110svh] flex-col justify-between overflow-hidden bg-[#080E20] px-[var(--m)] py-[14vh]">
      <img ref={img} src={A('/images/band.jpg')} alt="Calm, modern clinic interior with natural light and plants (stock photo placeholder)" className="absolute inset-0 h-full w-full object-cover brightness-[0.5] saturate-[0.8]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[#7557FF]/25 mix-blend-soft-light" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,14,32,0.95),rgba(8,14,32,0)_70%)]" />

      <div className="relative max-w-[44rem]">
        <h2 id="space-title" className="display text-[clamp(2rem,5.4vw,6.2rem)]">
          {['A space', 'designed', 'around you.'].map((l) => (
            <span key={l} className="mask-line"><span className="space-line block">{l}</span></span>
          ))}
        </h2>
        <p className="mt-6 max-w-[40ch] text-[clamp(1.05rem,1.4vw,1.3rem)] text-white/85">
          Here is how it works, in three simple steps. Photograph is a stock placeholder until the practice supplies its own.
        </p>
      </div>

      <ul className="relative mt-16 grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.t} className="space-step glass rounded-[1.6rem] p-6">
            <h3 className="display !text-[1.7rem] !normal-case">{s.t}</h3>
            <p className="mt-2 text-white/85">{s.b}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
