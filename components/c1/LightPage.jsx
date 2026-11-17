'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight, ArrowRight, ArrowDown, Stethoscope, HeartPulse, PartyPopper, Menu, X, Check,
  Cake, Gem, Users, Flower2, Building2, Home, MapPin, MessageCircle, ClipboardList, CalendarCheck,
} from 'lucide-react';
import { S } from '@/lib/c1/state';
import Loader from './Loader';
import * as Sec from './Sections';
import PartyInvite from './PartyInvite';
import Treatment from './Treatment';
import FloatDock from './FloatDock';

gsap.registerPlugin(ScrollTrigger);
const HoloCanvas = dynamic(() => import('./HoloCanvas'), { ssr: false });
const CellCanvas = dynamic(() => import('./CellCanvas'), { ssr: false });

const CHIPS = [
  { t: 'Physician-led care', d: 'Guided by Dr. Varney, with time to listen.' },
  { t: 'Personal care plans', d: 'Built around your goals and your pace.' },
  { t: 'Aesthetic care', d: 'Consultation first, always medically overseen.' },
  { t: 'Private Botox Parties', d: 'Plan a gathering for your people.' },
  { t: 'Connected follow-up', d: 'Check-ins that keep everything on track.' },
];

const ease = [0.22, 1, 0.36, 1];
const LINKS = [['About', '#about'], ['How it works', '#how'], ['Services', '#services'], ['Botox Parties', '#party'], ['Contact', '#contact']];

function go(e, href) {
  e?.preventDefault();
  const el = document.querySelector(href);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.6, offset: -10 });
  else el.scrollIntoView({ behavior: 'smooth' });
}
function toast(msg) { window.dispatchEvent(new CustomEvent('vw-toast', { detail: msg })); }

/* ------------------------------------------------------------------ small parts */
function Pill({ href = '#contact', children, ghost = false, onClick }) {
  const cls = ghost
    ? 'bg-white/[0.07] text-white ring-1 ring-white/25 hover:bg-white/15'
    : 'bg-white text-navy shadow-[0_10px_30px_-12px_rgba(8,14,32,0.35)]';
  return (
    <a href={href} onClick={onClick || ((e) => go(e, href))} className={`group inline-flex h-12 items-center gap-3 rounded-full pl-1.5 pr-5 text-[0.95rem] font-semibold transition-[color,background-color,opacity,transform] duration-300 ${cls}`}>
      <span className={`grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${ghost ? 'bg-white text-violet' : 'bg-violet text-white'}`}><ArrowUpRight size={17} /></span>
      {children}
    </a>
  );
}

function Label({ children }) {
  return (
    <p className="inline-flex items-center gap-2">
      <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-[0.85rem] font-medium text-white ring-1 ring-white/10">
        <span className="h-2 w-2 rounded-full bg-violet" />{children}
      </span>
      <span className="grid h-7 w-7 place-items-center rounded-full bg-white/[0.06] text-[0.8rem] text-white ring-1 ring-white/10">»</span>
    </p>
  );
}

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.9, ease, delay }}>
      {children}
    </motion.div>
  );
}

