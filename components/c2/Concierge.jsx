'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Home, MapPin, Check, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);
const ease = [0.22, 1, 0.36, 1];
const toast = (m) => window.dispatchEvent(new CustomEvent('c2-toast', { detail: m }));

const OCC = [
  { t: 'Bridal gathering', short: 'a bridal gathering', img: '/images/p2.jpg' },
  { t: 'Birthday celebration', short: 'a birthday celebration', img: '/images/p1.jpg' },
  { t: 'Private wellness evening', short: 'a private wellness evening', img: '/c2/bath.jpg' },
  { t: "Friends' gathering", short: 'a gathering of friends', img: '/images/p3.jpg' },
  { t: 'Custom celebration', short: 'a custom celebration', img: '/c2/eucalyptus.jpg' },
];
const GUESTS = [['4–6', 5], ['7–10', 8], ['11–15', 12], ['16+', 16]];
const VENUES = [
  { t: 'At the clinic', note: 'if available', icon: Building2, phrase: 'at the Varney clinic' },
  { t: 'Private residence', note: 'if approved', icon: Home, phrase: 'at a private residence' },
  { t: 'Private event venue', note: 'if approved', icon: MapPin, phrase: 'at a private event venue' },
];
const TIMES = ['Morning', 'Afternoon', 'Evening'];

