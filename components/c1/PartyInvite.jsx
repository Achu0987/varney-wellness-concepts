'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);
const ease = [0.22, 1, 0.36, 1];
const toast = (m) => window.dispatchEvent(new CustomEvent('vw-toast', { detail: m }));

const OCC = [
  { t: 'Birthday', img: '/images/p1.jpg' },
  { t: 'Bridal / Bachelorette', img: '/images/p2.jpg' },
  { t: "Friends' gathering", img: '/images/p3.jpg' },
  { t: 'Private wellness event', img: '/images/p4.jpg' },
];
const GUESTS = ['4–6', '7–10', '11–15', '16+'];
const VENUES = ['at the clinic', 'at a private residence', 'at an event venue'];
const VENUE_NOTE = ['if available', 'if approved', 'if approved'];

/** A word in the sentence that opens a small menu of choices. */
function Choice({ value, options, onPick, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc); };
  }, [open]);
  return (
    <span ref={ref} className={`relative inline-block align-baseline ${open ? "z-50" : "z-0"}`}>
      <button
        type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={`${label}: ${options[value]}`}
        onClick={() => setOpen((o) => !o)}
        className="group mx-1 inline-flex items-center gap-1.5 rounded-2xl bg-[linear-gradient(135deg,rgba(117,87,255,0.35),rgba(139,223,255,0.25))] px-3 py-0.5 text-white ring-1 ring-ice/50 transition-all duration-300 hover:ring-ice hover:shadow-[0_0_30px_rgba(139,223,255,0.45)]"
      >
        <AnimatePresence mode="wait">
          <motion.span key={value} initial={{ y: '60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-60%', opacity: 0 }} transition={{ duration: 0.3, ease }} className="inline-block">
            {options[value]}
          </motion.span>
        </AnimatePresence>
        <ChevronDown className={`h-[0.6em] w-[0.6em] text-ice transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox" aria-label={label}
            initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.25, ease }}
            className="absolute left-1 top-[calc(100%+0.4rem)] z-50 min-w-[15rem] rounded-2xl bg-[#111a3e] p-2 font-body text-[1rem] font-medium leading-normal tracking-normal shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/15 backdrop-blur-xl"
          >
            {options.map((o, i) => (
              <li key={o}>
                <button type="button" role="option" aria-selected={i === value} onClick={() => { onPick(i); setOpen(false); }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${i === value ? 'bg-violet/40 text-white' : 'text-white/80 hover:bg-white/10'}`}>
                  {o}{i === value && <Check size={16} className="text-ice" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </span>
  );
}

/**
 * Private Botox Parties as an invitation: scrolling breaks the seal, opens the envelope and
 * draws out a card. On the card, the plan is one sentence; each highlighted word is a choice.
 */
