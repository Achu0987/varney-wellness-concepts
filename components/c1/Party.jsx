'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { Cake, Gem, Users, Flower2, Check } from 'lucide-react';
import Magnetic from './Magnetic';
import { toast } from '@/lib/c1/util';
import { OCCASIONS, TIERS } from './PartyScene';

gsap.registerPlugin(ScrollTrigger);
const PartyScene = dynamic(() => import('./PartyScene'), { ssr: false });

const ICONS = { birthday: Cake, bridal: Gem, friends: Users, wellness: Flower2 };

export default function Party() {
  const root = useRef(null);
  const [occasion, setOccasion] = useState('birthday');
  const [tier, setTier] = useState(1);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 820px)').matches || window.matchMedia('(pointer: coarse)').matches);
    const ctx = gsap.context(() => {
      gsap.from('.party-line', { yPercent: 115, duration: 1.15, ease: 'power4.out', stagger: 0.12, scrollTrigger: { trigger: root.current, start: 'top 65%', once: true } });
      gsap.from('.party-in', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.party-grid', start: 'top 80%', once: true } });
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.to('.party-glow', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  const o = OCCASIONS[occasion];

  return (
    <section id="party" data-chapter="Private events" ref={root} aria-labelledby="party-title" className="relative overflow-hidden bg-[#0a1128] px-[var(--m)] py-[14vh]">
      <div aria-hidden="true" className="party-glow pointer-events-none absolute -right-[10%] top-[10%] h-[60vw] w-[60vw] rounded-full bg-violet/25 blur-[140px]" />
      <div className="relative mx-auto max-w-[1500px]">
        <h2 id="party-title" className="display text-[clamp(1.9rem,5.2vw,6rem)]">
          {['Your people.', 'Your occasion.', 'Your private experience.'].map((l, i) => (
            <span key={l} className="mask-line"><span className={`party-line block ${i === 2 ? 'text-ice' : ''}`}>{l}</span></span>
          ))}
        </h2>
        <p className="mt-6 max-w-[52ch] text-[clamp(1.05rem,1.4vw,1.3rem)] text-cool">
          Plan a private gathering with Dr. Varney's team. Pick the occasion, set the size of your circle, and watch the experience take shape. This is a homepage preview: nothing is booked or sent.
        </p>

        <div className="party-grid mt-14 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <div className="party-in relative min-h-[26rem] overflow-hidden rounded-[2rem] ring-1 ring-white/10 lg:min-h-[38rem]">
            <PartyScene occasion={occasion} tier={tier} mobile={mobile} />
            <p className="absolute bottom-5 left-6 rounded-full bg-navy/70 px-4 py-2 text-[0.9rem] font-medium text-ice" aria-live="polite">
              {o.label} · {TIERS[tier].label} guests
            </p>
          </div>

          <div className="party-in glass flex flex-col gap-7 rounded-[2rem] p-6 md:p-8">
            <fieldset>
              <legend className="mb-3 text-[0.95rem] font-bold text-cool">Choose the occasion</legend>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Occasion">
                {Object.entries(OCCASIONS).map(([key, val]) => {
                  const Icon = ICONS[key];
                  const on = occasion === key;
                  return (
                    <button
                      key={key} type="button" role="radio" aria-checked={on} onClick={() => setOccasion(key)}
                      className={`group relative flex min-h-[5.5rem] flex-col items-start justify-between rounded-2xl p-4 text-left transition-all duration-500 ${on ? 'bg-ice text-navy' : 'bg-white/6 text-white hover:bg-white/12'}`}
                    >
                      <Icon size={22} className={on ? 'text-navy' : 'text-ice'} />
                      <span className="text-[0.95rem] font-bold leading-tight">{val.label}</span>
                      {on && <Check size={16} className="absolute right-3 top-3" />}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-[0.95rem] font-bold text-cool">How many guests?</legend>
              <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Guest count">
                {TIERS.map((t, i) => (
                  <button
                    key={t.label} type="button" role="radio" aria-checked={tier === i} onClick={() => setTier(i)}
                    className={`flex min-h-[4.2rem] flex-col items-center justify-center rounded-2xl px-1 text-center transition-all duration-500 ${tier === i ? 'bg-violet text-white shadow-[0_0_40px_rgba(117,87,255,0.6)]' : 'bg-white/6 hover:bg-white/12'}`}
                  >
                    <span className="display !text-[1.15rem]">{t.label}</span>
                    <span className="text-[0.72rem] text-white/60">guests</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="rounded-2xl bg-navy/70 p-5" aria-live="polite">
              <h3 className="display !text-[1.15rem] text-ice">Your private Varney experience</h3>
              <AnimatePresence mode="wait">
                <motion.dl key={`${occasion}-${tier}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-3 grid gap-2 text-[0.95rem]">
                  <div className="flex justify-between gap-4"><dt className="text-cool">Occasion</dt><dd className="font-bold">{o.label}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-cool">Guests</dt><dd className="font-bold">{TIERS[tier].label}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-cool">Venue</dt><dd className="font-bold">To be confirmed</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-cool">Status</dt><dd className="font-bold">Request pending confirmation</dd></div>
                </motion.dl>
              </AnimatePresence>
            </div>

            <Magnetic className="self-start">
              <button type="button" onClick={() => toast('Preview only: nothing was sent or booked.')} className="btn btn-violet">Start your event inquiry</button>
            </Magnetic>
            <p className="text-[0.82rem] leading-snug text-white/60">
              Event inquiry only. Treatment eligibility, medical assessment, consent, professional supervision and venue suitability remain subject to the practice's approval.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
