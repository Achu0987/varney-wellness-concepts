'use client';
import { A } from '@/lib/asset';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Menu, X, Plus } from 'lucide-react';
import Planner from './Planner';

gsap.registerPlugin(ScrollTrigger);
const C3 = { lav: '#E9DFFF', pur: '#38206B', off: '#FAF9F6' };
const ease = [0.16, 1, 0.3, 1];
const LINKS = [['Care', '#care'], ['Moments', '#moments'], ['Visits', '#visits'], ['Parties', '#parties'], ['Contact', '#contact']];
const toast = (m) => window.dispatchEvent(new CustomEvent('c3-toast', { detail: m }));

function go(e, href) {
  e?.preventDefault();
  const el = document.querySelector(href);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.6, offset: href === '#top' ? 0 : -10 }); else el.scrollIntoView({ behavior: 'smooth' });
}

/* ------------------------------------------------------------------ cursor (desktop only) */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const d = dot.current; const r = ring.current;
    d.style.display = 'block'; r.style.display = 'block';
    const p = { x: -100, y: -100 }; const q = { x: -100, y: -100 };
    let big = false; let sc = 1; let raf;
    const move = (e) => { p.x = e.clientX; p.y = e.clientY; const t = e.target.closest?.('a,button,[data-cursor]'); big = !!t && !t.disabled; };
    const loop = () => {
      q.x += (p.x - q.x) * 0.2; q.y += (p.y - q.y) * 0.2; sc += ((big ? 1.9 : 1) - sc) * 0.18;
      d.style.transform = `translate3d(${p.x}px,${p.y}px,0) translate(-50%,-50%)`;
      r.style.transform = `translate3d(${q.x}px,${q.y}px,0) translate(-50%,-50%) scale(${sc})`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); };
  }, []);
  return (
    <>
      <span ref={dot} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[300] hidden h-2 w-2 rounded-full bg-cor" />
      <span ref={ring} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[300] hidden h-9 w-9 rounded-full border-2 border-cor " />
    </>
  );
}