function Toast() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    let t;
    const on = (e) => { setMsg(e.detail); clearTimeout(t); t = setTimeout(() => setMsg(''), 3600); };
    window.addEventListener('vw-toast', on);
    return () => window.removeEventListener('vw-toast', on);
  }, []);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
      <AnimatePresence>
        {msg && (
          <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="rounded-full bg-violet px-6 py-3 text-[0.95rem] font-medium text-white shadow-xl">
            {msg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ HUD panels around the hologram */
function Hud({ className, title, kind }) {
  return (
    <div className={`absolute z-20 hidden w-[12.5rem] rounded-xl bg-navy p-3 text-white ring-1 ring-ice/25 xl:block ${className}`}>
      <p className="text-[0.72rem] font-semibold text-ice">{title}</p>
      <svg viewBox="0 0 180 44" className="mt-2 h-11 w-full" aria-hidden="true">
        {kind === 'pulse' && <path className="hud-line" d="M0 26 H40 L48 10 L56 38 L64 18 L70 26 H110 L118 6 L126 40 L134 26 H180" fill="none" stroke="#A7ECCD" strokeWidth="1.8" />}
        {kind === 'bars' && [8, 18, 12, 26, 20, 32, 24, 36, 28].map((h, i) => <rect key={i} x={i * 20 + 2} y={44 - h} width="12" height={h} rx="2" fill={i === 7 ? '#A7ECCD' : 'rgba(167,236,205,0.35)'} />)}
        {kind === 'ring' && (<><circle cx="22" cy="22" r="17" fill="none" stroke="rgba(167,236,205,0.25)" strokeWidth="4" /><circle className="hud-ring" cx="22" cy="22" r="17" fill="none" stroke="#A7ECCD" strokeWidth="4" strokeDasharray="107" strokeDashoffset="30" transform="rotate(-90 22 22)" /><rect x="52" y="12" width="120" height="5" rx="2" fill="rgba(167,236,205,0.5)" /><rect x="52" y="24" width="90" height="5" rx="2" fill="rgba(167,236,205,0.3)" /></>)}
        {kind === 'wave' && <path className="hud-line" d="M0 22 C 20 2, 40 42, 60 22 S 100 2, 120 22 S 160 42, 180 22" fill="none" stroke="#A7ECCD" strokeWidth="1.8" />}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ header
   Lives outside the hero: the hero is pinned (transformed) while it plays, and a fixed
   element inside a transformed parent would scroll away with it. */
function SiteHeader({ brandOn }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`fixed inset-x-2.5 top-2.5 z-[60] flex items-center justify-between px-5 py-5 transition-[background-color,box-shadow] duration-500 md:inset-x-4 md:top-4 md:px-10 ${scrolled ? 'on-light rounded-full bg-paper py-2.5 shadow-[0_18px_40px_-24px_rgb(var(--c-ink)/0.45)] ring-1 ring-white/10 md:py-3' : 'on-color md:py-7'}`}>
      <a href="#top" data-brand onClick={(e) => go(e, '#top')} style={{ opacity: brandOn ? 1 : 0 }} className="h-gs text-[1.3rem] text-white md:text-[1.5rem]">Varney <span className="text-ice">Wellness</span></a>
      <nav aria-label="Primary" className="hidden lg:block">
        <ul className="flex items-center gap-1 rounded-full bg-white/[0.06] p-1.5 ring-1 ring-white/10">
          {LINKS.map(([l, h]) => (
            <li key={h}><a href={h} onClick={(e) => go(e, h)} className="block rounded-full px-4 py-2 text-[0.95rem] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">{l}</a></li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center gap-2">
        <span className="hidden sm:block"><Pill>Book Consultation</Pill></span>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} className="grid h-12 w-12 place-items-center rounded-full bg-white text-navy lg:hidden">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="on-light absolute inset-x-0 top-[calc(100%+0.5rem)] z-40 grid gap-1 rounded-3xl bg-paper p-3 text-white shadow-2xl ring-1 ring-white/10 lg:hidden">
            {LINKS.map(([l, h]) => <li key={h}><a href={h} onClick={(e) => { setOpen(false); go(e, h); }} className="block rounded-2xl px-4 py-3 text-[1.05rem] font-medium hover:bg-navy-3">{l}</a></li>)}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------------------------------------------ hero */
function Hero({ ready }) {
  const heroRef = useRef(null);
  // scroll story: the clear doctor photo first, then the hologram and its panels take over
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      const build = (st) => gsap.timeline({ scrollTrigger: st })
        .fromTo('.hero-clear', { opacity: 1 }, { opacity: 0, ease: 'none' }, 0)
        .fromTo('.hero-scrim', { opacity: 1 }, { opacity: 0, ease: 'none' }, 0)
        .fromTo('.hero-holo', { opacity: 0, yPercent: 22, scale: 0.88 }, { opacity: 1, yPercent: 0, scale: 1, ease: 'power2.out' }, 0.1)
        .fromTo('.hero-hud', { opacity: 0, y: 40, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, stagger: 0.08, ease: 'power2.out' }, 0.45)
        .fromTo('.hero-cap', { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.7);
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => { build({ trigger: heroRef.current, start: 'top top', end: '+=110%', scrub: 0.7, pin: true }); });
      mm.add('(max-width: 767px)', () => { build({ trigger: heroRef.current, start: 'top top', end: 'bottom 35%', scrub: 0.7 }); });
    }, heroRef);
    return () => ctx.revert();
  }, []);
  return (
    <section id="top" ref={heroRef} className="p-2.5 md:p-4">
      <div className="relative flex min-h-[min(calc(100svh-2rem),900px)] flex-col overflow-hidden rounded-[1.75rem] bg-violet-deep md:rounded-[2.25rem]">
        {/* real doctor photo behind the hologram (stock placeholder) */}
        <img src="/images/doc.jpg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover object-[50%_30%] opacity-[0.18] blur-[2px] mix-blend-luminosity" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-navy/30" />
        {/* the same photo, clear and in colour, on arrival */}
        <img src="/images/doc.jpg" alt="" aria-hidden="true" className="hero-clear pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
        <div aria-hidden="true" className="hero-scrim pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/10 to-navy/85" />
        {/* nav: fixed to the viewport; over the hero it sits in the green, once scrolled it becomes a white bar */}
        <div aria-hidden="true" className="h-[88px] shrink-0 md:h-[104px]" />

        {/* giant headline behind the person */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 1.2, ease, delay: 0.2 }}
          className="h-gs relative z-10 mt-2 text-center text-[19vw] leading-[0.88] text-white md:absolute md:inset-x-0 md:top-[13%] md:mt-0 md:whitespace-nowrap md:text-[10.2vw]"
        >
          Personal <br className="md:hidden" />Wellness
        </motion.h1>

        {/* the real human, in front of the headline */}
        <div className="relative z-20 mx-auto -mt-2 h-[46svh] w-full max-w-[560px] md:absolute md:bottom-0 md:left-1/2 md:top-[19%] md:mt-0 md:h-auto md:w-[72vw] md:max-w-none md:-translate-x-1/2">
          <motion.div initial={{ opacity: 0, y: 60 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 1.4, ease, delay: 0.35 }} className="h-full w-full">
            <div className="hero-holo h-full w-full"><HoloCanvas className="h-full w-full" xray={0} cam={[0, 0.55, 9.1]} look={0.72} /></div>
          </motion.div>
        </div>

        <Hud className="hero-hud left-[30%] top-[35%]" title="Your care plan" kind="bars" />
        <Hud className="hero-hud left-[33%] top-[68%]" title="Check-ins" kind="pulse" />
        <Hud className="hero-hud right-[24%] top-[32%]" title="Wellbeing overview" kind="ring" />
        <Hud className="hero-hud right-[22%] top-[61%]" title="Follow-up" kind="wave" />
        <p className="hero-cap absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 text-[0.75rem] text-white/70 md:block">Background photo: stock placeholder. Panels are illustrative, not patient data.</p>
        {/* left copy */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 1, ease, delay: 0.8 }} className="relative z-30 px-5 pb-6 md:absolute md:left-10 md:top-[48%] md:max-w-[24rem] md:rounded-3xl md:bg-navy md:p-5 md:ring-1 md:ring-white/10">
          <div className="flex gap-4">
            <ArrowRight className="mt-1 hidden shrink-0 text-ice md:block" size={22} />
            <p className="text-[1.05rem] leading-relaxed text-white/75">
              The future of wellness is personal. A more connected approach to care, designed around you and led by a physician.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Pill href="#how">Explore Our Approach</Pill>
            <Pill ghost href="#contact">Book a Consultation</Pill>
          </div>
        </motion.div>

        

        {/* doctor chip */}
        <motion.div initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} transition={{ delay: 1.2, duration: 1 }} className="relative z-30 mx-5 mb-5 flex items-center gap-3 self-start rounded-full bg-navy py-2 pl-2 pr-5 ring-1 ring-white/10 md:absolute md:bottom-8 md:left-10 md:m-0">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-violet text-[0.85rem] font-bold text-white">JV</span>
          <span className="text-[0.9rem] leading-tight text-white"><b>Led by Dr. Joseph Varney, MD</b><br /><span className="text-white/60">Florida, USA</span></span>
        </motion.div>

        <a href="#about" onClick={(e) => go(e, '#about')} className="absolute bottom-8 right-10 z-30 hidden items-center gap-2 text-[0.9rem] font-medium text-white md:flex">
          Scroll to see how it works <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-navy"><ArrowDown size={16} /></span>
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ why */
function Why() {
  return (
    <section id="about" className="px-[var(--m)] py-24 md:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
        <Reveal>
          <Label>Why Varney Wellness</Label>
          <ul className="mt-10 grid gap-3">
            {['One physician, one plan', 'Clear, plain-language guidance', 'Private events on request'].map((t) => (
              <li key={t} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-5 py-4 font-medium ring-1 ring-white/10"><Check size={18} className="text-ice" />{t}</li>
            ))}
          </ul>
        </Reveal>
        <div>
          <Reveal>
            <p className="h-gs text-[clamp(1.6rem,2.6vw,2.45rem)] font-medium leading-[1.25] text-white/40">
              We combine <span className="text-white">physician-led care</span>, thoughtful technology and a <span className="text-white">plan built around you</span> to make wellness feel clear, calm and <span className="text-white">personal</span>.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[[Stethoscope, 'Physician-led', 'Care guided by Dr. Varney, with time to listen and explain.'], [HeartPulse, 'Personal plans', 'Every plan starts with your goals, history and pace.']].map(([Icon, t, b], i) => (
              <Reveal key={t} delay={i * 0.1}>
                <div className="flex h-full min-h-[15rem] flex-col justify-between rounded-[1.6rem] bg-white/[0.04] p-6 ring-1 ring-white/10 transition-transform duration-500 hover:-translate-y-1.5">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet/20 text-ice"><Icon size={22} /></span>
                  <div><h3 className="h-gs text-[1.35rem]">{t}</h3><p className="mt-2 text-white/65">{b}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-[0.85rem] text-white/45">Illustrative copy, pending the practice’s approval.</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ how it works */
function How() {
  const steps = [
    [MessageCircle, 'Meet your doctor', 'One unhurried conversation about your goals, your history and your pace.'],
    [ClipboardList, 'Get your plan', 'A clear, personal care plan, explained in plain language.'],
    [CalendarCheck, 'Follow through', 'Check-ins and updates that keep everything connected over time.'],
  ];
  return (
    <section id="how" className="bg-navy-2 px-[var(--m)] py-24 md:py-32">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal><Label>How it works</Label></Reveal>
          <Reveal><h2 className="h-gs max-w-[16ch] text-right text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.05] max-md:text-left">Quality care in three simple steps</h2></Reveal>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-[1fr_1.3fr]">
          <Reveal className="relative min-h-[22rem] overflow-hidden rounded-[1.8rem]">
            <img src="/images/band.jpg" alt="Bright, calm clinic interior with plants (stock photo placeholder)" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy/65" />
            <p className="absolute bottom-5 left-5 rounded-full bg-white/85 px-4 py-2 text-[0.85rem] font-medium text-navy">Stock photo placeholder</p>
          </Reveal>
          <ol className="grid gap-4">
            {steps.map(([Icon, t, b], i) => (
              <Reveal key={t} delay={i * 0.1}>
                <li className={`flex items-start justify-between gap-6 rounded-[1.6rem] p-6 transition-[color,background-color,opacity,transform] duration-500 ${i === 1 ? 'bg-violet text-white md:-translate-x-8' : 'bg-white/[0.04] ring-1 ring-white/10'}`}>
                  <div className="flex gap-4">
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${i === 1 ? 'bg-white text-violet' : 'bg-violet/20 text-ice'}`}><Icon size={22} /></span>
                    <div><h3 className="h-gs text-[1.3rem]">{t}</h3><p className={`mt-1.5 ${i === 1 ? 'text-white/75' : 'text-white/65'}`}>{b}</p></div>
                  </div>
                  <span className="h-gs text-[2rem] opacity-80">0{i + 1}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ the 3D story */
const LAYERS = [
  ['Surface', 'See the whole person', 'Care starts with you: your goals, history and how you feel today.'],
  ['Structure', 'Look beneath the surface', 'We look at how things connect before suggesting any plan.'],
  ['Core', 'A plan that fits', 'What matters most to you shapes every step that follows.'],
];
function Story() {
  const root = useRef(null);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        S.xray = Math.min(1, Math.max(0, (p - 0.15) / 0.45));
        S.rot = -p * 1.1;
        setIdx(Math.min(2, Math.floor(p * 3)));
      },
    });
    return () => { st.kill(); S.xray = 0; S.rot = 0; };
  }, []);
  return (
    <section id="story" ref={root} className="relative h-[300vh] px-[var(--m)]">
      <div className="sticky top-0 grid h-[100svh] items-center gap-6 md:grid-cols-[1fr_1.15fr]">
        <div className="relative z-10 max-md:order-2 max-md:pb-10">
          <Label>A closer look</Label>
          <h2 className="h-gs mt-6 text-[clamp(2rem,4.2vw,4rem)] leading-[1.02]">Look beneath<br />the surface.</h2>
          <p className="mt-4 max-w-[40ch] text-white/65">Keep scrolling: the hologram fades from the outer body to the structure and organs within. It is how we think about care: the whole person, from the outside in.</p>
          <div className="mt-8 flex gap-2">
            {LAYERS.map(([n], i) => <span key={n} className={`rounded-full px-4 py-2 text-[0.9rem] font-semibold transition-[color,background-color,opacity,transform] duration-500 ${i === idx ? 'bg-violet text-white' : 'bg-white/[0.05] text-white/50 ring-1 ring-white/10'}`}>{n}</span>)}
          </div>
          <div className="mt-6 min-h-[7rem]">
            <AnimatePresence mode="wait">
              <motion.div key={idx} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease }}>
                <h3 className="h-gs text-[1.5rem]">{LAYERS[idx][1]}</h3>
                <p className="mt-2 max-w-[40ch] text-white/65">{LAYERS[idx][2]}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="relative h-[52svh] max-md:order-1 md:h-[86svh]">
          <HoloCanvas className="relative h-full w-full" cam={[0, 0.3, 8.2]} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ services */
const SERVICES = [
  ['Personalized Wellness', '/images/care1.jpg', '#0E2340'],
  ['Advanced Aesthetic Care', '/images/care2.jpg', '#1C1752'],
  ['Health & Wellbeing', '/images/care3.jpg', '#111A3A'],
  ['Your Wellness Journey', '/images/care4.jpg', '#13213B'],
];
function Services() {
  return (
    <section id="services" className="px-[var(--m)] py-24 md:py-32">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal><Label>Our services</Label></Reveal>
          <Reveal><h2 className="h-gs max-w-[22ch] text-right text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.05] max-md:text-left">Care that moves with you</h2></Reveal>
        </div>
        <p className="mt-4 text-[0.9rem] text-white/45">Placeholder service areas and descriptions. The final list is confirmed with Dr. Varney.</p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(([t, img, bg], i) => (
            <Reveal key={t} delay={i * 0.08}>
              <article className="group flex h-full flex-col rounded-[1.6rem] p-5 ring-1 ring-white/10 transition-transform duration-500 hover:-translate-y-2" style={{ background: bg }}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="h-gs text-[1.3rem] leading-tight">{t}</h3>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-navy ring-1 ring-cool/30 transition-[color,background-color,opacity,transform] duration-300 group-hover:rotate-45 group-hover:bg-violet group-hover:text-white"><ArrowUpRight size={16} /></span>
                </div>
                <p className="mt-2 text-[0.92rem] text-white/60">Placeholder description of this area of care.</p>
                <div className="mt-5 aspect-[4/3] overflow-hidden rounded-2xl">
                  <img src={img} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ botox party */
const OCC = [['Birthday', Cake], ['Bridal / Bachelorette', Gem], ["Friends' gathering", Users], ['Private wellness event', Flower2]];
const GUESTS = ['4–6', '7–10', '11–15', '16+'];
const VENUES = [['At the clinic', 'if available', Building2], ['Private residence', 'if approved', Home], ['Event venue', 'if approved', MapPin]];
function Party() {
  const [step, setStep] = useState(0);
  const [occ, setOcc] = useState(0);
  const [g, setG] = useState(1);
  const [v, setV] = useState(0);
  const stepNames = ['Occasion', 'Guests', 'Setting'];
  return (
    <section id="party" className="bg-navy-2 px-[var(--m)] py-24 md:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <Reveal><Label>Private Botox Parties</Label></Reveal>
          <Reveal><h2 className="h-gs mt-6 text-[clamp(2rem,4vw,3.8rem)] leading-[1.04]">Your people.<br />Your occasion.<br /><span className="text-ice">Your private experience.</span></h2></Reveal>
          <Reveal><p className="mt-5 max-w-[44ch] text-white/65">Plan a private gathering with Dr. Varney's team in three quick steps. This is a homepage preview: nothing is booked or sent.</p></Reveal>
          <div className="mt-8 grid grid-cols-[1.2fr_1fr] gap-3">
            <Reveal className="row-span-2 overflow-hidden rounded-[1.4rem]"><img src="/images/p1.jpg" alt="Friends raising glasses together (stock photo)" className="h-full min-h-[18rem] w-full object-cover" /></Reveal>
            <Reveal className="overflow-hidden rounded-[1.4rem]"><img src="/images/p2.jpg" alt="" className="h-full max-h-[9rem] w-full object-cover" /></Reveal>
            <Reveal className="overflow-hidden rounded-[1.4rem]"><img src="/images/p3.jpg" alt="" className="h-full max-h-[9rem] w-full object-cover" /></Reveal>
          </div>
        </div>

        <Reveal className="self-start rounded-[2rem] bg-white/[0.04] p-5 ring-1 ring-white/10 md:p-8">
          <div className="flex flex-wrap gap-2" aria-label="Steps">
            {stepNames.map((n, i) => (
              <button key={n} type="button" onClick={() => setStep(i)} className={`rounded-full px-4 py-2 text-[0.9rem] font-semibold transition-colors ${i === step ? 'bg-violet text-white' : 'bg-white/[0.06] text-white/60'}`}>{i + 1} {n}</button>
            ))}
          </div>
          <div className="mt-6 min-h-[17rem]">
            <AnimatePresence mode="wait">
              <motion.fieldset key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4, ease }} className="m-0 border-0 p-0">
                {step === 0 && (<>
                  <legend className="h-gs text-[1.6rem]">What are we celebrating?</legend>
                  <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup">
                    {OCC.map(([t, Icon], i) => (
                      <button key={t} type="button" role="radio" aria-checked={occ === i} onClick={() => setOcc(i)} className={`flex min-h-[5.5rem] flex-col justify-between rounded-2xl p-4 text-left font-semibold transition-[color,background-color,opacity,transform] duration-300 ${occ === i ? 'bg-violet text-white' : 'bg-white/[0.06] hover:-translate-y-0.5'}`}>
                        <Icon size={20} className={occ === i ? 'text-white' : 'text-violet'} />{t}
                      </button>
                    ))}
                  </div>
                </>)}
                {step === 1 && (<>
                  <legend className="h-gs text-[1.6rem]">How many guests?</legend>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" role="radiogroup">
                    {GUESTS.map((t, i) => (
                      <button key={t} type="button" role="radio" aria-checked={g === i} onClick={() => setG(i)} className={`flex min-h-[7rem] flex-col items-center justify-center gap-2 rounded-2xl font-semibold transition-[color,background-color,opacity,transform] duration-300 ${g === i ? 'bg-ice text-navy' : 'bg-white/[0.06]'}`}>
                        <span className="flex flex-wrap justify-center gap-1 px-3">{Array.from({ length: [5, 8, 12, 16][i] }).map((_, k) => <i key={k} className={`h-2 w-2 rounded-full ${g === i ? 'bg-navy' : 'bg-violet/60'}`} />)}</span>
                        <span className="h-gs text-[1.3rem]">{t}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-[0.85rem] text-white/45">Proposed ranges, not confirmed minimums.</p>
                </>)}
                {step === 2 && (<>
                  <legend className="h-gs text-[1.6rem]">Where would you like it?</legend>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3" role="radiogroup">
                    {VENUES.map(([t, s, Icon], i) => (
                      <button key={t} type="button" role="radio" aria-checked={v === i} onClick={() => setV(i)} className={`flex min-h-[8rem] flex-col justify-between rounded-[1.4rem] rounded-t-[4rem] p-4 text-left font-semibold transition-[color,background-color,opacity,transform] duration-300 ${v === i ? 'bg-violet text-white' : 'bg-white/[0.06]'}`}>
                        <Icon size={20} className={v === i ? 'text-ice' : 'text-violet'} /><span>{t}<br /><span className="text-[0.82rem] font-medium opacity-70">{s}</span></span>
                      </button>
                    ))}
                  </div>
                </>)}
              </motion.fieldset>
            </AnimatePresence>
          </div>

          <div className="rounded-2xl bg-navy/70 p-5 ring-1 ring-white/10" aria-live="polite">
            <p className="text-[0.82rem] font-bold text-ice">Your private Varney experience</p>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-[0.95rem] sm:grid-cols-4">
              <div><dt className="text-white/45">Occasion</dt><dd className="font-semibold">{OCC[occ][0]}</dd></div>
              <div><dt className="text-white/45">Guests</dt><dd className="font-semibold">{GUESTS[g]}</dd></div>
              <div><dt className="text-white/45">Setting</dt><dd className="font-semibold">{VENUES[v][0]}</dd></div>
              <div><dt className="text-white/45">Status</dt><dd className="font-semibold text-ice">Pending confirmation</dd></div>
            </dl>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-[34ch] text-[0.8rem] text-white/55">Event inquiry only. Treatment eligibility, assessment, consent, supervision and venue suitability remain subject to the practice’s approval.</p>
            {step < 2
              ? <button type="button" onClick={() => setStep(step + 1)} className="inline-flex h-12 items-center gap-2 rounded-full bg-violet px-6 font-semibold text-white">Next <ArrowRight size={17} /></button>
              : <button type="button" onClick={() => toast('Preview only: nothing was sent or booked.')} className="inline-flex h-12 items-center gap-2 rounded-full bg-violet px-6 font-semibold text-white">Send inquiry <ArrowUpRight size={17} /></button>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ doctor */
function Doctor() {
  return (
    <section id="doctor" className="px-[var(--m)] py-24 md:py-32">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <Reveal className="relative">
          <div className="overflow-hidden rounded-[2rem] rounded-t-[12rem] bg-violet-deep">
            <motion.img initial={{ scale: 1.15 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease }} src="/images/doc.jpg" alt="Stock portrait placeholder (not Dr. Varney)" className="aspect-[4/5] w-full object-cover object-[50%_20%]" />
          </div>
          <p className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-[0.85rem] font-medium text-navy">Stock placeholder, not Dr. Varney</p>
        </Reveal>
        <div>
          <Reveal><Label>Meet your doctor</Label></Reveal>
          <Reveal><h2 className="h-gs mt-6 text-[clamp(2.2rem,4.4vw,4.2rem)] leading-[1.02]">Dr. Joseph Varney, MD</h2></Reveal>
          <Reveal><p className="mt-5 max-w-[46ch] text-[1.1rem] leading-relaxed text-white/75">Introduction placeholder. Dr. Varney's background and approach to care will be written with the practice and verified before publication.</p></Reveal>
          <Reveal><p className="mt-3 text-[0.9rem] text-white/45">No qualifications, awards or credentials are shown until supplied and confirmed.</p></Reveal>
          <Reveal className="mt-8"><Pill href="#contact">Book a Consultation</Pill></Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ cta + footer */
function Cta() {
  return (
    <section id="contact" className="px-2.5 pb-4 md:px-4">
      <div className="on-color relative overflow-hidden rounded-[1.75rem] bg-violet px-6 py-16 text-white md:rounded-[2.25rem] md:px-14 md:py-24">
        <div className="relative z-10 max-w-[38rem]">
          <h2 data-reveal className="h-gs text-[clamp(2.2rem,4.6vw,4.4rem)] leading-[1.02]">Your next chapter starts here.</h2>
          <p data-reveal="0.1" className="mt-5 text-[1.15rem] text-white/85">Discover a more personal approach to wellness.</p>
          <div data-reveal="0.2" className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" onClick={(e) => { e.preventDefault(); toast('Consultation booking is not part of this concept preview.'); }} className="group inline-flex h-12 items-center gap-3 rounded-full bg-white pl-1.5 pr-5 font-semibold text-navy">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-violet text-white transition-transform group-hover:rotate-45"><ArrowUpRight size={17} /></span>Book a Consultation
            </a>
            <a href="#party" onClick={(e) => go(e, '#party')} className="inline-flex h-12 items-center rounded-full px-5 font-semibold text-white ring-1 ring-white/70 hover:bg-white/15">Plan a private party</a>
          </div>
        </div>
        <div data-reveal="0.15" className="pointer-events-none absolute -bottom-10 right-0 hidden h-[115%] w-[44%] md:block">
          <CellCanvas className="h-full w-full" xray={0.15} cam={[0, 0.2, 8]} />
        </div>
      </div>
      <footer className="mx-auto mt-10 max-w-[1320px] px-3 pb-10 text-[0.92rem] text-white/65">
        <div className="grid gap-8 md:grid-cols-4">
          <div data-reveal><p className="h-gs text-[1.3rem] text-white">Varney <span className="text-ice">Wellness</span></p><p className="mt-2">Physician-led wellness, designed around you.</p></div>
          <div data-reveal="0.08"><p className="font-semibold text-white">Explore</p><ul className="mt-2 grid gap-1">{LINKS.map(([l, h]) => <li key={h}><a href={h} onClick={(e) => go(e, h)} className="hover:text-white">{l}</a></li>)}</ul></div>
          <div data-reveal="0.16"><p className="font-semibold text-white">Visit</p><p className="mt-2">Address placeholder<br />Florida, USA<br />Hours to be confirmed</p></div>
          <div data-reveal="0.24"><p className="font-semibold text-white">Contact</p><p className="mt-2">Phone and email to be supplied by the practice.</p></div>
        </div>
      </footer>
    </section>
  );
}

/* ------------------------------------------------------------------ page */
export default function LightPage() {
  const [ready, setReady] = useState(false);
  const [landed, setLanded] = useState(false);
  useEffect(() => {
    document.documentElement.style.background = '#F5F9F7';
    document.body.style.background = '#F5F9F7';
    document.body.style.color = '#0F2822';
    S.xray = 0; S.rot = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis; let tick;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09 });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    // one shared reveal for every block marked data-reveal (sections without their own scroll story)
    const rctx = reduced ? null : gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: Number(el.dataset.reveal) || 0, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 1200);
    return () => { clearTimeout(t); rctx?.revert(); if (tick) gsap.ticker.remove(tick); lenis?.destroy(); window.__lenis = null; };
  }, []);

  return (
    <div className="min-h-screen bg-navy text-white">
      <a href="#about" className="skip">Skip to content</a>
      <Loader onReady={() => setReady(true)} onLanded={() => setLanded(true)} />
      <SiteHeader brandOn={landed} />
      <Hero ready={ready} />
      <main>
        <Sec.Manifesto />
        <Treatment />
        <Sec.Marquee />
        <Sec.Steps />
        <Sec.Expand />
        <Sec.Services />
        <PartyInvite />
        <Sec.Doctor />
      </main>
      <Cta />
      <FloatDock />
      <Toast />
    </div>
  );
}
