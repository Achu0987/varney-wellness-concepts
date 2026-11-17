'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import Magnetic from './Magnetic';
import { go, toast } from '@/lib/c1/util';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCta() {
  const root = useRef(null);
  const flood = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-line', { yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: 0.12, scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } });
      gsap.from('.cta-in', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.3, scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } });
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // colour flood: the page warms from navy to violet light as the chapter opens
        gsap.fromTo(flood.current, { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 20%', scrub: true } });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="cta" data-chapter="Start here" ref={root} aria-labelledby="cta-title" className="relative flex min-h-[110svh] items-end px-[var(--m)] pb-[14svh] md:items-center md:pb-0">
      <img src="/images/dark.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-25 saturate-50" />
      <div ref={flood} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_60%,rgba(117,87,255,0.55),rgba(8,14,32,0)_62%)] opacity-0" />
      <div className="relative z-10 max-w-[60rem]">
        <h2 id="cta-title" className="display text-[clamp(2rem,5.3vw,6.2rem)]">
          {['Your next', 'chapter starts', 'here.'].map((l) => (
            <span key={l} className="mask-line"><span className="cta-line block">{l}</span></span>
          ))}
        </h2>
        <p className="cta-in mt-7 max-w-[32ch] text-[clamp(1.15rem,1.5vw,1.45rem)] text-cool">Discover a more personal approach to wellness.</p>
        <div className="cta-in mt-9 flex flex-wrap gap-3">
          <Magnetic>
            <button type="button" onClick={() => toast('Consultation booking is not part of this concept preview.')} className="btn btn-ice !min-h-[64px] !px-9 !text-[1rem] uppercase tracking-[0.06em]">
              Book a Consultation <ArrowUpRight size={18} />
            </button>
          </Magnetic>
          <Magnetic><a href="#party" onClick={(e) => { e.preventDefault(); go('#party'); }} className="btn btn-glass !min-h-[64px]">Plan a private party</a></Magnetic>
        </div>
      </div>
    </section>
  );
}