/* ------------------------------------------------------------------ nav */
function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    if (open) window.__lenis?.stop(); else window.__lenis?.start();
    const k = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-500 ${solid ? 'bg-off py-3 shadow-[0_8px_24px_-16px_rgba(36,33,43,0.35)]' : 'py-5'}`}>
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-[var(--m)]">
          <a href="#top" onClick={(e) => go(e, '#top')} className="c3-display text-[1.5rem] text-pur" aria-label="Varney Wellness, back to top">Varney<span className="text-cor">.</span></a>
          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {LINKS.map(([l, h]) => <a key={h} href={h} onClick={(e) => go(e, h)} className="text-[1rem] font-medium text-gra underline-offset-[6px] hover:underline decoration-2 decoration-cor">{l}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <a href="#parties" onClick={(e) => go(e, '#parties')} className="hidden min-h-[44px] items-center gap-2 rounded-full bg-cor px-5 font-medium text-gra transition-transform hover:-translate-y-0.5 sm:inline-flex">Plan a party <ArrowRight size={16} /></a>
            <button type="button" onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-full bg-pur text-off lg:hidden" aria-label="Open menu" aria-expanded={open}><Menu size={20} /></button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] flex flex-col bg-pur px-[var(--m)] py-5 text-off"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }} animate={{ clipPath: 'circle(150% at 92% 4%)' }} exit={{ clipPath: 'circle(0% at 92% 4%)' }} transition={{ duration: 0.7, ease }}>
            <div className="flex items-center justify-between">
              <span className="c3-display text-[1.5rem]">Varney<span className="text-cor">.</span></span>
              <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full bg-off text-pur" aria-label="Close menu" autoFocus><X size={20} /></button>
            </div>
            <nav aria-label="Mobile" className="mt-14 flex flex-col gap-2">
              {LINKS.map(([l, h], i) => (
                <motion.a key={h} href={h} onClick={(e) => { setOpen(false); setTimeout(() => go(e, h), 350); e.preventDefault(); }} className="c3-display text-[clamp(2.6rem,12vw,4rem)]"
                  initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease }}>{l}</motion.a>
              ))}
            </nav>
            <a href="#parties" onClick={(e) => { setOpen(false); setTimeout(() => go(e, '#parties'), 350); e.preventDefault(); }} className="mt-auto inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-cor font-medium text-gra">Plan a party <ArrowRight size={16} /></a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ hero: a crowd of real faces in depth; scrolling flies the camera through them */
const FACES = [
  // [image, screen x (vw), screen y (vh), depth z (px), on-screen width (vw)] at the first frame
  ['p1', -34, -25, -200, 11], ['p2', 31, -27, -350, 10], ['w2', -31, 23, -500, 10], ['p7', 36, 25, -650, 11],
  ['p8', -7, -32, -800, 8], ['p10', 9, 28, -900, 8], ['w4', -44, 2, -1000, 9], ['p6', 44, -4, -1100, 9],
  ['p3', -17, -23, -1250, 7], ['p9', 20, 23, -1350, 7], ['w3', -31, 15, -1450, 7], ['p5', 29, -14, -1550, 6.5],
  ['w1', 2, -21, -1650, 6], ['m1', -4, 22, -1750, 6],
];
const PERSP = 1000;
const depthK = (z) => (PERSP - z) / PERSP; // world size needed to look a given size at depth z
const DEPTH = 2700; // the group photo sits this far back; the camera arrives at it at 78% of the scroll
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Hero() {
  const root = useRef(null);
  const tilt = useRef(null);
  const head = useRef(null);
  const intro = useRef(null);
  const cards = useRef([]);
  const group = useRef(null);
  const groupImg = useRef(null);
  const outro = useRef(null);
  const hint = useRef(null);

  useEffect(() => {
    const el = root.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    let vw = window.innerWidth; let vh = window.innerHeight;
    let mob = vw < 768;
    let last = -1;

    const render = (p) => {
      if (Math.abs(p - last) < 0.0004) return;
      last = p;
      const dolly = easeInOut(clamp01(p / 0.78)) * DEPTH;
      // the headline lives at z = 0, so the camera flies straight through the words
      const hz = dolly;
      head.current.style.transform = `translate3d(-50%,-50%,${hz}px)`;
      head.current.style.opacity = String(clamp01(1 - (hz - 250) / 450));
      intro.current.style.opacity = String(clamp01(1 - p / 0.06));
      intro.current.style.transform = `translate3d(0,${p * 160}px,0)`;
      if (hint.current) hint.current.style.opacity = String(clamp01(1 - p / 0.03));
      FACES.forEach(([, x, y, z, w], i) => {
        const c = cards.current[i];
        if (!c) return;
        const wz = z + dolly;
        const op = clamp01((wz + 2900) / 500) * clamp01((820 - wz) / 380);
        c.style.opacity = String(op);
        c.style.visibility = op < 0.01 ? 'hidden' : 'visible';
        const k = depthK(z);
        const yy = mob && y > 0 ? y * 0.6 : y;
        c.style.transform = `translate3d(calc(${x * k}vw - 50%), calc(${yy * k}vh - 50%), ${wz}px)`;
      });
      // the group photo arrives at z = 0, then opens to fill the whole screen
      const gz = -DEPTH + dolly;
      const open = easeInOut(clamp01((p - 0.78) / 0.14));
      const s0 = mob ? 0.8 : 0.46;
      const s = s0 + (1.02 - s0) * open;
      group.current.style.transform = `translate3d(0,0,${gz}px) scale(${s})`;
      group.current.style.opacity = String(clamp01((p - 0.22) / 0.18));
      group.current.style.borderRadius = `${(1 - open) * 18 / s}px`;
      groupImg.current.style.transform = `scale(${1.25 - 0.25 * open})`;
      outro.current.style.opacity = String(clamp01((p - 0.88) / 0.07));
      outro.current.style.transform = `translate3d(0,${(1 - clamp01((p - 0.88) / 0.07)) * 40}px,0)`;
      outro.current.style.pointerEvents = p > 0.9 ? 'auto' : 'none';
    };

    const sizeCards = () => {
      vw = window.innerWidth; vh = window.innerHeight; mob = vw < 768;
      FACES.forEach(([, , , z, w], i) => { const c = cards.current[i]; if (c) c.style.width = `${w * depthK(z) * (mob ? 1.6 : 1)}vw`; });
      last = -1;
    };
    sizeCards();
    render(0);
    window.addEventListener('resize', sizeCards);

    let st;
    if (!reduced) {
      st = ScrollTrigger.create({ trigger: el, start: 'top top', end: 'bottom bottom', onUpdate: (s) => render(s.progress), onRefresh: (s) => { last = -1; render(s.progress); } });
    }

    // the crowd leans toward the cursor: real parallax, because every face sits at its own depth
    let rx; let ry; let mv;
    if (fine && !reduced) {
      rx = gsap.quickTo(tilt.current, 'rotationX', { duration: 1.2, ease: 'power3.out' });
      ry = gsap.quickTo(tilt.current, 'rotationY', { duration: 1.2, ease: 'power3.out' });
      mv = (e) => { const nx = e.clientX / window.innerWidth - 0.5; const ny = e.clientY / window.innerHeight - 0.5; ry(nx * 9); rx(-ny * 7); };
      window.addEventListener('pointermove', mv, { passive: true });
    }
    return () => { st?.kill(); window.removeEventListener('resize', sizeCards); if (mv) window.removeEventListener('pointermove', mv); };
  }, []);

  return (
    <section id="top" ref={root} className="relative h-[460svh] bg-pur">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-off" style={{ perspective: `${PERSP}px` }}>
        <div ref={group} className="absolute inset-0 overflow-hidden opacity-0 will-change-transform" style={{ transformOrigin: '50% 50%' }}>
          <img ref={groupImg} src={A('/c3/friends.jpg')} alt="Four friends laughing together over coffee (stock photo)" decoding="async" className="h-full w-full object-cover will-change-transform" draggable="false" />
          <div className="absolute inset-0 bg-[#24212B]/45" />
        </div>
        <div ref={tilt} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {FACES.map(([img], i) => (
            <figure key={img} ref={(n) => { cards.current[i] = n; }} className="absolute left-1/2 top-1/2 m-0 overflow-hidden rounded-[14px] bg-lav-2 will-change-transform" style={{ aspectRatio: '4/5', width: '11vw' }}>
              <img src={A(`/c3/${img}.jpg`)} alt="" decoding="async" fetchPriority={i < 4 ? 'high' : 'auto'} className="h-full w-full object-cover" draggable="false" />
            </figure>
          ))}
          <h1 ref={head} className="c3-display absolute left-1/2 top-[44%] m-0 w-[min(94vw,1400px)] text-center text-[clamp(2.75rem,13vw,6rem)] text-pur will-change-transform md:text-[min(10.6vw,17svh,10rem)] lg:text-[min(9.4vw,17svh,10rem)]" style={{ transform: 'translate3d(-50%,-50%,0)' }}>
            <span className="c3-line"><span>Feel better.</span></span>
            <span className="c3-line"><span>Live differently.</span></span>
          </h1>
        </div>
        <div ref={intro} className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-[1400px] flex-col gap-5 px-[var(--m)] pb-7 md:flex-row md:items-end md:justify-between md:pb-9">
          <p className="c3-fade max-w-[30ch] text-[clamp(1.0625rem,1rem+0.5vw,1.375rem)] font-medium text-gra">Physician-led wellness and aesthetics in Florida, designed around real people.</p>
          <div className="c3-fade flex flex-wrap gap-3">
            <a href="#care" onClick={(e) => go(e, '#care')} className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-pur px-7 font-medium text-off transition-transform hover:-translate-y-0.5">Explore what's possible <ArrowRight size={18} /></a>
            <a href="#parties" onClick={(e) => go(e, '#parties')} className="inline-flex min-h-[52px] items-center rounded-full bg-cor px-6 font-medium text-gra transition-transform hover:-translate-y-0.5">Plan a party</a>
          </div>
        </div>
        <p ref={hint} className="absolute left-1/2 top-[66%] z-10 hidden -translate-x-1/2 text-[0.9375rem] text-[#5B5566] md:block" aria-hidden="true">Scroll to meet them</p>
        <div ref={outro} className="absolute inset-0 z-20 motion-reduce:hidden flex flex-col items-start justify-end px-[var(--m)] pb-[12svh] text-off opacity-0" style={{ pointerEvents: 'none' }}>
          <div className="mx-auto w-full max-w-[1400px]">
            <p className="c3-display text-[clamp(2.2rem,6.2vw,6rem)]">Designed around <span className="block text-cor">real people.</span></p>
            <a href="#care" onClick={(e) => go(e, '#care')} className="mt-8 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-cor px-7 font-medium text-gra transition-transform hover:-translate-y-0.5">See how we help <ArrowRight size={18} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ statement */
function Statement() {
  const root = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.st-w', { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.025, scrollTrigger: { trigger: '.st-p', start: 'top 80%', once: true } });
      gsap.to('.st-chip-a', { yPercent: -30, rotate: 9, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.3 } });
      gsap.to('.st-chip-b', { yPercent: 25, rotate: -10, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.3 } });
    }, root);
    return () => ctx.revert();
  }, []);
  const text = 'Every visit starts with a conversation about your life and what feeling better means to you. Then the plan is built around you.';
  return (
    <section ref={root} className="relative flex min-h-[92svh] items-center overflow-hidden bg-pur px-[var(--m)] py-24 text-lav">
      <div className="mx-auto w-full max-w-[1400px]">
        <h2 className="c3-display max-w-[14ch] text-[clamp(2.6rem,8vw,7.5rem)] text-off" data-reveal>Care starts <span className="text-cor">with you.</span></h2>
        <p className="st-p mt-10 max-w-[38ch] text-[clamp(1.25rem,1rem+1.2vw,2.1rem)] font-medium leading-[1.3] md:ml-[33%]">
          {text.split(' ').map((w, i) => <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom"><span className="st-w inline-block">{w}&nbsp;</span></span>)}
        </p>
      </div>
      <img src={A('/c3/w2.jpg')} alt="A young person laughing (stock photo)" width="1000" height="1250" loading="lazy" decoding="async" className="st-chip-a absolute right-[6%] top-[12%] hidden w-[11vw] rotate-[5deg] rounded-[14px] object-cover md:block" style={{ aspectRatio: '4/5' }} />
      <img src={A('/c3/w3.jpg')} alt="A woman laughing (stock photo)" width="1000" height="1250" loading="lazy" decoding="async" className="st-chip-b absolute bottom-[10%] left-[5%] hidden w-[9vw] -rotate-[6deg] rounded-[14px] object-cover md:block" style={{ aspectRatio: '4/5' }} />
    </section>
  );
}

/* ------------------------------------------------------------------ services: a mosaic of unlike tiles, each opens to the whole screen */
const SERVICES = {
  wellness: { t: 'Personalized Wellness', line: 'A plan shaped around how you live, sleep, move and feel.', img: A('/c3/picnic.jpg'), alt: 'Friends lying on a blanket, laughing (stock photo)', bg: 'bg-lav', ink: 'text-pur' },
  aesthetic: { t: 'Advanced Aesthetic Care', line: 'Subtle, physician-led treatments that still look like you.', img: A('/c3/w4.jpg'), alt: 'A woman with long grey hair laughing (stock photo)', bg: 'bg-cor', ink: 'text-gra' },
  health: { t: 'Health & Wellbeing', line: 'Everyday health, looked after by a doctor who knows your story.', img: A('/c3/twowomen.jpg'), alt: 'Two women laughing in a park (stock photo)', bg: 'bg-pur', ink: 'text-off' },
  parties: { t: 'Private Botox Parties', line: 'Bring your people. Plan it in two minutes.', img: A('/c3/confetti.jpg'), alt: 'Friends celebrating with confetti (stock photo)', bg: 'bg-off', ink: 'text-pur' },
};
const VISIT_STEPS = ['A relaxed first conversation', 'A medical assessment', 'A plan you agree on together', 'Follow-up whenever you need it'];

function ServiceDetail({ id, onClose }) {
  const s = SERVICES[id];
  const closeRef = useRef(null);
  useEffect(() => {
    window.__lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => { window.removeEventListener('keydown', k); window.__lenis?.start(); document.documentElement.style.overflow = ''; };
  }, [onClose]);
  return (
    <motion.div role="dialog" aria-modal="true" aria-labelledby="svc-title" layoutId={`svc-${id}`} transition={{ duration: 0.65, ease }}
      className={`fixed inset-0 z-[80] overflow-y-auto ${s.bg} ${s.ink}`} data-lenis-prevent>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.3, duration: 0.6, ease }} className="mx-auto grid min-h-full max-w-[1400px] gap-10 px-[var(--m)] pb-16 pt-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <h2 id="svc-title" className="c3-display text-[clamp(2.6rem,7vw,6.5rem)]">{s.t}</h2>
          <p className="mt-6 max-w-[40ch] text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] font-medium">{s.line}</p>
          <h3 className="mt-10 text-[1.25rem] font-bold">How a visit goes</h3>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2">
            {VISIT_STEPS.map((v, i) => (
              <li key={v} className="flex items-baseline gap-3 rounded-[14px] bg-black/[0.07] px-4 py-3.5 text-[1.0625rem]"><span className="font-bold">{i + 1}</span>{v}</li>
            ))}
          </ol>
          <p className="mt-6 max-w-[56ch] text-[1rem]">Placeholder content. Treatments, suitability and details are confirmed with Dr. Varney before publication, and every treatment depends on a medical assessment.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => { onClose(); setTimeout(() => go(null, id === 'parties' ? '#parties' : '#contact'), 500); }} className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-gra px-7 font-medium text-off">{id === 'parties' ? 'Plan a party' : 'Book a consultation'} <ArrowRight size={18} /></button>
          </div>
        </div>
        <img src={s.img} alt={s.alt} className="aspect-[4/5] w-full rounded-[200px] object-cover lg:max-h-[78svh]" />
      </motion.div>
      <button ref={closeRef} type="button" onClick={onClose} className="fixed right-[var(--m)] top-5 z-10 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-gra px-5 text-off" aria-label={`Close ${s.t}`}><X size={18} /> Close</button>
    </motion.div>
  );
}

function Tile({ id, className, children, onOpen }) {
  return (
    <motion.button type="button" layoutId={`svc-${id}`} onClick={() => onOpen(id)} data-tile
      className={`group relative overflow-hidden rounded-[14px] p-6 text-left transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(56,32,107,0.6)] ${className}`}>
      {children}
      <span className="absolute bottom-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-gra text-off transition-transform duration-500 group-hover:rotate-90"><Plus size={20} /></span>
    </motion.button>
  );
}

function Services() {
  const [open, setOpen] = useState(null);
  const root = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-tile],.sv-static', { y: 70, opacity: 0, rotate: (i) => (i % 2 ? 2 : -2) }, { y: 0, opacity: 1, rotate: 0, duration: 1, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: '.sv-grid', start: 'top 82%', once: true } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section id="care" ref={root} className="bg-lav px-[var(--m)] py-24 text-pur md:py-32">
      <div className="sv-grid mx-auto grid max-w-[1400px] grid-cols-2 gap-2 md:grid-cols-12 md:grid-rows-[repeat(8,96px)]">
        <div className="sv-static col-span-2 flex flex-col justify-between rounded-[14px] bg-lav-2 p-6 md:col-span-6 md:row-span-3">
          <h2 className="c3-display text-[clamp(2.6rem,5.4vw,5rem)]">Ways we <br />can help</h2>
          <p className="mt-4 max-w-[36ch] text-[1rem] text-gra">Placeholder service areas. Tap any tile to see how it works. The final menu is confirmed with Dr. Varney.</p>
        </div>
        <Tile id="wellness" onOpen={setOpen} className="col-span-2 min-h-[360px] bg-pur p-0 md:col-span-6 md:row-span-5 md:min-h-0">
          <img src={SERVICES.wellness.img} alt={SERVICES.wellness.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          <span className="absolute left-5 top-5 rounded-full bg-off px-4 py-2 text-[1.0625rem] font-medium text-pur">Personalized Wellness</span>
        </Tile>
        <Tile id="aesthetic" onOpen={setOpen} className="col-span-2 min-h-[200px] bg-cor text-gra md:col-span-3 md:row-span-2 md:min-h-0">
          <span className="block text-[1.5rem] font-bold leading-tight">Advanced Aesthetic Care</span>
          <span className="mt-2 block max-w-[22ch] text-[1rem]">Results that still look like you.</span>
        </Tile>
        <Tile id="health" onOpen={setOpen} className="col-span-2 min-h-[200px] bg-pur text-off md:col-span-3 md:row-span-2 md:min-h-0">
          <span className="block text-[1.5rem] font-bold leading-tight">Health & Wellbeing</span>
          <span className="mt-2 block max-w-[22ch] text-[1rem] text-lav">A doctor who knows your story.</span>
        </Tile>
        <div className="sv-static col-span-1 rounded-[14px] bg-off p-6 text-gra md:col-span-3 md:row-span-3">
          <h3 className="text-[1.125rem] font-bold text-pur">Every first visit</h3>
          <ul className="mt-3 space-y-1.5 text-[1rem]">
            {VISIT_STEPS.map((v) => <li key={v}>{v}</li>)}
          </ul>
        </div>
        <Tile id="parties" onOpen={setOpen} className="col-span-2 min-h-[300px] p-0 md:col-span-6 md:row-span-3 md:min-h-0">
          <img src={SERVICES.parties.img} alt={SERVICES.parties.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          <span className="absolute left-5 top-5 rounded-full bg-cor px-4 py-2 text-[1.0625rem] font-medium text-gra">Private Botox Parties</span>
        </Tile>
        <div className="sv-static col-span-1 flex items-end rounded-[14px] bg-pur-3 p-6 text-off md:col-span-3 md:row-span-3">
          <p className="text-[clamp(1.375rem,1.1rem+1vw,2rem)] font-bold leading-[1.1]">You lead. <br />We guide.</p>
        </div>
      </div>
      <AnimatePresence>{open && <ServiceDetail id={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ moments: object on a disc */
const MOMENTS = [
  { t: 'A milestone birthday', img: A('/c3/glitter.jpg'), alt: 'Two friends laughing under falling glitter at a birthday (stock photo)', fact: 'Celebrate the year with the people who made it.', disc: C3.pur },
  { t: 'Before the big day', img: A('/c3/beach.jpg'), alt: 'Two friends hugging on a beach (stock photo)', fact: 'Feel like yourself in every photo.', disc: C3.lav },
  { t: 'A night with friends', img: A('/c3/table.jpg'), alt: 'Friends laughing together at a table (stock photo)', fact: 'Wellness is better shared.', disc: C3.off },
  { t: 'Feeling like you again', img: A('/c3/w1.jpg'), alt: 'Close-up of a woman smiling (stock photo)', fact: 'Small changes, made with care.', disc: C3.pur },
  { t: 'Just because', img: A('/c3/m1.jpg'), alt: 'A man smiling outdoors (stock photo)', fact: 'No occasion needed.', disc: C3.lav },
];
function Moments() {
  const [i, setI] = useState(0);
  const root = useRef(null);
  const bar = useRef(null);
  const m = MOMENTS[i];
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      let cur = 0;
      const st = ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: 'bottom bottom',
        onUpdate: (t) => {
          const k = Math.min(MOMENTS.length - 1, Math.floor(t.progress * MOMENTS.length));
          if (k !== cur) { cur = k; setI(k); }
          if (bar.current) bar.current.style.transform = `scaleY(${t.progress})`;
        },
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, []);
  const pick = (k) => {
    const el = root.current;
    if (window.innerWidth >= 1024 && window.__lenis && el) {
      const y = el.offsetTop + ((el.offsetHeight - window.innerHeight) * (k + 0.5)) / MOMENTS.length;
      window.__lenis.scrollTo(y, { duration: 1 });
    } else setI(k);
  };
  return (
    <section id="moments" ref={root} className="relative bg-cor text-gra lg:h-[360svh]">
      <div className="overflow-hidden px-[var(--m)] py-24 md:py-28 lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:items-center lg:py-0">
      <span className="absolute left-[calc(var(--m)/2)] top-1/2 hidden h-[40svh] w-1 -translate-y-1/2 overflow-hidden rounded-full bg-[#E5674F] lg:block" aria-hidden="true"><span ref={bar} className="block h-full w-full origin-top rounded-full bg-gra" style={{ transform: 'scaleY(0)' }} /></span>
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="order-2 lg:order-1">
          <h2 className="c3-display text-[clamp(2.4rem,4.6vw,4.4rem)]" data-reveal>Made for <br />real moments</h2>
          <div className="-mx-[var(--m)] mt-8 flex gap-6 overflow-x-auto px-[var(--m)] pb-2 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0" role="tablist" aria-label="Moments">
            {MOMENTS.map((x, k) => (
              <button key={x.t} type="button" role="tab" aria-selected={i === k} onClick={() => pick(k)}
                className={`flex shrink-0 items-center gap-3 whitespace-nowrap text-left text-[clamp(1.5rem,2.6vw,2.6rem)] font-bold leading-[1.15] transition-colors duration-300 ${i === k ? 'text-gra' : 'text-[#7A2E22] hover:text-gra'}`}>
                <span className={`hidden h-3 rounded-full bg-gra transition-[width] duration-500 lg:inline-block ${i === k ? 'w-10' : 'w-0'}`} aria-hidden="true" />
                {x.t}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="mt-8 max-w-[32ch] text-[1.125rem] font-medium" role="tabpanel">{m.fact}</motion.p>
          </AnimatePresence>
        </div>
        <div className="relative order-1 mx-auto aspect-square w-[min(86vw,64vh,640px)] lg:order-2">
          <motion.div className="absolute inset-0 rounded-full" initial={false} style={{ backgroundColor: MOMENTS[0].disc }} animate={{ backgroundColor: m.disc }} transition={{ duration: 0.6 }} />
          <div className="absolute inset-x-[22%] bottom-[8%] top-[-6%] overflow-hidden rounded-full">
            <AnimatePresence initial={false}>
              <motion.img key={m.img} src={m.img} alt={m.alt} decoding="async" className="absolute inset-0 h-full w-full object-cover"
                initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.15 }} animate={{ clipPath: 'inset(0% 0 0 0)', scale: 1 }} exit={{ opacity: 0, transition: { delay: 0.5, duration: 0.2 } }} transition={{ duration: 0.75, ease }} />
            </AnimatePresence>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ visits: accordion of tinted panels */
const VISITS = [
  { t: 'Talk', c: 'bg-pur text-off', p: 'Start with a relaxed conversation about what you want to change and why it matters to you.', img: A('/c3/doorway.jpg'), alt: 'A guest being welcomed at a door (stock photo)' },
  { t: 'Assess', c: 'bg-pur-2 text-off', p: 'A medical assessment, so every recommendation is safe and suitable for you.' },
  { t: 'Plan', c: 'bg-pur-3 text-off', p: 'Options explained plainly, including doing nothing. You decide, with no pressure.' },
  { t: 'Care', c: 'bg-lav-3 text-gra', p: 'Treatment or support delivered by the physician-led team, at a pace that suits you.' },
  { t: 'Check in', c: 'bg-lav-2 text-gra', p: 'Follow-up whenever you need it, so the plan keeps fitting your life.' },
];
function Visits() {
  const [open, setOpen] = useState(0);
  return (
    <section id="visits" className="bg-off px-[var(--m)] py-24 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-6 md:grid-cols-12">
          <h2 className="c3-display text-[clamp(2.4rem,4.6vw,4.4rem)] text-pur md:col-span-6" data-reveal>How a visit <br />works</h2>
          <p className="max-w-[40ch] text-[1.125rem] md:col-span-5 md:col-start-8 md:self-end" data-reveal="0.1">Five simple stages, the same whether you come for one treatment or a long-term plan. Illustrative; the practice confirms its own process.</p>
        </div>
        <div className="mt-14 flex flex-col gap-2 md:h-[520px] md:flex-row md:gap-0 md:overflow-hidden md:rounded-[14px]" data-reveal="0.15">
          {VISITS.map((v, i) => {
            const on = open === i;
            return (
              <div key={v.t} className={`relative overflow-hidden rounded-[14px] md:rounded-none ${v.c} max-md:!flex-none transition-[flex-grow] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]`} style={{ flexGrow: on ? 7 : 1, flexBasis: 0 }}>
                <button type="button" onClick={() => setOpen(i)} aria-expanded={on} className="flex h-16 w-full items-center gap-3 px-5 text-left md:absolute md:inset-0 md:h-full md:items-end md:p-6">
                  <span className={`text-[1.125rem] font-bold md:text-[1.25rem] ${on ? 'md:hidden' : 'md:[writing-mode:vertical-rl] md:rotate-180'}`}>{v.t}</span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 md:absolute md:inset-0 md:block ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] md:hidden'}`}>
                  <div className="overflow-hidden">
                    <div className="flex h-full gap-8 px-5 pb-6 md:p-8">
                      <div className="flex flex-1 flex-col justify-between">
                        <h3 className="c3-display hidden text-[2.6rem] md:block">{v.t}</h3>
                        <p className="max-w-[36ch] text-[1.0625rem] md:text-[1.125rem]">{v.p}</p>
                      </div>
                      {v.img && <img src={v.img} alt={v.alt} loading="lazy" decoding="async" className="hidden h-full w-[46%] rounded-[10px] object-cover md:block" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ doctor */
function Doctor() {
  return (
    <section id="doctor" className="bg-off px-[10px] pb-24 pt-[10px] md:px-5 md:pb-32 md:pt-5">
      <div className="relative mx-auto grid max-w-[1440px] overflow-hidden rounded-[20px] bg-pur text-lav lg:min-h-[100svh] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="relative flex flex-col p-7 pb-0 md:p-14 md:pb-0">
          <h2 className="c3-display text-[clamp(2.4rem,4.4vw,4.4rem)] text-off" data-reveal>Meet Dr. <br />Joseph Varney</h2>
          <div className="relative mx-auto mt-10 w-[min(86%,460px)] lg:mx-0 lg:mt-auto">
            <img src={A('/c3/m2.jpg')} alt="Stock portrait placeholder (not Dr. Varney)" loading="lazy" decoding="async" className="block aspect-[3/4] w-full rounded-t-full object-cover object-[50%_20%]" />
            <span className="absolute bottom-4 left-4 rounded-full bg-off px-3 py-1.5 text-[0.8125rem] text-gra">Stock placeholder, not Dr. Varney</span>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-10 p-7 md:p-14">
          <div data-reveal>
            <h3 className="text-[1.375rem] font-bold text-off">A physician who listens first</h3>
            <p className="mt-3 max-w-[42ch] text-[1.0625rem] leading-relaxed">Introduction placeholder. A short note from Dr. Varney on why he started Varney Wellness and how he likes to care for people will appear here.</p>
          </div>
          <div data-reveal="0.1">
            <h3 className="text-[1.375rem] font-bold text-off">Training and credentials</h3>
            <p className="mt-3 max-w-[42ch] text-[1.0625rem] leading-relaxed">Credentials placeholder. Qualifications, board certifications and affiliations are added once confirmed by the practice.</p>
          </div>
          <a href="#contact" onClick={(e) => go(e, '#contact')} className="inline-flex min-h-[52px] w-fit items-center gap-2 rounded-full bg-cor px-7 font-medium text-gra transition-transform hover:-translate-y-0.5" data-reveal="0.2">Book a consultation <ArrowRight size={18} /></a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ contact */
const STRIP = ['friends', 'glitter', 'w4', 'rooftop', 'beach', 'm3', 'laugh4', 'twowomen', 'w2', 'confetti', 'doorway', 'w1'];
function Contact() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!String(f.get('name')).trim()) { setErr('Please add your name.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(String(f.get('email')))) { setErr('Please add an email we can reply to.'); return; }
    setErr(''); setSent(true); toast('Demo only: nothing was sent.');
  };
  const ratios = ['3/4', '1/1', '3/2'];
  return (
    <section id="contact" className="overflow-hidden bg-lav pb-24 pt-12 text-pur md:pb-32">
      <div className="flex w-max gap-2 c3-marquee" aria-hidden="true">
        {[...STRIP, ...STRIP].map((s, i) => (
          <img key={i} src={A(`/c3/${s}.jpg`)} alt="" loading="lazy" decoding="async" className="h-[110px] rounded-[10px] object-cover md:h-[150px]" style={{ aspectRatio: ratios[i % 3] }} />
        ))}
      </div>
      <div className="mx-auto max-w-[1400px] px-[var(--m)]">
        <div className="mt-16 flex flex-col gap-6 md:mt-20 lg:flex-row lg:items-end lg:justify-between"><h2 className="c3-display text-[clamp(2.4rem,6vw,5.4rem)]" data-reveal>Start with <br />a conversation</h2><p className="max-w-[30ch] text-[1.125rem] text-gra lg:text-right" data-reveal="0.1">Prefer to talk? Phone placeholder. The practice confirms its contact details before launch.</p></div>
        {!sent ? (
          <form onSubmit={submit} noValidate className="mt-10 grid gap-2 md:grid-cols-3" data-reveal="0.1">
            <label htmlFor="c3-name" className="sr-only">Your name</label>
            <input id="c3-name" name="name" autoComplete="name" placeholder="Your name" className="h-[60px] rounded-[14px] bg-lav-2 px-6 text-[1.125rem] text-gra placeholder:text-[#5B5566] transition-colors focus:bg-off focus:outline-none md:h-[96px] md:text-center" />
            <label htmlFor="c3-email" className="sr-only">Your email</label>
            <input id="c3-email" name="email" type="email" autoComplete="email" placeholder="Your email" className="h-[60px] rounded-[14px] bg-lav-2 px-6 text-[1.125rem] text-gra placeholder:text-[#5B5566] transition-colors focus:bg-off focus:outline-none md:h-[96px] md:text-center" />
            <button type="submit" className="h-[60px] rounded-[14px] bg-pur text-[1.125rem] font-medium text-off transition-colors hover:bg-pur-2 md:h-[96px]">Request a consultation</button>
            <p className="text-[0.875rem] text-gra md:col-span-2" role={err ? 'alert' : undefined}>{err || 'Demo form: nothing is sent from this preview. No medical details, please.'}</p>
          </form>
        ) : (
          <p className="mt-10 rounded-[14px] bg-off px-6 py-8 text-[1.25rem] font-medium" role="status">Thanks. In the finished site the practice would reply within their stated hours. This preview sent nothing.</p>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ footer: contact as the headline */
function Footer() {
  return (
    <footer className="flex min-h-[78svh] flex-col bg-cor px-[var(--m)] pb-8 pt-10 text-gra">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 md:flex-row md:justify-between">
        <div className="grid gap-4 text-[0.9375rem] sm:grid-cols-3 md:gap-10">
          <p><span className="c3-display block text-[1.25rem] text-gra">Varney<span className="text-pur">.</span></span>Physician-led wellness</p>
          <p>Address placeholder<br />Florida, USA</p>
          <p>Hours placeholder<br />By appointment</p>
        </div>
        <a href="#top" onClick={(e) => go(e, '#top')} className="h-fit text-[0.9375rem] text-gra underline decoration-pur decoration-2 underline-offset-4">Back to top</a>
      </div>
      <div className="mx-auto mt-auto w-full max-w-[1400px] pt-24">
        <a href="#contact" onClick={(e) => go(e, '#contact')} className="c3-display group block text-[clamp(3rem,10.5vw,10rem)] text-gra">
          Say hello<span className="text-off transition-colors group-hover:text-pur">.</span>
          <ArrowUpRight className="ml-2 inline-block h-[0.6em] w-[0.6em] text-pur transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2" strokeWidth={2.5} aria-hidden="true" />
        </a>
        <div className="mt-8 grid gap-2 text-[0.875rem] md:grid-cols-3">
          <p>Concept 03 of 03, illustrative preview. Copy and services need approval.</p>
          <p className="md:text-center">Photos: Unsplash (stock placeholders).</p>
          <p className="md:text-right">Florida, 2026</p>
        </div>
      </div>
    </footer>
  );
}

function Toast() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    let t;
    const on = (e) => { setMsg(e.detail); clearTimeout(t); t = setTimeout(() => setMsg(null), 3600); };
    window.addEventListener('c3-toast', on);
    return () => { window.removeEventListener('c3-toast', on); clearTimeout(t); };
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>{msg && <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="rounded-full bg-gra px-6 py-3 text-[1rem] text-off">{msg}</motion.p>}</AnimatePresence>
    </div>
  );
}

export default function Concept3({ fontClass = '' }) {
  useEffect(() => {
    document.documentElement.style.background = '#FAF9F6';
    document.body.style.background = '#FAF9F6';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis; let tick;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.13, wheelMultiplier: 1, smoothWheel: true });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    const rctx = reduced ? null : gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: Number(el.dataset.reveal) || 0, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 1500);
    return () => { clearTimeout(t); rctx?.revert(); if (tick) gsap.ticker.remove(tick); lenis?.destroy(); window.__lenis = null; };
  }, []);
  return (
    <div className={`c3 ${fontClass}`}>
      <a href="#care" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-off focus:px-4 focus:py-2">Skip to content</a>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Services />
        <Moments />
        <Visits />
        <Planner />
        <Doctor />
        <Contact />
      </main>
      <Footer />
      <Toast />
    </div>
  );
}