/** A seated table, drawn in gold: one place setting per guest. */
function Table({ n }) {
  return (
    <svg viewBox="0 0 200 200" className="h-40 w-40" aria-hidden="true">
      <ellipse cx="100" cy="100" rx="58" ry="40" fill="none" stroke="#C5A77B" strokeWidth="1.5" />
      <ellipse cx="100" cy="100" rx="50" ry="33" fill="rgba(197,167,123,0.08)" />
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

/**
 * Private Botox Parties as a concierge: four quiet questions on the left, and an engraved
 * invitation on the right that writes itself as you answer. Event inquiry only.
 */
export default function Concierge() {
  const root = useRef(null);
  const [step, setStep] = useState(0);
  const [occ, setOcc] = useState(0);
  const [g, setG] = useState(1);
  const [v, setV] = useState(0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState(1);
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const dateText = date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'a date of your choosing';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cc-line', { yPercent: 110, duration: 1.3, ease: 'power4.out', stagger: 0.12, scrollTrigger: { trigger: root.current, start: 'top 70%' } });
      gsap.from('.cc-in', { y: 50, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.cc-grid', start: 'top 80%' } });
    }, root);
    return () => ctx.revert();
  }, []);

  const steps = ['The occasion', 'Your guests', 'The setting', 'The date'];

  return (
    <section id="parties" ref={root} className="relative overflow-hidden bg-[#173B35] px-[var(--m)] py-28 text-[#F7F3EC] md:py-36">
      <img src="/c2/shadow3.jpg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07] mix-blend-screen" />
      <div className="relative mx-auto max-w-[1360px]">
        <h2 className="c2-serif text-[clamp(1.9rem,5.6vw,5.8rem)] leading-[1.0]">
          {['Your people. Your occasion.', 'Your private experience.'].map((l) => (
            <span key={l} className="block overflow-hidden pb-[0.06em]"><span className="cc-line block">{l}</span></span>
          ))}
        </h2>
        <p className="cc-in mt-6 max-w-[48ch] text-[1.1rem] leading-relaxed text-[#F7F3EC]/75">Private Botox Parties, planned with our concierge. Tell us what you have in mind: Your invitation takes shape as you choose, and the practice replies to confirm what is possible.</p>

        <div className="cc-grid mt-16 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* the questions */}
          <div className="cc-in">
            <ol className="flex flex-wrap gap-x-8 gap-y-3 rounded-full bg-[#1f4a43] px-6 py-4" aria-label="Steps">
              {steps.map((s, i) => (
                <li key={s}>
                  <button type="button" onClick={() => setStep(i)} className={`group flex items-baseline gap-2 transition-colors ${i === step ? 'text-[#F7F3EC]' : 'text-[#F7F3EC]/45 hover:text-[#F7F3EC]/80'}`}>
                    <span className="text-[0.95rem]">{s}</span>
                  </button>
                  <motion.span className="mt-2 block h-[3px] rounded-full bg-[#C5A77B]" animate={{ scaleX: i === step ? 1 : 0 }} style={{ originX: 0 }} transition={{ duration: 0.6, ease }} />
                </li>
              ))}
            </ol>

            <div className="mt-10 min-h-[26rem]">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.55, ease }}>
                  {step === 0 && (
                    <fieldset className="m-0 border-0 p-0">
                      <legend className="c2-serif text-[2rem]">What are we celebrating?</legend>
                      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5" role="radiogroup">
                        {OCC.map((o, i) => (
                          <button key={o.t} type="button" role="radio" aria-checked={occ === i} onClick={() => setOcc(i)} className="group text-left">
                            <span className={`relative block aspect-[3/4] overflow-hidden rounded-t-full transition-all duration-700 ${occ === i ? 'outline outline-2 outline-offset-4 outline-[#C5A77B]' : 'opacity-75 hover:opacity-100'}`}>
                              <img src={o.img} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                              <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.5),rgba(0,0,0,0)_55%)]" />
                              {occ === i && <span className="absolute right-3 top-[38%] grid h-7 w-7 place-items-center rounded-full bg-[#C5A77B] text-[#173B35]"><Check size={14} /></span>}
                            </span>
                            <span className={`mt-3 block text-[0.95rem] leading-tight ${occ === i ? 'text-[#F7F3EC]' : 'text-[#F7F3EC]/65'}`}>{o.t}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  )}
                  {step === 1 && (
                    <fieldset className="m-0 border-0 p-0">
                      <legend className="c2-serif text-[2rem]">How many will join you?</legend>
                      <div className="mt-8 flex flex-col items-start gap-8 sm:flex-row sm:items-center">
                        <Table n={GUESTS[g][1]} />
                        <div className="grid grid-cols-2 gap-3" role="radiogroup">
                          {GUESTS.map(([t], i) => (
                            <button key={t} type="button" role="radio" aria-checked={g === i} onClick={() => setG(i)} className={`h-16 min-w-[8.5rem] rounded-full px-6 transition-all duration-500 ${g === i ? 'bg-[#C5A77B] text-[#173B35]' : 'bg-[#1f4a43] text-[#F7F3EC] hover:bg-[#28574f]'}`}>
                              <span className="c2-serif text-[1.4rem]">{t}</span> <span className="text-[0.85rem] opacity-80">guests</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="mt-6 text-[0.85rem] text-[#F7F3EC]/50">Proposed ranges, not confirmed minimums.</p>
                    </fieldset>
                  )}
                  {step === 2 && (
                    <fieldset className="m-0 border-0 p-0">
                      <legend className="c2-serif text-[2rem]">Where shall we gather?</legend>
                      <div className="mt-6 grid gap-4 sm:grid-cols-3" role="radiogroup">
                        {VENUES.map((ve, i) => (
                          <button key={ve.t} type="button" role="radio" aria-checked={v === i} onClick={() => setV(i)}
                            className={`flex h-64 flex-col items-center justify-end rounded-t-full p-6 pb-8 text-center transition-all duration-500 ${v === i ? 'bg-[#F7F3EC] text-[#173B35]' : 'bg-[#1f4a43] hover:bg-[#28574f]'}`}>
                            <ve.icon size={26} strokeWidth={1.4} className={v === i ? 'text-[#173B35]' : 'text-[#C5A77B]'} />
                            <span className="c2-serif mt-4 text-[1.35rem] leading-tight">{ve.t}</span>
                            <span className="mt-1 text-[0.85rem] opacity-70">{ve.note}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  )}
                  {step === 3 && (
                    <fieldset className="m-0 border-0 p-0">
                      <legend className="c2-serif text-[2rem]">When would you like it?</legend>
                      <div className="mt-8 grid max-w-[34rem] gap-6">
                        <label className="block">
                          <span className="text-[1rem] text-[#C5A77B]">Preferred date</span>
                          <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="c2-serif mt-2 block w-full border-0 border-b border-[#F7F3EC]/30 bg-transparent py-3 text-[1.6rem] text-[#F7F3EC] [color-scheme:dark] focus:border-[#C5A77B] focus:outline-none" />
                        </label>
                        <div>
                          <span className="text-[1rem] text-[#C5A77B]">Time of day</span>
                          <div className="mt-3 flex gap-3" role="radiogroup">
                            {TIMES.map((t, i) => (
                              <button key={t} type="button" role="radio" aria-checked={time === i} onClick={() => setTime(i)} className={`h-12 rounded-full px-6 transition-all duration-500 ${time === i ? 'bg-[#C5A77B] text-[#173B35]' : 'bg-[#1f4a43] hover:bg-[#28574f]'}`}>{t}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center gap-4">
              {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="h-12 rounded-full bg-[#1f4a43] px-6 hover:bg-[#28574f]">Back</button>}
              {step < 3 && <button type="button" onClick={() => setStep(step + 1)} className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#F7F3EC] px-7 text-[#173B35]">Continue <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button>}
            </div>
          </div>

          {/* the invitation that writes itself */}
          <div className="cc-in lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-[0.6rem] bg-[#C5A77B] p-[6px] text-[#242424]">
              <div className="rounded-[0.4rem] bg-[#F7F3EC] p-3">
                <div className="relative rounded-[0.3rem] bg-[#efe8db] px-7 py-9 text-center md:px-10">
                  <AnimatePresence mode="wait">
                    <motion.div key={occ} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="mx-auto mb-6 h-24 w-20 overflow-hidden rounded-t-full">
                      <img src={OCC[occ].img} alt="" className="h-full w-full object-cover" />
                    </motion.div>
                  </AnimatePresence>
                  <p className="c2-serif text-[1.25rem] text-[#173B35]">The Varney private experience</p>
                  <p className="c2-serif mt-5 text-[clamp(1.35rem,1.9vw,1.7rem)] leading-[1.4]">
                    Hosting
                    {' '}<Swap k={occ}>{OCC[occ].short}</Swap>
                    {' '}for <Swap k={g}>{GUESTS[g][0]}</Swap> guests,
                    {' '}<Swap k={v}>{VENUES[v].phrase}</Swap>,
                    {' '}on <Swap k={date + time}>{dateText}, in the {TIMES[time].toLowerCase()}</Swap>.
                  </p>
                  <div className="mx-auto my-6 h-[3px] w-16 rounded-full bg-[#C5A77B]" />
                  <p className="text-[0.85rem] text-[#242424]/60">Status: request pending confirmation</p>
                  <button type="button" onClick={() => toast('Preview only: nothing was sent or booked.')} className="mt-7 inline-flex h-12 items-center rounded-full bg-[#173B35] px-8 text-[#F7F3EC] transition-colors hover:bg-[#0f2a25]">Request this experience</button>
                  <p className="mx-auto mt-6 max-w-[34ch] text-[0.8125rem] leading-snug text-[#242424]/55">Event inquiry only. Treatment eligibility, medical assessment, consent, supervision and venue suitability remain subject to the practice's approval.</p>
                </div>
              </div>
            </div>
            <p className="mt-3 text-right text-[0.8125rem] text-[#F7F3EC]/40">Photographs: stock placeholders</p>
          </div>
        </div>
      </div>
    </section>
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
