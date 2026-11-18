'use client';
import { A } from '@/lib/asset';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Home, MapPin, Check, ArrowDown, Sparkles, Users, CalendarDays, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);
const ease = [0.22, 1, 0.36, 1];
const toast = (m) => window.dispatchEvent(new CustomEvent('c2-toast', { detail: m }));

const OCC = [
  { t: 'Bridal gathering', short: 'a bridal gathering', img: A('/c2/bridal.jpg') },
  { t: 'Birthday celebration', short: 'a birthday celebration', img: A('/images/p1.jpg') },
  { t: 'Private wellness evening', short: 'a private wellness evening', img: A('/c2/bath.jpg') },
  { t: "Friends' gathering", short: 'a gathering of friends', img: A('/images/p3.jpg') },
  { t: 'Something else', short: 'a custom celebration', img: A('/c2/eucalyptus.jpg') },
];
const GUESTS = [['4–6', 5], ['7–10', 8], ['11–15', 12], ['16+', 16]];
const VENUES = [
  { t: 'At the clinic', note: 'if available', icon: Building2, phrase: 'at the Varney clinic' },
  { t: 'Private residence', note: 'if approved', icon: Home, phrase: 'at a private residence' },
  { t: 'Private event venue', note: 'if approved', icon: MapPin, phrase: 'at a private event venue' },
];
const TIMES = ['Morning', 'Afternoon', 'Evening'];
const STEPS = [
  { k: 'Occasion', icon: Sparkles },
  { k: 'Guests', icon: Users },
  { k: 'Setting', icon: MapPin },
  { k: 'Date', icon: CalendarDays },
];

function scrollToEl(el) {
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.08;
  if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.4 }); else window.scrollTo({ top: y, behavior: 'smooth' });
}

/** A seated table, drawn in gold: one place setting per guest. */
function Table({ n }) {
  return (
    <svg viewBox="0 0 200 200" className="h-44 w-44 shrink-0" aria-hidden="true">
      <ellipse cx="100" cy="100" rx="58" ry="40" fill="rgba(197,167,123,0.12)" stroke="#C5A77B" strokeWidth="1.5" />
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        return (
          <motion.circle key={`${n}-${i}`} initial={{ r: 0 }} animate={{ r: 7 }} transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 18 }}
            cx={100 + Math.cos(a) * 80} cy={100 + Math.sin(a) * 60} fill="#F7F3EC" stroke="#C5A77B" strokeWidth="1.5" />
        );
      })}
    </svg>
  );
}

function Swap({ k, children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span key={k} initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }} transition={{ duration: 0.45, ease }} className="inline-block">
        {children}
      </motion.span>
    </AnimatePresence>
  );
}

/** One line of the invitation; it glows gold while its question is on screen. */
function Field({ on, children }) {
  return <span className={`-mx-0.5 rounded-md px-0.5 transition-[background-color,color] duration-500 ${on ? 'bg-[#C5A77B]/30 text-[#173B35]' : ''}`}>{children}</span>;
}

/**
 * Private Botox Parties as a guided concierge: the visitor scrolls through four questions,
 * each choice moves them to the next, and an engraved invitation writes itself alongside.
 * Event inquiry only.
 */
