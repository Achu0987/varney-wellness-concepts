'use client';
import { A } from '@/lib/asset';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Concierge from './Concierge';
import { Nav, Footer, Toast, R } from './site/Site';
import { SERVICES as SV } from './site/data';

gsap.registerPlugin(ScrollTrigger);
const ClubRoom = dynamic(() => import('./ClubRoom'), { ssr: false });
const ease = [0.22, 1, 0.36, 1];
const IVORY = '#F7F3EC';

function go(e, href) {
  e?.preventDefault();
  const el = document.querySelector(href);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.8 }); else el.scrollIntoView({ behavior: 'smooth' });
}

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

/* ------------------------------------------------------------------ hero: a real photograph seen through an arch; scrolling opens the arch to the whole screen */
function Hero() {
  const root = useRef(null);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      // arch size and place, in pixels, so the clip starts exactly on the drawn arch
      const arch = () => {
        const vw = window.innerWidth; const vh = window.innerHeight;
        const w = vw < 768 ? vw * 0.62 : Math.min(vw * 0.25, 400);
        const h = Math.min(w * 1.32, vh * 0.5);
        const top = vh * (vw < 768 ? 0.34 : 0.27);
        return { w, h, top, x: (vw - w) / 2, b: vh - top - h };
      };
      const start = () => { const a = arch(); return `inset(${a.top}px ${a.x}px ${a.b}px ${a.x}px round ${a.w / 2}px ${a.w / 2}px 0px 0px)`; };
      gsap.set('.hx-clip', { clipPath: start() });
      gsap.set('.hx-over > *', { opacity: 0, y: 50 });
      gsap.set('.hx-in', { y: 40, opacity: 0 });
      gsap.set('.hx-clip', { scale: 0.92, opacity: 0 });
      const intro = () => {
        gsap.to('.hx-clip', { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out' });
        gsap.to('.hx-in', { y: 0, opacity: 1, duration: 1.4, stagger: 0.12, ease: 'power3.out', delay: 0.15 });
      };
      if (window.__c2Loading) window.addEventListener('c2-entered', intro, { once: true }); else intro();
      if (reduced) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.3, invalidateOnRefresh: true } });
      tl.fromTo('.hx-clip', { clipPath: start }, { clipPath: 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)', ease: 'power2.inOut', duration: 1 }, 0)
        .fromTo('.hx-img', { scale: 1.35 }, { scale: 1.04, ease: 'none', duration: 1.6 }, 0)
        .to('.hx-l1', { yPercent: -140, opacity: 0, ease: 'power2.in', duration: 0.7 }, 0)
        .to('.hx-l2', { yPercent: 140, opacity: 0, ease: 'power2.in', duration: 0.7 }, 0)
        .to('.hx-side', { opacity: 0, y: 30, duration: 0.4 }, 0)
        .fromTo('.hx-scrim', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.6)
        .to('.hx-over > *', { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, 0.95);
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section id="top" ref={root} className="relative h-[280vh]" aria-label="Introduction">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#F7F3EC]">
        {/* headline around the arch */}
        <h1 className="c2-serif pointer-events-none absolute inset-0 z-10 text-center text-[#173B35]">
          <span className="hx-l1 hx-in absolute inset-x-[var(--m)] top-[13vh] block text-[17vw] leading-[0.95] md:top-[8vh] md:text-[clamp(3rem,9.6vw,10rem)]">Wellness,</span>
          <span className="hx-l2 hx-in absolute inset-x-[var(--m)] top-[74vh] block text-[10.5vw] leading-[1] md:top-[79vh] md:text-[clamp(2.2rem,6.4vw,7rem)]">beautifully personal.</span>
        </h1>
        {/* the real photograph, clipped to the arch */}
        <div className="hx-clip absolute inset-0 z-0 overflow-hidden [contain:paint]">
          <img src={A('/c2/pool.jpg')} alt="A calm indoor pool with tall windows onto trees (stock placeholder)" className="hx-img h-full w-full object-cover will-change-transform" fetchPriority="high" />
          <div className="hx-scrim absolute inset-0 bg-[linear-gradient(0deg,rgba(10,30,26,0.72),rgba(10,30,26,0.15)_55%,rgba(10,30,26,0.25))] opacity-0" />
        </div>
        {/* side notes, desktop */}
        <div className="hx-side hx-in absolute left-[var(--m)] top-[46vh] z-10 hidden max-w-[17rem] md:block">
          <p className="text-[1.05rem] leading-relaxed text-[#173B35]/85">A private wellness club in Florida, led by Dr. Joseph Varney, MD.</p>
          <a href="#parties" onClick={(e) => go(e, '#parties')} className="group mt-6 inline-flex h-12 items-center gap-3 rounded-full bg-[#173B35] pl-6 pr-1.5 text-[0.95rem] text-[#F7F3EC] transition-colors hover:bg-[#0f2a25]">Host a private party <span className="grid h-9 w-9 place-items-center rounded-full bg-[#C5A77B] text-[#173B35] transition-transform duration-500 group-hover:rotate-45"><ArrowUpRight size={16} /></span></a>
        </div>
        <p className="hx-side hx-in absolute right-[var(--m)] top-[46vh] z-10 hidden items-center gap-3 text-[0.95rem] text-[#173B35] md:flex">Scroll to enter <span className="grid h-10 w-10 place-items-center rounded-full bg-[#173B35] text-[#F7F3EC]"><ArrowDown size={16} /></span></p>
        <p className="hx-side hx-in absolute inset-x-[var(--m)] bottom-[4vh] z-10 text-center text-[1rem] text-[#173B35]/85 md:hidden">A private wellness club in Florida, led by Dr. Joseph Varney, MD.</p>
        {/* revealed over the open photograph */}
        <div className="hx-over absolute inset-x-[var(--m)] bottom-[10vh] z-10 mx-auto max-w-[1360px] text-[#F7F3EC]">
          <h2 className="c2-serif max-w-[14ch] text-[clamp(2.6rem,6.4vw,6.6rem)] leading-[0.98]">A quieter kind of care.</h2>
          <p className="mt-5 max-w-[38ch] text-[1.15rem] leading-relaxed text-[#F7F3EC]/85">Unhurried conversations, a plan written only for you, and a space that feels like a private club.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#club" onClick={(e) => go(e, '#club')} className="group inline-flex h-14 items-center gap-3 rounded-full bg-[#F7F3EC] pl-7 pr-2 text-[#173B35] transition-colors hover:bg-white">Discover the club <span className="grid h-10 w-10 place-items-center rounded-full bg-[#C5A77B] transition-transform duration-500 group-hover:rotate-45"><ArrowUpRight size={18} /></span></a>
            <a href="#parties" onClick={(e) => go(e, '#parties')} className="inline-flex h-14 items-center rounded-full px-7 text-[#F7F3EC] ring-1 ring-[#F7F3EC]/60 transition-colors hover:bg-[#F7F3EC]/10">Private parties</a>
          </div>
        </div>
      </div>
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
    <section id="club" ref={root} className="relative overflow-hidden bg-[#D9E2D6] px-[var(--m)] py-24 md:py-32">
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
          <div className="st-par absolute left-0 top-0 w-[62%] will-change-transform" data-from="10" data-to="-12">
            <div className="st-mask aspect-[3/4] overflow-hidden rounded-t-full"><img loading="lazy" decoding="async" src={A('/c2/towel.jpg')} alt="Woman in a calm, natural-light setting (stock photo)" className="h-full w-full object-cover" /></div>
          </div>
          <div className="st-par absolute bottom-0 right-0 w-[52%] will-change-transform" data-from="25" data-to="-25">
            <div className="st-mask aspect-[3/4] overflow-hidden rounded-t-full"><img loading="lazy" decoding="async" src={A('/c2/serum.jpg')} alt="" className="h-full w-full object-cover" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ the experience: four real photographs travel sideways as you scroll */
const CHAPTERS = [
  { t: 'Arrive', d: 'Step into a calm, private space designed to slow everything down.', img: A('/c2/pool.jpg'), pos: '50% 50%' },
  { t: 'Consult', d: 'A one-to-one conversation with Dr. Varney about you, your goals and your pace.', img: A('/c2/towel.jpg'), pos: '50% 30%' },
  { t: 'Restore', d: 'A personal plan, carried out with care and explained at every step.', img: A('/c2/tubview.jpg'), pos: '50% 50%' },
  { t: 'Return', d: 'Thoughtful follow-up, so your plan keeps moving with your life.', img: A('/c2/golden.jpg'), pos: '50% 35%' },
];
function Experience() {
  const root = useRef(null);
  const track = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      const dist = () => track.current.scrollWidth - window.innerWidth;
      const move = gsap.to(track.current, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${dist()}`, scrub: 0.3, pin: true, invalidateOnRefresh: true } });
      gsap.utils.toArray('.xp-card').forEach((card) => {
        gsap.fromTo(card.querySelector('.xp-img'), { xPercent: -10, scale: 1.15 }, { xPercent: 10, scale: 1.15, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: move, start: 'left right', end: 'right left', scrub: true } });
        gsap.fromTo(card.querySelectorAll('.xp-in'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: card, containerAnimation: move, start: 'left 70%', end: 'left 35%', scrub: true } });
      });
      gsap.fromTo('.xp-bar', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section id="experience" ref={root} className="relative overflow-hidden bg-[#F7F3EC]">
      <div className="flex min-h-[100svh] items-center">
        <div ref={track} className="flex items-center gap-6 px-[var(--m)] py-24 will-change-transform md:gap-10">
          <div className="w-[78vw] shrink-0 md:w-[34vw]">
            <h2 className="c2-serif text-[clamp(2.8rem,5.6vw,5.8rem)] leading-[0.98] text-[#173B35]">Four moments, one journey.</h2>
            <p className="mt-6 max-w-[30ch] text-[1.15rem] leading-relaxed text-[#242424]/75">How a visit to the club unfolds, from the door to the follow-up.</p>
            <p className="mt-10 flex items-center gap-3 text-[0.95rem] text-[#173B35]">Keep scrolling <ArrowUpRight size={16} className="rotate-45" /></p>
          </div>
          {CHAPTERS.map((c) => (
            <article key={c.t} className="xp-card relative h-[72svh] w-[80vw] shrink-0 overflow-hidden rounded-[2rem] md:h-[76svh] md:w-[44vw]">
              <img loading="lazy" decoding="async" src={c.img} alt="" className="xp-img absolute inset-0 h-full w-full object-cover will-change-transform" style={{ objectPosition: c.pos }} />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,30,26,0.78),rgba(10,30,26,0)_55%)]" />
              <div className="absolute inset-x-7 bottom-7 text-[#F7F3EC] md:inset-x-10 md:bottom-10">
                <h3 className="xp-in c2-serif text-[clamp(2.6rem,4.6vw,4.8rem)] leading-none">{c.t}</h3>
                <p className="xp-in mt-4 max-w-[34ch] text-[1.08rem] leading-relaxed text-[#F7F3EC]/85">{c.d}</p>
              </div>
            </article>
          ))}
          <div className="w-[8vw] shrink-0" aria-hidden="true" />
        </div>
      </div>
      <div className="absolute inset-x-[var(--m)] bottom-8 h-[3px] overflow-hidden rounded-full bg-[#173B35]/10"><div className="xp-bar h-full w-full origin-left rounded-full bg-[#C5A77B]" /></div>
      <p className="absolute bottom-12 left-[var(--m)] right-[var(--m)] text-right text-[0.8125rem] text-[#242424]/50">Illustrative copy and stock photographs, pending the practice’s approval.</p>
    </section>
  );
}

/* ------------------------------------------------------------------ inside the club: scroll walks the camera through one photoreal room */
const ROOM_STOPS = [
  { a: -1, b: 0.12, h: 'Inside the club.', d: 'Scroll to walk through the door.' },
  { a: 0.16, b: 0.3, h: 'Arrive quietly.', d: 'A private entrance, and no crowded waiting room.' },
  { a: 0.36, b: 0.5, h: 'Consultation, with time.', d: 'Unhurried one-to-one care with Dr. Varney.' },
  { a: 0.56, b: 0.7, h: 'The lounge.', d: 'Velvet, candlelight and quiet, before anything begins.' },
  { a: 0.74, b: 0.86, h: 'Considered details.', d: 'Every room designed so that time slows down.' },
  { a: 0.9, b: 2, h: 'Your private club.', d: 'Book a consultation, or plan a private gathering for your people.', cta: true },
];
const smoothstep = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

function InsideClub() {
  const root = useRef(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '150% 0px' });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);
  const progress = useRef(0);
  const texts = useRef([]);
  const bar = useRef(null);
  useEffect(() => {
    const on = () => {
      const el = root.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      progress.current = p;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      ROOM_STOPS.forEach((st, i) => {
        const n = texts.current[i]; if (!n) return;
        const o = smoothstep(st.a - 0.04, st.a, p) * (1 - smoothstep(st.b, st.b + 0.04, p));
        n.style.opacity = String(o);
        n.style.transform = `translateY(${(1 - o) * 28}px)`;
        n.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  return (
    <section id="lounge" ref={root} className="relative h-[620vh] bg-[#EFE8DC]" aria-label="Inside the club">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {near && <ClubRoom progress={progress} className="absolute inset-0" />}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_55%,rgba(0,0,0,0.38))]" />
        {/* soft scrim so the words always read */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(10,30,26,0.55),rgba(10,30,26,0)_55%)] md:w-[70%]" />
        {ROOM_STOPS.map((st, i) => (
          <div key={st.h} ref={(n) => { texts.current[i] = n; }} className="absolute bottom-[14vh] left-[var(--m)] z-10 max-w-[36rem] text-[#F7F3EC]" style={{ opacity: i === 0 ? 1 : 0 }}>
            <h2 className="c2-serif text-[clamp(2.6rem,6vw,6.2rem)] leading-[0.98]">{st.h}</h2>
            <p className="mt-5 max-w-[32ch] text-[1.15rem] leading-relaxed text-[#F7F3EC]/85">{st.d}</p>
            {st.cta && (
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={R('/contact')} className="group inline-flex h-14 items-center gap-3 rounded-full bg-[#F7F3EC] pl-7 pr-2 text-[#173B35] transition-colors hover:bg-white">Book a Consultation <span className="grid h-10 w-10 place-items-center rounded-full bg-[#C5A77B] transition-transform duration-500 group-hover:rotate-45"><ArrowUpRight size={18} /></span></Link>
                <a href="#parties" onClick={(e) => go(e, '#parties')} className="inline-flex h-14 items-center rounded-full px-7 text-[#F7F3EC] ring-1 ring-[#F7F3EC]/60 transition-colors hover:bg-[#F7F3EC]/10">Private parties</a>
              </div>
            )}
          </div>
        ))}
        <div className="absolute inset-x-[var(--m)] bottom-8 z-10 h-[3px] overflow-hidden rounded-full bg-[#F7F3EC]/25"><div ref={bar} className="h-full w-full origin-left rounded-full bg-[#C5A77B]" style={{ transform: 'scaleX(0)' }} /></div>
        <p className="absolute bottom-12 left-[var(--m)] right-[var(--m)] z-10 text-right text-[0.75rem] text-[#F7F3EC]/70">Illustrative 3D room. Poly Haven (CC0); velvet sofa by Wayfair, CC BY 4.0.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ services: an editorial index; the photo follows the cursor */
const SERVICES = [
  { t: 'Personalized Wellness', img: A('/c2/golden.jpg') },
  { t: 'Advanced Aesthetic Care', img: A('/c2/serum.jpg') },
  { t: 'Health & Wellbeing', img: A('/c2/pool.jpg') },
  { t: 'Your Wellness Journey', img: A('/c2/tubview.jpg') },
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
        <div data-reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="c2-serif text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[0.98] text-[#173B35]">Services</h2>
          <p className="max-w-[36ch] text-[#242424]/65">Placeholder service areas. The final menu is confirmed with Dr. Varney before publication.</p>
        </div>
        <ul className="sv-list mt-12" onPointerLeave={() => setHover(-1)}>
          {SERVICES.map((s, i) => (
            <li key={s.t} className="sv-row">
              <Link href={R(`/services/${SV[i].slug}`)} onPointerEnter={() => setHover(i)} className="group flex items-center justify-between gap-6 rounded-[1.5rem] px-2 py-7 transition-colors duration-500 hover:bg-[#ece5d8] md:px-6 md:py-9">
                <span className="flex items-baseline gap-6">
                  <span className={`c2-serif text-[clamp(2rem,4.6vw,4.4rem)] leading-none transition-[color,background-color,opacity,transform] duration-700 ${hover === -1 || hover === i ? 'text-[#173B35]' : 'text-[#173B35]/25'} group-hover:translate-x-4`}>{s.t}</span>
                </span>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#ece5d8] text-[#173B35] transition-[color,background-color,opacity,transform] duration-500 group-hover:rotate-45 group-hover:bg-[#173B35] group-hover:text-[#F7F3EC]"><ArrowUpRight size={18} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div ref={float} className="pointer-events-none absolute left-0 top-0 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <AnimatePresence>
          {hover > -1 && (
            <motion.div key={hover} initial={{ opacity: 0, scale: 0.85, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5, ease }} className="h-80 w-64 overflow-hidden rounded-t-full shadow-2xl">
              <img loading="lazy" decoding="async" src={SERVICES[hover].img} alt="" className="h-full w-full object-cover" />
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
      gsap.fromTo('.dr-arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 0 0)' }, { clipPath: 'inset(0% 0 0 0 round 999px 999px 0 0)', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'top 25%', scrub: 0.3 } });
      gsap.fromTo('.dr-img', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'bottom top', scrub: true } });
      gsap.from('.dr-in', { y: 40, opacity: 0, stagger: 0.12, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 60%' } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section id="doctor" ref={root} className="relative bg-[#F7F3EC] px-[var(--m)] py-28 md:py-36">
      <div className="mx-auto grid max-w-[1360px] items-center gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-24">
        <div className="relative max-md:order-2">
          <figure className="dr-arch relative m-0 aspect-[3/4] overflow-hidden rounded-t-full"><img loading="lazy" decoding="async" src={A('/images/doc.jpg')} alt="Stock portrait placeholder (not Dr. Varney)" className="dr-img h-full w-full object-cover object-[50%_20%]" /></figure>
          <p className="mt-3 text-[0.8125rem] text-[#242424]/55">Stock placeholder, not Dr. Varney</p>
        </div>
        <div>
          <h2 className="dr-in c2-serif text-[clamp(2.6rem,5.2vw,5.2rem)] leading-[0.98] text-[#173B35]">Dr. Joseph Varney, MD</h2>
          <p className="dr-in c2-serif mt-8 text-[clamp(1.4rem,2.2vw,2rem)] leading-snug text-[#242424]/85">“Introduction placeholder. A personal note from Dr. Varney on his approach to care will appear here.”</p>
          <p className="dr-in mt-6 max-w-[46ch] text-[#242424]/65">No qualifications, awards or credentials are shown until they are supplied and confirmed by the practice.</p>
          <div className="dr-in mt-10 flex flex-wrap items-center gap-6"><Link href={R('/contact')} className="inline-flex h-14 items-center rounded-full bg-[#173B35] px-8 text-[#F7F3EC] transition-colors hover:bg-[#0f2a25]">Book a Consultation</Link><Link href={R('/dr-varney')} className="text-[#173B35] underline decoration-[#C5A77B] decoration-2 underline-offset-4">Meet Dr. Varney</Link></div>
        </div>
      </div>
    </section>
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
      lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1, smoothWheel: true });
      if (window.__c2Loading) lenis.stop();
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    const rctx = reduced ? null : gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { y: 56, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: Number(el.dataset.reveal) || 0, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 1500);
    return () => { clearTimeout(t); rctx?.revert(); if (tick) gsap.ticker.remove(tick); lenis?.destroy(); window.__lenis = null; };
  }, []);
  return (
    <div className="c2 min-h-screen bg-[#F7F3EC]">
      <a href="#club" className="skip">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Experience />
        <InsideClub />
        <Services />
        <Concierge />
        <Doctor />
      </main>
      <Footer id="contact" />
      <Toast />
    </div>
  );
}
