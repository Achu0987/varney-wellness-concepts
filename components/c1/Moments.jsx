'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TILES = [
  { img: '/images/p1.jpg', t: 'Birthday', cls: 'md:row-span-2', speed: -40 },
  { img: '/images/p2.jpg', t: 'Bridal / Bachelorette', cls: '', speed: 30 },
  { img: '/images/p3.jpg', t: 'Friends Gathering', cls: '', speed: -20 },
  { img: '/images/p4.jpg', t: 'Private Wellness Event', cls: 'md:col-span-2', speed: 25, note: "Event inquiry only. Arrangements are subject to the practice's approval." },
];

/** Photo mosaic, each tile drifting at its own speed for depth. */
export default function Moments() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.mom-line', { yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: 0.12, scrollTrigger: { trigger: root.current, start: 'top 65%', once: true } });
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.utils.toArray('.mom-tile').forEach((el) => {
        gsap.fromTo(el, { y: -Number(el.dataset.speed) }, { y: Number(el.dataset.speed), ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      gsap.utils.toArray('.mom-img').forEach((el) => {
        gsap.fromTo(el, { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom 30%', scrub: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="moments" data-chapter="Private events" ref={root} aria-labelledby="moments-title" className="relative overflow-hidden bg-[#0a1128] px-[var(--m)] py-[14vh]">
      <div aria-hidden="true" className="pointer-events-none absolute left-[20%] top-[30%] h-[50vw] w-[50vw] rounded-full bg-violet/25 blur-[140px]" />
      <div className="relative mx-auto max-w-[1500px]">
        <h2 id="moments-title" className="display text-[clamp(2rem,5vw,5.6rem)]">
          {['Moments worth', 'gathering for.'].map((l) => (
            <span key={l} className="mask-line"><span className="mom-line block">{l}</span></span>
          ))}
        </h2>
        <p className="mt-5 max-w-[48ch] text-cool">Celebrations, shared with the people who matter. Photographs are stock placeholders.</p>

        <ul className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-[300px_300px]">
          {TILES.map((t) => (
            <li key={t.t} data-speed={t.speed} className={`mom-tile relative min-h-[16rem] overflow-hidden rounded-[1.8rem] ${t.cls}`}>
              <img src={t.img} alt="" className="mom-img absolute inset-0 h-full w-full object-cover saturate-[0.85] brightness-[0.8]" />
              <div aria-hidden="true" className="absolute inset-0 bg-[#7557FF]/30 mix-blend-soft-light" />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,32,0)_40%,rgba(8,14,32,0.9))]" />
              <div className="absolute inset-x-5 bottom-5">
                <h3 className="display !text-[1.6rem] !normal-case">{t.t}</h3>
                {t.note && <p className="mt-1 text-[0.85rem] text-white/80">{t.note}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
