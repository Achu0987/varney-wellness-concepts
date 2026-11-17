'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Concierge from './Concierge';

gsap.registerPlugin(ScrollTrigger);
const Vase = dynamic(() => import('./Vase'), { ssr: false });
const ease = [0.22, 1, 0.36, 1];
const IVORY = '#F7F3EC';
const LINKS = [['The Club', '#club'], ['Experience', '#experience'], ['Services', '#services'], ['Private Parties', '#parties'], ['Contact', '#contact']];

function go(e, href) {
  e?.preventDefault();
  const el = document.querySelector(href);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.8 }); else el.scrollIntoView({ behavior: 'smooth' });
}
const toast = (m) => window.dispatchEvent(new CustomEvent('c2-toast', { detail: m }));

/* ------------------------------------------------------------------ loader: a gold arch is drawn, then the curtain lifts */
function Loader({ onDone }) {
  const [phase, setPhase] = useState('draw');
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.style.overflow = 'hidden';
    const minT = new Promise((r) => setTimeout(r, reduced ? 200 : 2300));
    const loaded = new Promise((r) => { if (document.readyState === 'complete') r(); else window.addEventListener('load', () => r(), { once: true }); });
    const cap = new Promise((r) => setTimeout(r, 6000));
    Promise.race([Promise.all([minT, loaded, document.fonts?.ready]), cap]).then(() => {
      setPhase('lift');
      onDone?.();
      setTimeout(() => { setPhase('done'); document.documentElement.style.overflow = ''; window.__lenis?.start(); }, 1300);
    });
  }, [onDone]);
  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="ld" role="status" aria-label="Loading Varney Wellness"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#F7F3EC]"
          animate={phase === 'lift' ? { y: '-100%' } : { y: 0 }} transition={{ duration: 1.25, ease: [0.76, 0, 0.24, 1] }}
        >
          <svg viewBox="0 0 120 160" className="h-36 w-28" aria-hidden="true">
            <motion.path d="M10 155 V60 A50 50 0 0 1 110 60 V155" fill="none" stroke="#C5A77B" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: 'easeInOut' }} />
            <motion.path d="M60 40 C 48 62, 48 84, 60 108 C 72 84, 72 62, 60 40 Z" fill="none" stroke="#173B35" strokeWidth="1.2" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.2, delay: 0.6, ease: 'easeInOut' }} />
            <motion.line x1="60" y1="108" x2="60" y2="128" stroke="#173B35" strokeWidth="1.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 1.5 }} />
          </svg>
          <motion.p initial={{ opacity: 0, y: 14, letterSpacing: '0.6em' }} animate={{ opacity: 1, y: 0, letterSpacing: '0.42em' }} transition={{ duration: 1.4, delay: 0.9, ease }} className="c2-serif mt-6 text-[1.8rem] uppercase text-[#173B35]">Varney</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="mt-2 text-[0.8125rem] uppercase tracking-[0.5em] text-[#8a7350]">Wellness</motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ nav */