export default function Concierge() {
  const root = useRef(null);
  const panels = useRef([]);
  const [active, setActive] = useState(-1);
  const [occ, setOcc] = useState(0);
  const [g, setG] = useState(1);
  const [v, setV] = useState(0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState(1);
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const dateText = date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'a date of your choosing';

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      // which question is on screen
      panels.current.forEach((el, i) => {
        if (!el) return;
        ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) setActive(i); } });
      });
      ScrollTrigger.create({ trigger: '.cc-intro', start: 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) setActive(-1); } });
      if (reduced) return;
      gsap.from('.cc-line', { yPercent: 115, duration: 1.4, ease: 'power4.out', stagger: 0.12, scrollTrigger: { trigger: '.cc-intro', start: 'top 70%' } });
      gsap.from('.cc-fade', { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.cc-intro', start: 'top 60%' } });
      gsap.from('.cc-how > li', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.cc-how', start: 'top 85%' } });
      gsap.fromTo('.cc-how-line', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.cc-how', start: 'top 85%', end: 'top 45%', scrub: true } });
      gsap.fromTo('.cc-hero-arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 0 0)' }, { clipPath: 'inset(0% 0 0 0 round 999px 999px 0 0)', duration: 1.4, ease: 'power3.inOut', scrollTrigger: { trigger: '.cc-intro', start: 'top 70%' } });
      gsap.fromTo('.cc-hero-img', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.cc-intro', start: 'top bottom', end: 'bottom top', scrub: true } });
      // the invitation arrives tilted, like a card being set down
      gsap.fromTo('.cc-card', { rotateX: 14, y: 60, opacity: 0 }, { rotateX: 0, y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: '.cc-planner', start: 'top 75%' } });
      // each question rises in, then its options follow one by one
      panels.current.forEach((el) => {
        if (!el) return;
        gsap.from(el.querySelectorAll('.cc-q'), { y: 60, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 70%' } });
        gsap.from(el.querySelectorAll('.cc-opt'), { y: 50, opacity: 0, scale: 0.94, duration: 0.9, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: el, start: 'top 62%' } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // choose, then glide on to the next question
  const choose = (setter, value, next) => {
    setter(value);
    if (next != null) setTimeout(() => scrollToEl(panels.current[next]), 550);
  };

  const sentence = (
    <p className="c2-serif text-[clamp(1.35rem,1.9vw,1.75rem)] leading-[1.5]">
      Hosting{' '}
      <Field on={active === 0}><Swap k={occ}>{OCC[occ].short}</Swap></Field>
      {' '}for <Field on={active === 1}><Swap k={g}>{GUESTS[g][0]}</Swap> guests</Field>,{' '}
      <Field on={active === 2}><Swap k={v}>{VENUES[v].phrase}</Swap></Field>,{' '}
      on <Field on={active === 3}><Swap k={date + time}>{dateText}, in the {TIMES[time].toLowerCase()}.</Swap></Field>
    </p>
  );

  return (
    <section id="parties" ref={root} className="relative bg-[#173B35] text-[#F7F3EC]">
      {/* ---------- intro: what this is, and how it works ---------- */}
      <div className="cc-intro relative overflow-hidden px-[var(--m)] pb-20 pt-28 md:pb-28 md:pt-36">
        <div className="mx-auto grid max-w-[1360px] items-center gap-12 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h2 className="c2-serif text-[clamp(2.6rem,6.2vw,6.4rem)] leading-[0.98]">
              {['Your people.', 'Your occasion.', 'Your private experience.'].map((l) => (
                <span key={l} className="block overflow-hidden pb-[0.06em]"><span className="cc-line block">{l}</span></span>
              ))}
            </h2>
            <p className="cc-fade mt-7 max-w-[44ch] text-[1.15rem] leading-relaxed text-[#F7F3EC]/80">Private Botox Parties, planned in four simple steps. Your invitation writes itself as you choose, and our concierge replies to confirm what is possible.</p>
            <button type="button" onClick={() => scrollToEl(panels.current[0])} className="cc-fade group mt-9 inline-flex h-14 items-center gap-3 rounded-full bg-[#F7F3EC] pl-7 pr-2 text-[#173B35] transition-colors hover:bg-white">
              Start planning <span className="grid h-10 w-10 place-items-center rounded-full bg-[#C5A77B] transition-transform duration-500 group-hover:translate-y-0.5"><ArrowDown size={18} /></span>
            </button>
          </div>
          <div className="cc-hero-arch relative mx-auto hidden aspect-[3/4] w-full max-w-[24rem] overflow-hidden rounded-t-full lg:block">
            <img loading="lazy" decoding="async" src={A('/images/p3.jpg')} alt="Friends raising glasses at a celebration (stock placeholder)" className="cc-hero-img h-full w-full object-cover will-change-transform" />
          </div>
        </div>

        {/* how it works */}
        <div className="relative mx-auto mt-20 max-w-[1360px]">
          <div className="cc-how-line absolute left-0 right-0 top-7 hidden h-[2px] origin-left bg-[#C5A77B]/50 md:block" aria-hidden="true" />
          <ol className="cc-how relative grid gap-6 md:grid-cols-5" aria-label="How it works">
            {[...STEPS.map((s, i) => ({ ...s, t: ['Choose the occasion', 'Pick your guest count', 'Choose the setting', 'Suggest a date'][i] })), { k: 'Reply', icon: MessageCircle, t: 'We reply to confirm' }].map((s) => (
              <li key={s.k} className="flex items-center gap-4 md:flex-col md:items-start">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#F7F3EC] text-[#173B35]"><s.icon size={22} strokeWidth={1.6} /></span>
                <span><span className="block text-[0.95rem] text-[#C5A77B]">{s.k}</span><span className="c2-serif mt-1 block text-[1.35rem] leading-tight">{s.t}</span></span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ---------- the guided planner ---------- */}
      <div className="cc-planner relative px-[var(--m)]">
        <div className="mx-auto grid max-w-[1360px] gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
          {/* questions, one screen each */}
          <div>
            {/* 1. occasion */}
            <fieldset ref={(n) => { panels.current[0] = n; }} className="m-0 flex min-h-[92svh] flex-col justify-center border-0 p-0 py-16">
              <p className="cc-q text-[1rem] text-[#C5A77B]">Step 1 of 4</p>
              <legend className="contents"><span className="cc-q c2-serif mt-3 block text-[clamp(2.2rem,4vw,3.6rem)] leading-tight">What are we celebrating?</span></legend>
              <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3" role="radiogroup" aria-label="Occasion">
                {OCC.map((o, i) => (
                  <button key={o.t} type="button" role="radio" aria-checked={occ === i} onClick={() => choose(setOcc, i, 1)} className="cc-opt group text-left">
                    <span className={`relative block aspect-[3/4] overflow-hidden rounded-t-full transition-[opacity,transform] duration-500 ${occ === i ? 'outline outline-2 outline-offset-4 outline-[#C5A77B]' : 'opacity-80 hover:-translate-y-1 hover:opacity-100'}`}>
                      <img loading="lazy" decoding="async" src={o.img} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                      <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.55),rgba(0,0,0,0)_55%)]" />
                      <span className="absolute inset-x-3 bottom-3 text-[1rem] leading-tight text-[#F7F3EC]">{o.t}</span>
                      {occ === i && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3 top-[34%] grid h-8 w-8 place-items-center rounded-full bg-[#C5A77B] text-[#173B35]"><Check size={16} /></motion.span>}
                    </span>
                  </button>
                ))}
              </div>
              <p className="cc-q mt-6 text-[0.95rem] text-[#F7F3EC]/60">Tap one to choose. We will take you to the next step.</p>
            </fieldset>

            {/* 2. guests */}
            <fieldset ref={(n) => { panels.current[1] = n; }} className="m-0 flex min-h-[92svh] flex-col justify-center border-0 p-0 py-16">
              <p className="cc-q text-[1rem] text-[#C5A77B]">Step 2 of 4</p>
              <legend className="contents"><span className="cc-q c2-serif mt-3 block text-[clamp(2.2rem,4vw,3.6rem)] leading-tight">How many will join you?</span></legend>
              <div className="mt-9 flex flex-col items-start gap-8 sm:flex-row sm:items-center">
                <div className="cc-opt"><Table n={GUESTS[g][1]} /></div>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Guests">
                  {GUESTS.map(([t], i) => (
                    <button key={t} type="button" role="radio" aria-checked={g === i} onClick={() => choose(setG, i, 2)} className={`cc-opt h-16 min-w-[9rem] rounded-full px-6 transition-[background-color,color,transform] duration-500 hover:-translate-y-0.5 ${g === i ? 'bg-[#C5A77B] text-[#173B35]' : 'bg-[#1f4a43] text-[#F7F3EC] hover:bg-[#28574f]'}`}>
                      <span className="c2-serif text-[1.45rem]">{t}</span> <span className="text-[0.9rem] opacity-80">guests</span>
                    </button>
                  ))}
                </div>
              </div>
              <p className="cc-q mt-6 text-[0.95rem] text-[#F7F3EC]/60">Proposed ranges, not confirmed minimums.</p>
            </fieldset>

            {/* 3. setting */}
            <fieldset ref={(n) => { panels.current[2] = n; }} className="m-0 flex min-h-[92svh] flex-col justify-center border-0 p-0 py-16">
              <p className="cc-q text-[1rem] text-[#C5A77B]">Step 3 of 4</p>
              <legend className="contents"><span className="cc-q c2-serif mt-3 block text-[clamp(2.2rem,4vw,3.6rem)] leading-tight">Where shall we gather?</span></legend>
              <div className="mt-9 grid gap-4 sm:grid-cols-3" role="radiogroup" aria-label="Setting">
                {VENUES.map((ve, i) => (
                  <button key={ve.t} type="button" role="radio" aria-checked={v === i} onClick={() => choose(setV, i, 3)}
                    className={`cc-opt flex h-64 flex-col items-center justify-end rounded-t-full p-6 pb-8 text-center transition-[background-color,color,transform] duration-500 hover:-translate-y-1 ${v === i ? 'bg-[#F7F3EC] text-[#173B35]' : 'bg-[#1f4a43] hover:bg-[#28574f]'}`}>
                    <ve.icon size={28} strokeWidth={1.4} className={v === i ? 'text-[#173B35]' : 'text-[#C5A77B]'} />
                    <span className="c2-serif mt-4 text-[1.4rem] leading-tight">{ve.t}</span>
                    <span className="mt-1 text-[0.9rem] opacity-70">{ve.note}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* 4. date */}
            <fieldset ref={(n) => { panels.current[3] = n; }} className="m-0 flex min-h-[92svh] flex-col justify-center border-0 p-0 py-16">
              <p className="cc-q text-[1rem] text-[#C5A77B]">Step 4 of 4</p>
              <legend className="contents"><span className="cc-q c2-serif mt-3 block text-[clamp(2.2rem,4vw,3.6rem)] leading-tight">When would you like it?</span></legend>
              <div className="mt-9 grid max-w-[34rem] gap-7">
                <label className="cc-opt block">
                  <span className="text-[1rem] text-[#C5A77B]">Preferred date</span>
                  <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="c2-serif mt-2 block w-full rounded-2xl bg-[#1f4a43] px-5 py-4 text-[1.5rem] text-[#F7F3EC] [color-scheme:dark] focus:outline focus:outline-2 focus:outline-[#C5A77B]" />
                </label>
                <div className="cc-opt">
                  <span className="text-[1rem] text-[#C5A77B]">Time of day</span>
                  <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Time of day">
                    {TIMES.map((t, i) => (
                      <button key={t} type="button" role="radio" aria-checked={time === i} onClick={() => setTime(i)} className={`h-12 rounded-full px-6 transition-[background-color,color] duration-500 ${time === i ? 'bg-[#C5A77B] text-[#173B35]' : 'bg-[#1f4a43] hover:bg-[#28574f]'}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* review */}
            <div ref={(n) => { panels.current[4] = n; }} className="flex min-h-[80svh] flex-col justify-center pb-28 pt-10">
              <p className="cc-q text-[1rem] text-[#C5A77B]">All set</p>
              <h3 className="cc-q c2-serif mt-3 text-[clamp(2.2rem,4vw,3.6rem)] leading-tight">Your invitation is ready.</h3>
              <div className="cc-q mt-6 max-w-[40ch] text-[#F7F3EC]/85 lg:hidden">{sentence}</div>
              <p className="cc-q mt-6 max-w-[40ch] text-[1.1rem] leading-relaxed text-[#F7F3EC]/75">Send it to our concierge. The practice replies to confirm availability, eligibility and the details.</p>
              <button type="button" onClick={() => toast('Preview only: nothing was sent or booked.')} className="cc-q group mt-9 inline-flex h-16 w-fit items-center gap-3 rounded-full bg-[#C5A77B] pl-8 pr-2 text-[1.05rem] text-[#173B35] transition-colors hover:bg-[#d6bb92]">Request this experience <span className="grid h-12 w-12 place-items-center rounded-full bg-[#173B35] text-[#F7F3EC] transition-transform duration-500 group-hover:rotate-[-45deg]"><ArrowDown size={18} className="-rotate-90" /></span></button>
              <p className="cc-q mt-6 max-w-[46ch] text-[0.875rem] leading-snug text-[#F7F3EC]/55">Event inquiry only. Treatment eligibility, medical assessment, consent, supervision and venue suitability remain subject to the practice’s approval.</p>
            </div>
          </div>

          {/* the invitation that writes itself, held in view */}
          <div className="hidden lg:block">
            <div className="sticky top-[12vh] pb-16 [perspective:1400px]">
              {/* progress rail */}
              <ol className="mb-5 grid grid-cols-4 gap-2" aria-label="Progress">
                {STEPS.map((s, i) => (
                  <li key={s.k}>
                    <button type="button" onClick={() => scrollToEl(panels.current[i])} className="block w-full text-left">
                      <span className="block h-[3px] overflow-hidden rounded-full bg-[#F7F3EC]/15"><motion.span className="block h-full rounded-full bg-[#C5A77B]" animate={{ scaleX: active >= i || active === 4 ? 1 : 0 }} style={{ originX: 0 }} transition={{ duration: 0.6, ease }} /></span>
                      <span className={`mt-2 block text-[0.9rem] transition-colors ${active === i ? 'text-[#F7F3EC]' : 'text-[#F7F3EC]/50'}`}>{s.k}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <div className="cc-card relative overflow-hidden rounded-[0.7rem] bg-[#C5A77B] p-[6px] text-[#242424] shadow-[0_24px_40px_-28px_rgba(0,0,0,0.55)]">
                <div className="rounded-[0.5rem] bg-[#F7F3EC] p-3">
                  <div className="relative rounded-[0.35rem] bg-[#efe8db] px-8 py-10 text-center">
                    <AnimatePresence mode="wait">
                      <motion.div key={occ} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6, ease }} className="mx-auto mb-6 h-32 w-24 overflow-hidden rounded-t-full">
                        <img loading="lazy" decoding="async" src={OCC[occ].img} alt="" className="h-full w-full object-cover" />
                      </motion.div>
                    </AnimatePresence>
                    <p className="c2-serif text-[1.3rem] text-[#173B35]">The Varney private experience</p>
                    <div className="mt-5 text-[#242424]">{sentence}</div>
                    <div className="mx-auto my-6 h-[3px] w-16 rounded-full bg-[#C5A77B]" />
                    <p className="text-[0.9rem] text-[#242424]/60">Status: request pending confirmation</p>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-right text-[0.8125rem] text-[#F7F3EC]/45">Photographs: stock placeholders. Bridal photo: chuttersnap, CC0 (Wikimedia Commons).</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