export default function PartyInvite() {
  const root = useRef(null);
  const [occ, setOcc] = useState(0);
  const [g, setG] = useState(1);
  const [v, setV] = useState(0);
  const [date, setDate] = useState('');
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const dateLabel = date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'a date you choose';

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      gsap.set(['.pi-env', '.pi-card'], { xPercent: -50, yPercent: -50 });
      if (reduced) {
        gsap.set('.pi-env', { autoAlpha: 0 });
        gsap.set('.pi-card', { autoAlpha: 1, scale: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root.current, start: 'top top', end: '+=260%', scrub: 0.8, pin: true, anticipatePin: 1 } });
      tl.fromTo('.pi-bg', { scale: 1.25 }, { scale: 1, duration: 3 }, 0)
        .fromTo('.pi-title', { y: 0, opacity: 1 }, { y: -60, opacity: 0, duration: 0.6 }, 1.0)
        .fromTo('.pi-env', { y: '60vh', rotateX: 35, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, 0)
        .to('.pi-seal', { scale: 1.3, duration: 0.15 }, 0.85)
        .to('.pi-seal', { scale: 0, opacity: 0, rotate: 90, duration: 0.25 }, 1.0)
        .to('.pi-flap', { rotateX: 180, duration: 0.5 }, 1.05)
        .set('.pi-flap', { zIndex: 1 }, 1.32)
        .fromTo('.pi-mini', { y: 0 }, { y: '-62%', duration: 0.5, ease: 'power2.out' }, 1.45)
        .to('.pi-env', { y: '70vh', opacity: 0, duration: 0.6, ease: 'power2.in' }, 1.95)
        .fromTo('.pi-card', { scale: 0.42, y: '-6vh', autoAlpha: 0 }, { scale: 1, y: 0, autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, 1.9)
        .fromTo('.pi-line', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.3 }, 2.35);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="party" ref={root} className="relative h-[100svh] overflow-hidden" style={{ perspective: 1600 }}>
      {/* the occasion's own photograph fills the room */}
      <div className="pi-bg absolute inset-0">
        <AnimatePresence>
          <motion.img key={occ} src={OCC[occ].img} alt="" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease }} className="absolute inset-0 h-full w-full object-cover" />
        </AnimatePresence>
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(8,14,32,0.45),rgba(8,14,32,0.92)_70%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,rgba(117,87,255,0.35),rgba(139,223,255,0.08))] mix-blend-soft-light" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {Array.from({ length: 26 }).map((_, i) => (
          <span key={i} className="pi-spark absolute rounded-full" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, width: 3 + (i % 4), height: 3 + (i % 4), background: i % 2 ? '#8BDFFF' : '#B9AEFF', animationDelay: `${(i % 7) * 0.7}s` }} />
        ))}
      </div>

      {/* title */}
      <div className="pi-title absolute inset-x-0 top-[9vh] z-10 px-[var(--m)] text-center">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[0.85rem] font-medium ring-1 ring-white/20 backdrop-blur"><span className="h-2 w-2 rounded-full bg-ice shadow-[0_0_10px_#8BDFFF]" />Private Botox Parties</p>
        <h2 className="h-gs mt-5 text-[clamp(2.4rem,5.6vw,5.6rem)] leading-[1.0]">Your people. Your occasion.<br /><span className="bg-[linear-gradient(100deg,#B9AEFF,#8BDFFF)] bg-clip-text text-transparent">Your private experience.</span></h2>
        <p className="mt-4 text-white/70">Scroll to open your invitation</p>
      </div>

      {/* the envelope */}
      <div className="pi-env absolute left-1/2 top-[58%] z-20 h-[min(21rem,52vw)] w-[min(32rem,80vw)]" style={{ transformStyle: 'preserve-3d' }} aria-hidden="true">
        <div className="absolute inset-0 rounded-[1.4rem] bg-[linear-gradient(160deg,#5b3fe6,#3a2aa8)] shadow-[0_50px_120px_-30px_rgba(117,87,255,0.9)]" />
        <div className="pi-mini absolute inset-x-[7%] top-[8%] z-[2] h-[84%] rounded-xl bg-[linear-gradient(160deg,#ffffff,#e8eeff)] p-[6%] shadow-xl">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-violet">You're invited</p>
          <p className="h-gs mt-2 text-[clamp(1rem,2vw,1.5rem)] text-navy">A private Varney experience</p>
        </div>
        <div className="absolute inset-0 z-[3] rounded-[1.4rem] bg-[linear-gradient(160deg,#6b52ff,#4a35c9)] [clip-path:polygon(0_0,50%_55%,100%_0,100%_100%,0_100%)]" />
        <div className="pi-flap absolute inset-x-0 top-0 z-[4] h-[60%] origin-top rounded-t-[1.4rem] bg-[linear-gradient(180deg,#7d68ff,#5b3fe6)] [clip-path:polygon(0_0,100%_0,50%_100%)]" style={{ transformStyle: 'preserve-3d' }} />
        <div className="pi-seal absolute left-1/2 top-[55%] z-[5] grid h-[4.2rem] w-[4.2rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#B9F0FF,#8BDFFF_45%,#3f9fd0)] shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_-4px_8px_rgba(0,0,0,0.2)]">
          <span className="h-gs text-[1.9rem] text-navy">V</span>
        </div>
      </div>

      {/* the card: the whole plan in one sentence */}
      <div className="pi-card invisible absolute left-1/2 top-1/2 z-30 w-[min(56rem,92vw)]">
        <div className="relative overflow-visible rounded-[2rem] bg-[linear-gradient(160deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] p-7 shadow-[0_60px_140px_-40px_rgba(117,87,255,0.9)] ring-1 ring-white/20 backdrop-blur-2xl md:p-12">
          <div className="pi-line flex flex-wrap items-center justify-between gap-3">
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.2em] text-ice">You're invited · Varney Wellness</p>
            <span className="rounded-full bg-ice/15 px-3 py-1 text-[0.8rem] font-semibold text-ice ring-1 ring-ice/30">Request pending confirmation</span>
          </div>
          <p className="pi-line h-gs mt-7 text-[clamp(1.6rem,3.3vw,3rem)] font-medium leading-[1.45] text-white">
            I'd love to host a
            <Choice label="Occasion" value={occ} options={OCC.map((o) => o.t)} onPick={setOcc} />
            for
            <Choice label="Guests" value={g} options={GUESTS} onPick={setG} />
            guests
            <Choice label="Setting" value={v} options={VENUES} onPick={setV} />
            on
            <label className="relative mx-1 inline-flex cursor-pointer items-center gap-1.5 rounded-2xl bg-[linear-gradient(135deg,rgba(117,87,255,0.35),rgba(139,223,255,0.25))] px-3 py-0.5 ring-1 ring-ice/50 transition-all hover:ring-ice hover:shadow-[0_0_30px_rgba(139,223,255,0.45)]">
              <span>{dateLabel}</span><ChevronDown className="h-[0.6em] w-[0.6em] text-ice" />
              <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} aria-label="Preferred date" className="absolute inset-0 cursor-pointer opacity-0" />
            </label>.
          </p>
          <p className="pi-line mt-4 text-[0.95rem] text-white/60">Tap any highlighted word to change it. Setting: {VENUES[v].replace('at ', '')}, {VENUE_NOTE[v]}.</p>
          <div className="pi-line mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <p className="max-w-[46ch] text-[0.8rem] leading-snug text-white/55">Event inquiry only. Treatment eligibility, medical assessment, consent, professional supervision and venue suitability remain subject to the practice's approval. Nothing is booked or sent in this preview.</p>
            <button type="button" onClick={() => toast('Preview only: nothing was sent or booked.')} className="group inline-flex h-14 items-center gap-3 rounded-full bg-white pl-2 pr-6 text-[1.02rem] font-semibold text-navy shadow-[0_20px_50px_-15px_rgba(139,223,255,0.8)] transition-transform hover:-translate-y-0.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#7557FF,#6f8dff)] text-white transition-transform group-hover:rotate-45"><ArrowUpRight size={18} /></span>
              Send my invitation
            </button>
          </div>
        </div>
        <p className="mt-3 text-right text-[0.72rem] text-white/45">Background photo: stock placeholder</p>
      </div>
    </section>
  );
}