function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 60);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[var(--m)] py-5 transition-all duration-700 ${solid ? 'bg-[#F7F3EC]/90 py-3.5 backdrop-blur-md' : ''}`}>
        <a href="#top" onClick={(e) => go(e, '#top')} className="leading-none text-[#173B35]" aria-label="Varney Wellness, back to top">
          <span className="c2-serif text-[1.65rem]">Varney Wellness</span>
        </a>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex gap-9 text-[0.92rem] text-[#242424]/80">
            {LINKS.map(([l, h]) => (
              <li key={h}><a href={h} onClick={(e) => go(e, h)} className="group relative py-1 transition-colors hover:text-[#173B35]">{l}<span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#C5A77B] transition-transform duration-500 group-hover:scale-x-100" /></a></li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <a href="#contact" onClick={(e) => go(e, '#contact')} className="hidden h-11 items-center rounded-full border border-[#173B35] px-6 text-[0.9rem] text-[#173B35] transition-colors hover:bg-[#173B35] hover:text-[#F7F3EC] sm:inline-flex">Book a Consultation</a>
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-11 w-11 place-items-center rounded-full bg-[#173B35] text-[#F7F3EC] lg:hidden"><Menu size={18} /></button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-[60] flex flex-col bg-[#173B35] px-[var(--m)] py-6 text-[#F7F3EC]">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-[#F7F3EC]/30"><X size={18} /></button>
            <ul className="mt-12 grid gap-3">
              {LINKS.map(([l, h], i) => (
                <motion.li key={h} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease }}>
                  <a href={h} onClick={(e) => { setOpen(false); go(e, h); }} className="c2-serif block text-[12vw] leading-[1.05]">{l}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ hero */
function Hero({ ready }) {
  const show = (d) => ({ initial: { y: '110%' }, animate: ready ? { y: 0 } : { y: '110%' }, transition: { duration: 0.9, ease, delay: d } });
  const fade = (d) => ({ initial: { opacity: 0, y: 20 }, animate: ready ? { opacity: 1, y: 0 } : {}, transition: { duration: 1.1, ease, delay: d } });
  return (
    <section id="top" className="relative grid min-h-[100svh] items-center gap-10 overflow-hidden px-[var(--m)] pb-16 pt-32 lg:grid-cols-[1.35fr_0.65fr] lg:pb-10">
      <img src="/c2/shadow3.jpg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.35] mix-blend-multiply" />
      <div className="relative z-10">
        <h1 className="c2-serif text-[clamp(2.2rem,5.9vw,6.4rem)] leading-[0.98] text-[#173B35]">
          <span className="block overflow-hidden pb-[0.06em]"><motion.span className="block whitespace-nowrap" {...show(0.05)}>Wellness, beautifully</motion.span></span>
          <span className="block overflow-hidden pb-[0.06em]"><motion.span className="block" {...show(0.15)}>personal.</motion.span></span>
        </h1>
        <motion.p {...fade(0.35)} className="mt-8 max-w-[34ch] text-[1.2rem] leading-relaxed text-[#242424]/80">A private wellness club in Florida, led by Dr. Joseph Varney, MD. An elevated approach to your wellness journey.</motion.p>
        <motion.div {...fade(0.45)} className="mt-10 flex flex-wrap items-center gap-6">
          <a href="#club" onClick={(e) => go(e, '#club')} className="group inline-flex h-14 items-center gap-3 rounded-full bg-[#173B35] pl-7 pr-2 text-[#F7F3EC] transition-colors hover:bg-[#0f2a25]">
            Discover the Experience <span className="grid h-10 w-10 place-items-center rounded-full bg-[#C5A77B] text-[#173B35] transition-transform duration-500 group-hover:rotate-45"><ArrowUpRight size={18} /></span>
          </a>
          <a href="#parties" onClick={(e) => go(e, '#parties')} className="group relative text-[#173B35]">Host a private party<span className="absolute -bottom-1 left-0 h-px w-full bg-[#C5A77B] transition-transform duration-500 group-hover:scale-x-50" style={{ transformOrigin: 'left' }} /></a>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[30rem]">
        <motion.div
          initial={{ clipPath: 'inset(100% 0% 0% 0% round 999px 999px 0 0)' }}
          animate={ready ? { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)' } : {}}
          transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          className="relative aspect-[4/5.4] overflow-hidden rounded-t-full bg-[#173B35]"
        >
          <img src="/c2/shadow2.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-[0.12] mix-blend-screen" />
          <Vase className="absolute inset-0" />
        </motion.div>
        <motion.div {...fade(0.8)} className="absolute -bottom-6 -left-6 hidden w-44 overflow-hidden rounded-full border-[6px] border-[#F7F3EC] sm:block md:-left-14 md:w-52">
          <img src="/c2/golden.jpg" alt="" className="aspect-square w-full object-cover" />
        </motion.div>
      </div>
      <p className="absolute inset-x-[var(--m)] bottom-4 z-10 text-right text-[0.8125rem] text-[#242424]/55">3D: Glass Vase with Flowers, CC0 · Photos: stock placeholders</p>
    </section>
  );
}

/* ------------------------------------------------------------------ statement on sage, words appear as you read */
function Statement() {
  const root = useRef(null);
  const text = 'Varney Wellness is a quieter kind of care: unhurried conversations, a plan written for you, and a space that feels like a private club.';
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.st-w', { opacity: 0.15 }, { opacity: 1, stagger: 0.04, ease: 'none', scrollTrigger: { trigger: '.st-p', start: 'top 80%', end: 'bottom 45%', scrub: true } });
      gsap.utils.toArray('.st-par').forEach((el) => {
        gsap.fromTo(el, { yPercent: Number(el.dataset.from) }, { yPercent: Number(el.dataset.to), ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      gsap.utils.toArray('.st-mask').forEach((el) => {
        gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0 round 999px 999px 0 0)' }, { clipPath: 'inset(0% 0 0 0 round 999px 999px 0 0)', duration: 1.6, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 85%' } });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section id="club" ref={root} className="relative overflow-hidden bg-[#D9E2D6] px-[var(--m)] py-28 md:py-40">
      <div className="mx-auto grid max-w-[1360px] items-center gap-14 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <h2 className="c2-serif text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[0.98] text-[#173B35]">The club</h2>
          <p className="st-p c2-serif mt-8 max-w-[36ch] text-[clamp(1.5rem,2.5vw,2.25rem)] leading-[1.3] text-[#173B35]">
            {text.split(' ').map((w, i) => <span key={i} className="st-w">{w} </span>)}
          </p>
          <div className="mt-12 grid max-w-[40rem] gap-6 sm:grid-cols-3">
            {[['Unhurried', 'Time to listen and explain.'], ['Personal', 'A plan written for you alone.'], ['Private', 'Discreet, calm and considered.']].map(([t, d]) => (
              <div key={t} className="rounded-[1.25rem] bg-[#cdd8c9] p-5">
                <p className="c2-serif text-[1.5rem] text-[#173B35]">{t}</p>
                <p className="mt-1 text-[0.95rem] text-[#242424]/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-[34rem]">
          <div className="st-par absolute left-0 top-0 w-[62%]" data-from="10" data-to="-12">
            <div className="st-mask aspect-[3/4] overflow-hidden rounded-t-full"><img src="/c2/towel.jpg" alt="Woman in a calm, natural-light setting (stock photo)" className="h-full w-full object-cover" /></div>
          </div>
          <div className="st-par absolute bottom-0 right-0 w-[52%]" data-from="25" data-to="-25">
            <div className="st-mask aspect-[3/4] overflow-hidden rounded-t-full"><img src="/c2/serum.jpg" alt="" className="h-full w-full object-cover" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ the experience: a sticky arch that changes as the story moves */
const CHAPTERS = [
  { n: 'I', t: 'Arrive', d: 'Step into a calm, private space designed to slow everything down.', img: '/c2/pool.jpg' },
  { n: 'II', t: 'Consult', d: 'A one-to-one conversation with Dr. Varney about you, your goals and your pace.', img: '/c2/towel.jpg' },
  { n: 'III', t: 'Restore', d: 'A personal plan, carried out with care and explained at every step.', img: '/c2/tubview.jpg' },
  { n: 'IV', t: 'Return', d: 'Thoughtful follow-up, so your plan keeps moving with your life.', img: '/c2/golden.jpg' },
];
function Experience() {
  const root = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.ex-ch').forEach((el) => {
        gsap.fromTo(el.querySelector('.ex-arch'), { clipPath: 'inset(100% 0 0 0 round 999px 999px 0 0)' }, { clipPath: 'inset(0% 0 0 0 round 999px 999px 0 0)', duration: 1.6, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 80%' } });
        gsap.fromTo(el.querySelector('.ex-img'), { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.from(el.querySelectorAll('.ex-in'), { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 70%' } });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section id="experience" ref={root} className="relative bg-[#F7F3EC] px-[var(--m)] py-28 md:py-36">
      <div className="mx-auto max-w-[1360px]">
        <h2 className="c2-serif max-w-[16ch] text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[0.98] text-[#173B35]">Four moments, one journey.</h2>
        <div className="mt-16 grid gap-16 md:gap-24">
          {CHAPTERS.map((c, i) => (
            <article key={c.t} className={`ex-ch grid items-center gap-8 md:grid-cols-2 md:gap-20 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <div className="ex-arch relative aspect-[4/5] overflow-hidden rounded-t-full md:aspect-[5/6]">
                <img src={c.img} alt="" className="ex-img absolute inset-0 h-full w-full object-cover" />
              </div>
              <div>
                <h3 className="ex-in c2-serif text-[clamp(2.6rem,5vw,4.6rem)] leading-none text-[#173B35]">{c.t}</h3>
                <p className="ex-in mt-6 max-w-[34ch] text-[1.2rem] leading-relaxed text-[#242424]/80">{c.d}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-[0.8125rem] text-[#242424]/45">Illustrative copy and stock photographs, pending the practice's approval.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ services: an editorial index; the photo follows the cursor */
const SERVICES = [
  { t: 'Personalized Wellness', img: '/c2/golden.jpg' },
  { t: 'Advanced Aesthetic Care', img: '/c2/serum.jpg' },
  { t: 'Health & Wellbeing', img: '/c2/pool.jpg' },
  { t: 'Your Wellness Journey', img: '/c2/tubview.jpg' },
];
function Services() {
  const root = useRef(null);
  const float = useRef(null);
  const [hover, setHover] = useState(-1);
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const ctx = gsap.context(() => {
      gsap.from('.sv-row', { y: 50, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.sv-list', start: 'top 80%' } });
    }, root);
    if (!fine) return () => ctx.revert();
    const x = gsap.quickTo(float.current, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(float.current, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e) => { const r = root.current.getBoundingClientRect(); x(e.clientX - r.left); y(e.clientY - r.top); };
    root.current.addEventListener('pointermove', move);
    const el = root.current;
    return () => { el.removeEventListener('pointermove', move); ctx.revert(); };
  }, []);
  return (
    <section id="services" ref={root} className="relative overflow-hidden bg-[#F7F3EC] px-[var(--m)] pb-32 pt-10">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="c2-serif text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[0.98] text-[#173B35]">Services</h2>
          <p className="max-w-[36ch] text-[#242424]/65">Placeholder service areas. The final menu is confirmed with Dr. Varney before publication.</p>
        </div>
        <ul className="sv-list mt-12" onPointerLeave={() => setHover(-1)}>
          {SERVICES.map((s, i) => (
            <li key={s.t} className="sv-row">
              <a href="#contact" onClick={(e) => go(e, '#contact')} onPointerEnter={() => setHover(i)} className="group flex items-center justify-between gap-6 rounded-[1.5rem] px-2 py-7 transition-colors duration-500 hover:bg-[#ece5d8] md:px-6 md:py-9">
                <span className="flex items-baseline gap-6">
                  <span className={`c2-serif text-[clamp(2rem,4.6vw,4.4rem)] leading-none transition-all duration-700 ${hover === -1 || hover === i ? 'text-[#173B35]' : 'text-[#173B35]/25'} group-hover:translate-x-4`}>{s.t}</span>
                </span>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#ece5d8] text-[#173B35] transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#173B35] group-hover:text-[#F7F3EC]"><ArrowUpRight size={18} /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div ref={float} className="pointer-events-none absolute left-0 top-0 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <AnimatePresence>
          {hover > -1 && (
            <motion.div key={hover} initial={{ opacity: 0, scale: 0.85, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5, ease }} className="h-80 w-64 overflow-hidden rounded-t-full shadow-2xl">
              <img src={SERVICES[hover].img} alt="" className="h-full w-full object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ doctor */
function Doctor() {
  const root = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.dr-arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 0 0)' }, { clipPath: 'inset(0% 0 0 0 round 999px 999px 0 0)', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'top 25%', scrub: 0.6 } });
      gsap.fromTo('.dr-img', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'bottom top', scrub: true } });
      gsap.from('.dr-in', { y: 40, opacity: 0, stagger: 0.12, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 60%' } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section id="doctor" ref={root} className="relative bg-[#F7F3EC] px-[var(--m)] py-28 md:py-36">
      <div className="mx-auto grid max-w-[1360px] items-center gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-24">
        <div className="relative max-md:order-2">
          <figure className="dr-arch relative m-0 aspect-[3/4] overflow-hidden rounded-t-full"><img src="/images/doc.jpg" alt="Stock portrait placeholder (not Dr. Varney)" className="dr-img h-full w-full object-cover object-[50%_20%]" /></figure>
          <p className="mt-3 text-[0.8125rem] text-[#242424]/55">Stock placeholder, not Dr. Varney</p>
        </div>
        <div>
          <h2 className="dr-in c2-serif text-[clamp(2.6rem,5.2vw,5.2rem)] leading-[0.98] text-[#173B35]">Dr. Joseph Varney, MD</h2>
          <p className="dr-in c2-serif mt-8 text-[clamp(1.4rem,2.2vw,2rem)] leading-snug text-[#242424]/85">“Introduction placeholder. A personal note from Dr. Varney on his approach to care will appear here.”</p>
          <p className="dr-in mt-6 max-w-[46ch] text-[#242424]/65">No qualifications, awards or credentials are shown until they are supplied and confirmed by the practice.</p>
          <a href="#contact" onClick={(e) => go(e, '#contact')} className="dr-in mt-10 inline-flex h-14 items-center rounded-full bg-[#173B35] px-8 text-[#F7F3EC] transition-colors hover:bg-[#0f2a25]">Book a Consultation</a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ newsletter + footer */
function Footer() {
  const [msg, setMsg] = useState('');
  return (
    <footer id="contact" className="relative overflow-hidden bg-[#173B35] px-[var(--m)] pb-10 pt-28 text-[#F7F3EC]">
      <div className="mx-auto grid max-w-[1360px] gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="c2-serif text-[clamp(2.4rem,5vw,4.8rem)] leading-[1.0]">Your next chapter begins quietly.</h2>
          <a href="#contact" onClick={(e) => { e.preventDefault(); toast('Consultation booking is not part of this concept preview.'); }} className="mt-10 inline-flex h-14 items-center rounded-full bg-[#C5A77B] px-8 text-[#173B35] transition-colors hover:bg-[#d6bb92]">Book a Consultation</a>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); const v = e.currentTarget.elements.email.value; setMsg(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? 'Thank you. This is a preview, so nothing was stored.' : 'Please enter a valid email address.'); }} className="self-end" noValidate>
          <p className="c2-serif text-[1.6rem]">The Varney Letter</p>
          <p className="mt-2 text-[#F7F3EC]/65">Occasional notes on wellbeing. Subscription preview only.</p>
          <div className="mt-6 flex items-center gap-3">
            <label htmlFor="c2-email" className="sr-only">Email</label>
            <input id="c2-email" name="email" type="email" placeholder="Your email address" className="flex-1 border-0 border-b border-[#C5A77B]/60 bg-transparent py-3 text-[1.1rem] text-[#F7F3EC] placeholder:text-[#F7F3EC]/40 focus:outline-none" />
            <button type="submit" className="grid h-11 w-11 place-items-center rounded-full bg-[#F7F3EC] text-[#173B35]" aria-label="Subscribe"><ArrowUpRight size={18} /></button>
          </div>
          <p className="mt-3 min-h-[1.5em] text-[0.9rem] text-[#C5A77B]" role="status">{msg}</p>
        </form>
      </div>
      <p className="c2-serif mx-auto mt-24 max-w-[1360px] select-none text-center text-[clamp(4rem,20vw,19rem)] leading-[0.8] tracking-[0.06em] text-[#F7F3EC]/[0.07]" aria-hidden="true">VARNEY</p>
      <div className="mx-auto mt-10 grid max-w-[1360px] gap-6 rounded-[1.5rem] bg-[#12302b] p-8 text-[0.9rem] text-[#F7F3EC]/75 md:grid-cols-4">
        <p>Varney Wellness<br />A private wellness club</p>
        <p>Address placeholder<br />Florida, USA</p>
        <p>Hours and contact details<br />to be supplied by the practice</p>
        <p>Concept 02 of 03 · Illustrative preview. 3D vase: Khronos glTF Sample Assets, CC0. Photos: Unsplash.</p>
      </div>
    </footer>
  );
}

function Toast() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    let t;
    const on = (e) => { setMsg(e.detail); clearTimeout(t); t = setTimeout(() => setMsg(''), 3600); };
    window.addEventListener('c2-toast', on);
    return () => window.removeEventListener('c2-toast', on);
  }, []);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
      <AnimatePresence>{msg && <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="rounded-full bg-[#173B35] px-6 py-3 text-[0.95rem] text-[#F7F3EC] shadow-xl">{msg}</motion.p>}</AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ page */
export default function Concept2() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
    document.documentElement.style.background = IVORY;
    document.body.style.background = IVORY;
    document.body.style.color = '#242424';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis; let tick;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.075 });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    const t = setTimeout(() => ScrollTrigger.refresh(), 1500);
    return () => { clearTimeout(t); if (tick) gsap.ticker.remove(tick); lenis?.destroy(); window.__lenis = null; };
  }, []);
  return (
    <div className="c2 min-h-screen bg-[#F7F3EC]">
      <a href="#club" className="skip">Skip to content</a>
      <Nav />
      <main>
        <Hero ready={ready} />
        <Statement />
        <Experience />
        <Services />
        <Concierge />
        <Doctor />
      </main>
      <Footer />
      <Toast />
    </div>
  );
}
