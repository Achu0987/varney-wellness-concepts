'use client';
import { A } from '@/lib/asset';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight, ArrowRight, Check, Cake, Gem, Users, Flower2, Building2, Home, MapPin,
  MessageCircle, ClipboardList, CalendarCheck, Stethoscope, HeartPulse, Sparkles,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);
const ease = [0.22, 1, 0.36, 1];

function go(e, href) {
  e?.preventDefault();
  const el = document.querySelector(href);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: 'smooth' });
}
const toast = (m) => window.dispatchEvent(new CustomEvent('vw-toast', { detail: m }));
const motionOK = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Label() { return null; }
const Grad = ({ children }) => <span>{children}</span>;

/* ------------------------------------------------------------------ 1. manifesto: words light up as you scroll */
const MANIFESTO = 'We combine [physician-led care], thoughtful technology and a [plan built around you] to make wellness feel clear, calm and [personal].';
export function Manifesto() {
  const root = useRef(null);
  useEffect(() => {
    if (!motionOK()) return undefined;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        gsap.fromTo('.mw', { opacity: 0.15 }, { opacity: 1, stagger: 0.06, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center 45%', scrub: 0.6 } });
        gsap.fromTo('.pillar', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.pillar', start: 'top 88%' } });
      });
      mm.add('(max-width: 767px)', () => {
        gsap.fromTo('.mw', { opacity: 0.15 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom 60%', scrub: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const words = [];
  let hi = false;
  MANIFESTO.split(' ').forEach((w) => {
    let word = w;
    if (word.startsWith('[')) { hi = true; word = word.slice(1); }
    const end = word.includes(']');
    word = word.replace(']', '');
    words.push({ word, hi });
    if (end) hi = false;
  });

  return (
    <section id="about" ref={root} className="relative overflow-hidden px-[var(--m)] pb-8 pt-20 md:pb-10 md:pt-28">
      <div className="relative mx-auto w-full max-w-[1320px]">
        <Label>Why Varney Wellness</Label>
        <p className="h-gs mx-auto mt-8 max-w-[1100px] text-center text-[clamp(2rem,4.6vw,4.6rem)] font-medium leading-[1.08]">
          {words.map((w, i) => (
            <span key={i} className={`mw inline-block pr-[0.25em] ${w.hi ? 'text-ice' : 'text-white'}`}>{w.word}</span>
          ))}
        </p>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[[Stethoscope, 'Physician-led', 'Care guided by Dr. Varney, with time to listen and explain.'], [HeartPulse, 'Personal plans', 'Every plan starts with your goals, history and pace.'], [Sparkles, 'Thoughtful technology', 'Tools that keep your care clear and connected.']].map(([Icon, t, d]) => (
            <div key={t} className="pillar group rounded-[1.6rem] bg-white/[0.04] p-6 ring-1 ring-white/10 transition-[color,background-color,opacity,transform] duration-500 hover:-translate-y-1.5 hover:bg-white/[0.07] hover:ring-ice/40">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet text-white"><Icon size={22} /></span>
              <h3 className="h-gs mt-6 text-[1.4rem]">{t}</h3>
              <p className="mt-2 text-white/65">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[0.8125rem] text-white/55">Illustrative copy, pending the practice’s approval.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 2. marquee band that moves with the scroll */
export function Marquee() {
  const root = useRef(null);
  useEffect(() => {
    if (!motionOK()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.mq-a', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('.mq-b', { xPercent: -30 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);
  const items = ['Physician-led care', 'Personal plans', 'Aesthetic care', 'Private events', 'Connected follow-up'];
  const row = (cls, outline) => (
    <div className={`${cls} flex w-max gap-10 whitespace-nowrap`}>
      {[...items, ...items, ...items].map((t, i) => (
        <span key={i} className={`h-gs flex items-center gap-10 text-[clamp(2.4rem,6vw,6rem)] leading-none ${outline ? 'text-ice/40' : 'text-white'}`}>
          {t}<span className="h-3 w-3 rounded-full bg-violet" />
        </span>
      ))}
    </div>
  );
  return (
    <section ref={root} aria-hidden="true" className="relative overflow-hidden py-14">
      {row('mq-a', false)}
      <div className="mt-4">{row('mq-b', true)}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ 3. how it works: stacking cards */
const STEPS = [
  { n: '01', icon: MessageCircle, t: 'Meet your doctor', d: 'One unhurried conversation about your goals, your history and your pace. You leave understanding what happens next.', img: A('/images/care1.jpg'), tags: ['Unhurried', 'Personal'] },
  { n: '02', icon: ClipboardList, t: 'Get your plan', d: 'A clear, personal care plan, written in plain language and shaped around your life rather than a template.', img: A('/images/band.jpg'), tags: ['Plain language', 'Built for you'] },
  { n: '03', icon: CalendarCheck, t: 'Follow through', d: 'Check-ins and updates that keep everything connected, so your plan keeps moving with you.', img: A('/images/care3.jpg'), tags: ['Check-ins', 'Connected'] },
];
export function Steps() {
  const root = useRef(null);
  useEffect(() => {
    if (!motionOK()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.st-head > *', { y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.st-head', start: 'top 80%' } });
      const cards = gsap.utils.toArray('.st-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card.querySelector('.st-img'), { scale: 1.25, yPercent: -6 }, { scale: 1, yPercent: 6, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
        if (i < cards.length - 1) {
          gsap.to(card, { scale: 0.9, opacity: 0.35, filter: 'blur(2px)', ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 14%', scrub: true } });
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section id="how" ref={root} className="relative px-[var(--m)] pb-24 pt-24 md:pt-32">
      <div className="st-head mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-6">
        <div><Label>How it works</Label><h2 className="h-gs mt-6 max-w-[14ch] text-[clamp(2.4rem,5vw,5rem)] leading-[1.02]">Care in three <Grad>simple steps</Grad></h2></div>
        <p className="max-w-[34ch] text-[1.05rem] text-white/65">No maze of appointments. Just a clear path, explained at every step.</p>
      </div>
      <div className="mx-auto mt-14 max-w-[1320px]">
        {STEPS.map((s, i) => (
          <article key={s.n} className="st-card sticky top-[10vh] mb-[6vh] grid min-h-[76vh] origin-top overflow-hidden rounded-[2rem] bg-violet-deep shadow-2xl md:grid-cols-[1fr_1.1fr]" style={{ zIndex: i + 1 }}>
            <div className="flex flex-col justify-between p-7 md:p-12">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-paper text-violet-deep"><s.icon size={24} /></span><span className="text-[0.95rem] font-medium text-white/75">Step {i + 1} of {STEPS.length}</span></span>
                <span className="h-gs text-[clamp(4rem,8vw,7.5rem)] leading-none text-ice">{s.n}</span>
              </div>
              <div>
                <h3 className="h-gs text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.02] text-white">{s.t}</h3>
                <p className="mt-4 max-w-[40ch] text-[1.08rem] leading-relaxed text-white/80">{s.d}</p>
                <div className="mt-6 flex flex-wrap gap-2">{s.tags.map((t) => <span key={t} className="rounded-full bg-ice px-4 py-2 text-[0.9rem] font-medium text-violet-deep">{t}</span>)}</div>
              </div>
            </div>
            <div className="relative m-3 min-h-[40vh] overflow-hidden rounded-[1.5rem] md:m-4">
              <img src={s.img} alt="" className="st-img absolute inset-0 h-full w-full object-cover" />
              <p className="absolute bottom-4 right-4 rounded-full bg-paper px-3 py-1.5 text-[0.8125rem] text-violet-deep">Stock photo</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 4. image that opens to the whole screen */
export function Expand() {
  const root = useRef(null);
  useEffect(() => {
    if (!motionOK()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=140%', scrub: 0.6, pin: true } });
      tl.fromTo('.ex-frame', { clipPath: 'inset(22% 26% 22% 26% round 40px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' }, 0)
        .fromTo('.ex-img', { scale: 1.35 }, { scale: 1, ease: 'none' }, 0)
        .fromTo('.ex-small', { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0)
        .from('.ex-line', { yPercent: 120, stagger: 0.08, duration: 0.4 }, 0.45)
        .from('.ex-sub', { opacity: 0, y: 20, duration: 0.3 }, 0.7);
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} className="on-color relative h-[100svh] overflow-hidden">
      <p className="ex-small h-gs absolute inset-x-0 top-[9%] z-10 text-center text-[clamp(1.4rem,2.4vw,2rem)] text-white/80">Step inside</p>
      <div className="ex-frame absolute inset-0 overflow-hidden">
        <img src={A('/images/band.jpg')} alt="Calm, light-filled clinic interior with plants (stock photo placeholder)" className="ex-img absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 to-navy/10" />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end px-[var(--m)] pb-[10vh]">
        <h2 className="h-gs text-[clamp(2.6rem,7vw,7rem)] leading-[0.95]">
          {['A space designed', 'around you.'].map((l) => <span key={l} className="block overflow-hidden"><span className="ex-line block">{l}</span></span>)}
        </h2>
        <p className="ex-sub mt-5 max-w-[46ch] text-[1.1rem] text-white/80">Calm, private and unhurried, so every visit feels personal. Photo is a stock placeholder until the practice supplies its own.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 5. services: horizontal gallery */
const SERVICES = [
  { t: 'Personalized Wellness', img: A('/images/care1.jpg') },
  { t: 'Advanced Aesthetic Care', img: A('/images/care2.jpg') },
  { t: 'Health & Wellbeing', img: A('/images/care3.jpg') },
  { t: 'Your Wellness Journey', img: A('/images/care4.jpg') },
];
export function Services() {
  const root = useRef(null);
  const track = useRef(null);
  const [idx, setIdx] = useState(1);
  useEffect(() => {
    if (!motionOK()) return undefined;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        const dist = () => track.current.scrollWidth - window.innerWidth + 120;
        const tween = gsap.to(track.current, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: {
            trigger: root.current, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.7, invalidateOnRefresh: true,
            onUpdate: (self) => setIdx(Math.min(SERVICES.length, 1 + Math.floor(self.progress * SERVICES.length * 0.999))),
          },
        });
        gsap.utils.toArray('.sv-img').forEach((img) => {
          gsap.fromTo(img, { xPercent: -12 }, { xPercent: 12, ease: 'none', scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section id="services" ref={root} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-20">
      <div className="flex flex-wrap items-end justify-between gap-6 px-[var(--m)]">
        <div data-reveal><Label>Our services</Label><h2 className="h-gs mt-6 text-[clamp(2.4rem,5vw,5rem)] leading-[1.02]">Care that <Grad>moves with you</Grad></h2></div>
        <div className="flex items-center gap-4">
          <p className="h-gs text-[1.4rem] tabular-nums"><span className="text-ice">0{idx}</span><span className="text-white/40"> / 0{SERVICES.length}</span></p>
          <div className="hidden h-[3px] w-40 overflow-hidden rounded-full bg-white/10 md:block"><div className="h-full w-full origin-left bg-ice transition-transform duration-500" style={{ transform: `scaleX(${idx / SERVICES.length})` }} /></div>
        </div>
      </div>
      <p data-reveal="0.1" className="mt-3 px-[var(--m)] text-[0.85rem] text-white/45">Placeholder service areas. The final list is confirmed with Dr. Varney.</p>
      <ul ref={track} className="mt-10 flex gap-6 overflow-x-auto px-[var(--m)] pb-4 [scrollbar-width:none] max-md:snap-x max-md:snap-mandatory md:w-max md:overflow-visible">
        {SERVICES.map((s, i) => (
          <li key={s.t} data-reveal={i * 0.1} className="on-color group relative h-[64svh] w-[82vw] shrink-0 overflow-hidden rounded-[2rem] ring-1 ring-white/10 max-md:snap-center md:w-[40vw] lg:w-[34vw]">
            <img src={s.img} alt="" className="sv-img absolute inset-0 h-full w-[124%] max-w-none object-cover transition-transform duration-700 group-hover:scale-105" style={{ left: '-12%' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-navy/10" />
            <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-navy/70 transition-[color,background-color,opacity,transform] duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-navy"><ArrowUpRight size={18} /></span>
            <div className="absolute inset-x-6 bottom-6">
              <h3 className="h-gs text-[clamp(1.8rem,2.6vw,2.6rem)] leading-[1.02]">{s.t}</h3>
              <p className="mt-3 text-white/75">Placeholder description of this area of care, to be written with the practice.</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ 6. botox party: the photo follows your choice */
const OCC = [
  { t: 'Birthday', icon: Cake, img: A('/images/p1.jpg'), line: 'Raise a glass to another year.' },
  { t: 'Bridal / Bachelorette', icon: Gem, img: A('/images/p2.jpg'), line: 'Before the big day, together.' },
  { t: "Friends' gathering", icon: Users, img: A('/images/p3.jpg'), line: 'Your people, one afternoon.' },
  { t: 'Private wellness event', icon: Flower2, img: A('/images/p4.jpg'), line: 'A calm, private occasion.' },
];
const GUESTS = [['4–6', 5], ['7–10', 8], ['11–15', 12], ['16+', 16]];
const VENUES = [['At the clinic', 'if available', Building2], ['Private residence', 'if approved', Home], ['Event venue', 'if approved', MapPin]];
export function Party() {
  const root = useRef(null);
  const [step, setStep] = useState(0);
  const [occ, setOcc] = useState(0);
  const [g, setG] = useState(1);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!motionOK()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.pt-in', { y: 60, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } });
    }, root);
    return () => ctx.revert();
  }, []);
  const names = ['Occasion', 'Guests', 'Setting'];
  return (
    <section id="party" ref={root} className="relative px-[var(--m)] py-24 md:py-32">
      <div className="relative mx-auto max-w-[1320px]">
        <div className="pt-in flex flex-wrap items-end justify-between gap-6">
          <div><Label>Private Botox Parties</Label><h2 className="h-gs mt-6 text-[clamp(2.4rem,5vw,5rem)] leading-[1.02]">Your people. Your occasion.<br /><Grad>Your private experience.</Grad></h2></div>
          <p className="max-w-[36ch] text-white/65">Plan a gathering with Dr. Varney's team in three quick steps. Homepage preview: nothing is booked or sent.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div className="pt-in relative min-h-[28rem] overflow-hidden rounded-[2rem] ring-1 ring-white/10 lg:min-h-[40rem]">
            <AnimatePresence mode="popLayout">
              <motion.img key={occ} src={OCC[occ].img} alt="" initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease }} className="absolute inset-0 h-full w-full object-cover" />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
            <div className="absolute inset-x-6 bottom-6">
              <AnimatePresence mode="wait">
                <motion.p key={occ} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease }} className="h-gs text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight">{OCC[occ].line}</motion.p>
              </AnimatePresence>
              <div className="mt-4 flex flex-wrap items-center gap-2" aria-hidden="true">
                {Array.from({ length: GUESTS[g][1] }).map((_, k) => <motion.i key={`${g}-${k}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: k * 0.03, type: 'spring', stiffness: 400, damping: 18 }} className="h-3.5 w-3.5 rounded-full bg-ice" />)}
                <span className="ml-2 text-[0.9rem] text-white/80">{GUESTS[g][0]} guests</span>
              </div>
            </div>
            <p className="absolute right-4 top-4 rounded-full bg-navy px-3 py-1.5 text-[0.75rem] text-white/80">Stock photo</p>
          </div>

          <div className="pt-in flex flex-col rounded-[2rem] bg-white/[0.04] p-6 ring-1 ring-white/10 md:p-8">
            <div className="flex items-center gap-3">
              {names.map((n, i) => (
                <button key={n} type="button" onClick={() => setStep(i)} className="flex flex-1 flex-col gap-2 text-left">
                  <span className={`text-[0.85rem] font-semibold ${i === step ? 'text-white' : 'text-white/45'}`}>{i + 1}. {n}</span>
                  <span className="h-1 overflow-hidden rounded-full bg-white/10"><motion.span className="block h-full bg-ice" animate={{ width: i <= step ? '100%' : '0%' }} transition={{ duration: 0.5, ease }} /></span>
                </button>
              ))}
            </div>
            <div className="mt-8 min-h-[18rem] flex-1">
              <AnimatePresence mode="wait">
                <motion.fieldset key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.45, ease }} className="m-0 border-0 p-0">
                  {step === 0 && (<>
                    <legend className="h-gs text-[1.7rem]">What are we celebrating?</legend>
                    <div className="mt-5 grid grid-cols-2 gap-3" role="radiogroup">
                      {OCC.map((o, i) => (
                        <button key={o.t} type="button" role="radio" aria-checked={occ === i} onClick={() => setOcc(i)} className={`group flex min-h-[6.5rem] flex-col justify-between rounded-2xl p-4 text-left font-semibold transition-[color,background-color,opacity,transform] duration-300 ${occ === i ? 'bg-violet' : 'bg-white/[0.05] ring-1 ring-white/10 hover:-translate-y-1 hover:bg-white/[0.09]'}`}>
                          <span className="flex items-center justify-between"><o.icon size={22} className={occ === i ? 'text-white' : 'text-ice'} />{occ === i && <Check size={16} />}</span>{o.t}
                        </button>
                      ))}
                    </div>
                  </>)}
                  {step === 1 && (<>
                    <legend className="h-gs text-[1.7rem]">How many guests?</legend>
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4" role="radiogroup">
                      {GUESTS.map(([t, n], i) => (
                        <button key={t} type="button" role="radio" aria-checked={g === i} onClick={() => setG(i)} className={`flex min-h-[8rem] flex-col items-center justify-center gap-3 rounded-2xl font-semibold transition-[color,background-color,opacity,transform] duration-300 ${g === i ? 'bg-ice text-navy' : 'bg-white/[0.05] ring-1 ring-white/10 hover:bg-white/[0.09]'}`}>
                          <span className="flex max-w-[5.5rem] flex-wrap justify-center gap-1">{Array.from({ length: n }).map((_, k) => <i key={k} className={`h-2 w-2 rounded-full ${g === i ? 'bg-navy' : 'bg-ice/70'}`} />)}</span>
                          <span className="h-gs text-[1.4rem]">{t}</span>
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-[0.85rem] text-white/45">Proposed ranges, not confirmed minimums.</p>
                  </>)}
                  {step === 2 && (<>
                    <legend className="h-gs text-[1.7rem]">Where would you like it?</legend>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3" role="radiogroup">
                      {VENUES.map(([t, s, Icon], i) => (
                        <button key={t} type="button" role="radio" aria-checked={v === i} onClick={() => setV(i)} className={`flex min-h-[9rem] flex-col justify-between rounded-[1.4rem] rounded-t-[5rem] p-5 text-left font-semibold transition-[color,background-color,opacity,transform] duration-300 ${v === i ? 'bg-ice text-navy' : 'bg-white/[0.05] ring-1 ring-white/10 hover:bg-white/[0.09]'}`}>
                          <Icon size={22} className={v === i ? 'text-navy' : 'text-ice'} /><span>{t}<br /><span className="text-[0.82rem] font-medium opacity-70">{s}</span></span>
                        </button>
                      ))}
                    </div>
                  </>)}
                </motion.fieldset>
              </AnimatePresence>
            </div>
            <div className="mt-6 rounded-2xl bg-navy/70 p-5 ring-1 ring-white/10" aria-live="polite">
              <p className="text-[0.8rem] font-bold text-ice">Your private Varney experience</p>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-[0.95rem] sm:grid-cols-4">
                <div><dt className="text-white/45">Occasion</dt><dd className="font-semibold">{OCC[occ].t}</dd></div>
                <div><dt className="text-white/45">Guests</dt><dd className="font-semibold">{GUESTS[g][0]}</dd></div>
                <div><dt className="text-white/45">Setting</dt><dd className="font-semibold">{VENUES[v][0]}</dd></div>
                <div><dt className="text-white/45">Status</dt><dd className="font-semibold text-ice">Pending confirmation</dd></div>
              </dl>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-[34ch] text-[0.78rem] text-white/50">Event inquiry only. Treatment eligibility, assessment, consent, supervision and venue suitability remain subject to the practice’s approval.</p>
              {step < 2
                ? <button type="button" onClick={() => setStep(step + 1)} className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-navy">Next <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></button>
                : <button type="button" onClick={() => toast('Preview only: nothing was sent or booked.')} className="inline-flex h-12 items-center gap-2 rounded-full bg-violet px-6 font-semibold text-white">Send inquiry <ArrowUpRight size={17} /></button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 7. doctor: portrait reveal + name in letters */
export function Doctor() {
  const root = useRef(null);
  useEffect(() => {
    if (!motionOK()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.dr-frame', { clipPath: 'inset(100% 0% 0% 0% round 2rem)' }, { clipPath: 'inset(0% 0% 0% 0% round 2rem)', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'top 20%', scrub: 0.6 } });
      gsap.fromTo('.dr-img', { scale: 1.35 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'bottom top', scrub: true } });
      gsap.from('.dr-ch', { yPercent: 120, opacity: 0, stagger: 0.025, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.dr-name', start: 'top 80%' } });
      gsap.from('.dr-in', { y: 30, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.dr-name', start: 'top 75%' } });
    }, root);
    return () => ctx.revert();
  }, []);
  const name = 'Dr. Joseph Varney, MD';
  return (
    <section id="doctor" ref={root} className="relative px-[var(--m)] py-24 md:py-32">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-20">
        <div className="relative">
          <div className="dr-frame relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <img src={A('/images/doc.jpg')} alt="Stock portrait placeholder (not Dr. Varney)" className="dr-img absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
          </div>
          <div className="absolute -bottom-5 -right-3 rounded-2xl bg-violet px-5 py-4 md:-right-8">
            <p className="text-[0.75rem] text-white/75">Led by</p>
            <p className="h-gs text-[1.15rem] text-white">Dr. Joseph Varney, MD</p>
          </div>
          <p className="absolute left-4 top-4 rounded-full bg-navy px-3 py-1.5 text-[0.75rem] text-white/85">Stock placeholder, not Dr. Varney</p>
        </div>
        <div>
          <div className="dr-in"><Label>Meet your doctor</Label></div>
          <h2 className="dr-name h-gs mt-6 flex flex-wrap overflow-hidden text-[clamp(2.4rem,5vw,5rem)] leading-[1.02]" aria-label={name}>
            {name.split('').map((c, i) => <span key={i} aria-hidden="true" className="dr-ch inline-block">{c === ' ' ? ' ' : c}</span>)}
          </h2>
          <p className="dr-in mt-6 max-w-[44ch] text-[1.15rem] leading-relaxed text-white/75">Introduction placeholder. Dr. Varney's background and approach to care will be written with the practice and verified before publication.</p>
          <ul className="dr-in mt-8 grid gap-3 sm:grid-cols-2">
            {['Time to listen', 'Plain-language guidance', 'One plan, built for you', 'Follow-up that connects'].map((t) => (
              <li key={t} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-4 py-3.5 ring-1 ring-white/10"><Check size={17} className="text-ice" />{t}</li>
            ))}
          </ul>
          <p className="dr-in mt-4 text-[0.82rem] text-white/45">No qualifications, awards or credentials are shown until supplied and confirmed.</p>
          <a href="#contact" onClick={(e) => go(e, '#contact')} className="dr-in group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-white pl-1.5 pr-5 font-semibold text-navy">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-violet text-white transition-transform group-hover:rotate-45"><ArrowUpRight size={17} /></span>Book a Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
