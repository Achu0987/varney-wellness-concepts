'use client';
import { A } from '@/lib/asset';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ArrowUpRight, Cake, Gem, Users, Flower2, Building2, Home, MapPin, Check, PencilLine, User } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);
const ease = [0.22, 1, 0.36, 1];
const spring = { type: 'spring', stiffness: 170, damping: 22 };
const toast = (m) => window.dispatchEvent(new CustomEvent('vw-toast', { detail: m }));

const OCC = [
  { t: 'Birthday', icon: Cake, img: A('/images/p1.jpg'), line: 'Raise a glass to another year.' },
  { t: 'Bridal / Bachelorette', icon: Gem, img: A('/images/p2.jpg'), line: 'Before the big day, together.' },
  { t: "Friends' gathering", icon: Users, img: A('/images/p3.jpg'), line: 'Your people, one afternoon.' },
  { t: 'Private wellness event', icon: Flower2, img: A('/images/p4.jpg'), line: 'A calm, private occasion.' },
];
const GUESTS = [['4–6', 5], ['7–10', 8], ['11–15', 12], ['16+', 16]];
const VENUES = [['At the clinic', 'if available', Building2], ['Private residence', 'if approved', Home], ['Event venue', 'if approved', MapPin]];
const STEPS = [
  { k: 'Occasion', title: 'Choose the occasion', body: 'Pick what you are celebrating. Tap a card to bring it forward.' },
  { k: 'Guests', title: 'Gather your people', body: 'Set the size of your circle and watch the table fill up.' },
  { k: 'Setting', title: 'Pick the setting', body: 'Choose where it happens. Every option is subject to the practice’s approval.' },
  { k: 'Invitation', title: 'Your invitation is ready', body: 'Review your private experience and send the inquiry. Nothing is booked yet.' },
];

/* the photo that travels: a card in step 1, the table in step 2, a thumbnail in the arch in step 3, the invitation header in step 4 */
function Table({ occ, className, round = true }) {
  return (
    <motion.div layoutId="vw-table" transition={spring} className={`overflow-hidden ${round ? 'rounded-full' : 'rounded-[1.4rem]'} ring-2 ring-ice/70 shadow-[0_0_60px_-10px_rgba(139,223,255,0.8)] ${className}`}>
      <img src={OCC[occ].img} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(117,87,255,0.35),rgba(139,223,255,0.1))]" />
    </motion.div>
  );
}

function Deck({ occ, setOcc }) {
  const fan = [[-235, 30, -15], [-80, 6, -5], [80, 6, 5], [235, 30, 15]];
  return (
    <div className="relative h-full w-full">
      {OCC.map((o, i) => {
        const on = occ === i;
        const [x, y, r] = fan[i];
        return (
          <motion.button
            key={o.t} type="button" onClick={() => setOcc(i)} aria-pressed={on} aria-label={o.t}
            initial={{ opacity: 0, y: 120, rotate: 0, x: 0 }}
            animate={{ opacity: 1, x, y: on ? y - 46 : y, rotate: on ? r * 0.4 : r, scale: on ? 1.08 : 1 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ ...spring, delay: i * 0.05 }}
            whileHover={{ y: (on ? y - 46 : y) - 14 }}
            className="absolute left-1/2 top-1/2 -ml-[8.5rem] -mt-[11.5rem] h-[23rem] w-[17rem] overflow-hidden rounded-[1.4rem] text-left shadow-2xl ring-1 ring-white/15 max-md:-ml-[5.5rem] max-md:-mt-[7.5rem] max-md:h-[15rem] max-md:w-[11rem]"
            style={{ zIndex: on ? 10 : i }}
          >
            {on ? <Table occ={i} round={false} className="absolute inset-0 !ring-0" /> : <img src={o.img} alt="" className="absolute inset-0 h-full w-full object-cover" />}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,14,32,0.9),rgba(8,14,32,0)_55%)]" />
            <span className="absolute inset-x-4 bottom-4 flex items-center gap-2 font-semibold text-white"><o.icon size={18} className="text-ice" />{o.t}</span>
            {on && <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-ice text-navy"><Check size={16} /></span>}
          </motion.button>
        );
      })}
    </div>
  );
}

function Circle({ occ, g, setG }) {
  const n = GUESTS[g][1];
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <div className="relative grid h-[min(28rem,62vw)] w-[min(28rem,62vw)] place-items-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease }} className="absolute inset-0 rounded-full border border-dashed border-ice/30" />
        <Table occ={occ} className="relative h-[44%] w-[44%]" />
        {Array.from({ length: n }).map((_, k) => {
          const a = (k / n) * Math.PI * 2 - Math.PI / 2;
          return (
            <motion.span
              key={`${g}-${k}`}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={{ x: `${Math.cos(a) * 400}%`, y: `${Math.sin(a) * 400}%`, scale: 1, opacity: 1 }}
              transition={{ ...spring, delay: 0.15 + k * 0.04 }}
              className="absolute grid h-[11%] w-[11%] place-items-center rounded-full bg-[linear-gradient(135deg,#B9AEFF,#8BDFFF)] text-navy shadow-[0_0_20px_rgba(139,223,255,0.7)]"
            >
              <User size="55%" />
            </motion.span>
          );
        })}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Guest count">
        {GUESTS.map(([t], i) => (
          <button key={t} type="button" role="radio" aria-checked={g === i} onClick={() => setG(i)} className={`h-11 rounded-full px-5 font-semibold transition-all duration-300 ${g === i ? 'bg-ice text-navy shadow-[0_10px_30px_-10px_rgba(139,223,255,0.9)]' : 'bg-white/[0.07] text-white ring-1 ring-white/15 hover:bg-white/15'}`}>{t} guests</button>
        ))}
      </div>
    </div>
  );
}

function Arches({ occ, v, setV }) {
  return (
    <div className="flex h-full w-full items-center justify-center gap-[3%] px-2">
      {VENUES.map(([t, s, Icon], i) => {
        const on = v === i;
        return (
          <motion.button
            key={t} type="button" onClick={() => setV(i)} aria-pressed={on}
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: on ? -14 : 0, scale: on ? 1.05 : 0.96 }} transition={{ ...spring, delay: i * 0.08 }}
            className={`relative flex h-[min(26rem,58vw)] w-[30%] max-w-[15rem] flex-col items-center justify-end overflow-hidden rounded-t-full rounded-b-[1.2rem] p-4 pb-5 text-center transition-colors duration-500 ${on ? 'bg-[linear-gradient(180deg,rgba(139,223,255,0.35),rgba(117,87,255,0.45))] ring-2 ring-ice shadow-[0_0_80px_-10px_rgba(139,223,255,0.7)]' : 'bg-white/[0.05] ring-1 ring-white/15 hover:bg-white/10'}`}
          >
            <div className="absolute top-[22%] grid w-full place-items-center">{on ? <Table occ={occ} className="relative h-[min(7rem,16vw)] w-[min(7rem,16vw)]" /> : <Icon size={34} className="text-ice/70" />}</div>
            <Icon size={18} className={on ? 'text-white' : 'text-ice'} />
            <span className="mt-2 text-[0.95rem] font-semibold leading-tight text-white">{t}</span>
            <span className="text-[0.78rem] text-white/60">{s}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function Invitation({ occ, g, v, onEdit }) {
  return (
    <div className="flex h-full w-full items-center justify-center" style={{ perspective: 1400 }}>
      <motion.div
        initial={{ rotateY: -95, opacity: 0, y: 30 }} animate={{ rotateY: 0, opacity: 1, y: 0 }} transition={{ duration: 1.1, ease }}
        className="w-[min(30rem,88vw)] overflow-hidden rounded-[1.8rem] bg-[#0f1838] shadow-[0_40px_120px_-30px_rgba(117,87,255,0.8)] ring-1 ring-white/15"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative h-40">
          <Table occ={occ} round={false} className="absolute inset-0 !rounded-none !ring-0 !shadow-none" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,#0f1838,rgba(15,24,56,0)_70%)]" />
          <p className="absolute left-6 top-5 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-white/85">You're invited</p>
        </div>
        <div className="p-6 pt-2">
          <h3 className="h-gs text-[1.9rem] leading-tight">Your private Varney experience</h3>
          <p className="mt-1 text-white/60">{OCC[occ].line}</p>
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl bg-white/[0.04] p-4 text-[0.95rem] ring-1 ring-white/10">
            <div><dt className="text-white/45">Occasion</dt><dd className="font-semibold">{OCC[occ].t}</dd></div>
            <div><dt className="text-white/45">Guests</dt><dd className="font-semibold">{GUESTS[g][0]}</dd></div>
            <div><dt className="text-white/45">Setting</dt><dd className="font-semibold">{VENUES[v][0]}</dd></div>
            <div><dt className="text-white/45">Status</dt><dd className="font-semibold text-ice">Pending confirmation</dd></div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => toast('Preview only: nothing was sent or booked.')} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#7557FF,#6f8dff)] px-5 font-semibold text-white shadow-[0_14px_30px_-12px_rgba(117,87,255,0.9)]">Send inquiry <ArrowUpRight size={17} /></button>
            <button type="button" onClick={onEdit} className="inline-flex h-12 items-center gap-2 rounded-full px-5 font-semibold text-white ring-1 ring-white/25 hover:bg-white/10"><PencilLine size={16} />Edit</button>
          </div>
          <p className="mt-4 text-[0.75rem] leading-snug text-white/45">Event inquiry only. Treatment eligibility, medical assessment, consent, supervision and venue suitability remain subject to the practice's approval.</p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Private Botox Parties, told as you scroll: the section holds still while four steps
 * assemble the party. One photo travels the whole way (card, table, arch, invitation).
 * Every step is also clickable, and the rail jumps straight to a step.
 */
export default function PartyStory() {
  const root = useRef(null);
  const st = useRef(null);
  const fillRef = useRef(null);
  const [step, setStep] = useState(0);
  const [occ, setOcc] = useState(0);
  const [g, setG] = useState(1);
  const [v, setV] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      gsap.from('.ps-intro > *', { y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.ps-intro', start: 'top 80%' } });
      if (reduced) return;
      st.current = ScrollTrigger.create({
        trigger: '.ps-stage', start: 'top top', end: '+=320%', pin: true, anticipatePin: 1,
        onUpdate: (self) => {
          setStep(Math.min(3, Math.floor(self.progress * 4 * 0.999)));
          if (fillRef.current) fillRef.current.style.transform = `scaleY(${self.progress.toFixed(4)})`;
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const jump = (i) => {
    const t = st.current;
    if (!t) { setStep(i); return; }
    const y = t.start + (t.end - t.start) * ((i + 0.5) / 4);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 }); else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const glow = ['rgba(117,87,255,0.45)', 'rgba(139,223,255,0.35)', 'rgba(185,174,255,0.4)', 'rgba(117,87,255,0.5)'][step];
  const chips = [OCC[occ].t, `${GUESTS[g][0]} guests`, VENUES[v][0]];

  return (
    <section id="party" ref={root} className="relative">
      <div className="ps-intro px-[var(--m)] pb-10 pt-24 md:pt-32">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-[0.85rem] font-medium ring-1 ring-white/10"><span className="h-2 w-2 rounded-full bg-ice shadow-[0_0_10px_#8BDFFF]" />Private Botox Parties</p>
        <h2 className="h-gs mt-6 text-[clamp(2.4rem,5.4vw,5.4rem)] leading-[1.02]">Your people. Your occasion.<br /><span className="bg-[linear-gradient(100deg,#B9AEFF,#8BDFFF)] bg-clip-text text-transparent">Your private experience.</span></h2>
        <p className="mt-5 max-w-[46ch] text-[1.08rem] text-white/65">Scroll to plan a private gathering in four simple steps. It is a homepage preview: nothing is booked or sent.</p>
      </div>

      <div className="ps-stage relative grid h-[100svh] gap-8 overflow-hidden px-[var(--m)] py-[5vh] md:grid-cols-[0.78fr_1.22fr] md:items-center">
        <motion.div aria-hidden="true" className="pointer-events-none absolute right-[8%] top-1/2 h-[50vw] w-[50vw] -translate-y-1/2 rounded-full blur-[150px]" animate={{ backgroundColor: glow }} transition={{ duration: 0.9 }} />

        {/* left: big number, plain words, a timeline that fills as you scroll */}
        <div className="relative z-10 max-md:pt-8">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.span key={step} aria-hidden="true" initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease }}
                className="h-gs pointer-events-none absolute -left-1 -top-[0.42em] select-none bg-[linear-gradient(180deg,rgba(139,223,255,0.28),rgba(117,87,255,0))] bg-clip-text text-[clamp(7rem,13vw,12rem)] leading-none text-transparent">
                0{step + 1}
              </motion.span>
            </AnimatePresence>
            <p className="relative inline-flex items-center gap-2 rounded-full bg-ice/15 px-3 py-1 text-[0.85rem] font-semibold text-ice ring-1 ring-ice/30">Step {step + 1} of 4 · {STEPS[step].k}</p>
            <div className="relative mt-4 min-h-[8.5rem] md:min-h-[10.5rem]">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }} transition={{ duration: 0.5, ease }}>
                  <h3 className="h-gs text-[clamp(2.1rem,4vw,3.8rem)] leading-[1.0]">{STEPS[step].title}</h3>
                  <p className="mt-4 max-w-[34ch] text-[1.08rem] text-white/70">{STEPS[step].body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <ol className="relative mt-6 max-w-[24rem] max-md:hidden">
            <span aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 w-[2px] rounded-full bg-white/10" />
            <span aria-hidden="true" ref={fillRef} className="absolute bottom-6 left-[19px] top-6 w-[2px] origin-top scale-y-0 rounded-full bg-[linear-gradient(180deg,#8BDFFF,#7557FF)] shadow-[0_0_12px_rgba(139,223,255,0.8)]" />
            {STEPS.map((s2, i) => {
              const on = i === step;
              const done = i < step;
              return (
                <li key={s2.k} className="relative">
                  <button type="button" onClick={() => jump(i)} className="group flex w-full items-center gap-4 py-2.5 text-left">
                    <span className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full text-[0.9rem] font-bold transition-all duration-500 ${done ? 'bg-ice text-navy' : on ? 'scale-110 bg-violet text-white shadow-[0_0_0_6px_rgba(117,87,255,0.25),0_0_30px_rgba(117,87,255,0.8)]' : 'bg-[#141c40] text-white/45 ring-1 ring-white/15'}`}>
                      {done ? <Check size={17} /> : i + 1}
                    </span>
                    <span className={`flex-1 rounded-2xl px-4 py-3 transition-all duration-500 ${on ? 'bg-white/[0.08] ring-1 ring-ice/35' : 'group-hover:bg-white/[0.04]'}`}>
                      <span className={`block font-semibold transition-colors ${on ? 'text-white' : done ? 'text-white/80' : 'text-white/45'}`}>{s2.k}</span>
                      {i < 3 && <span className={`block text-[0.85rem] ${done || on ? 'text-ice' : 'text-white/35'}`}>{done || on ? chips[i] : 'Waiting'}</span>}
                      {i === 3 && <span className={`block text-[0.85rem] ${on ? 'text-ice' : 'text-white/35'}`}>{on ? 'Ready to send' : 'Last step'}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-5 flex gap-1.5 md:hidden">{STEPS.map((s2, i) => <i key={s2.k} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-ice' : 'bg-white/15'}`} />)}</div>
        </div>

        {/* right: a glass stage where the party assembles */}
        <div className="relative z-10 h-[58svh] overflow-hidden rounded-[2.2rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(117,87,255,0.28),rgba(13,21,51,0.55)_55%,rgba(8,14,32,0.7))] ring-1 ring-white/10 backdrop-blur-sm md:h-[82svh]">
          <div aria-hidden="true" className="absolute inset-x-[12%] bottom-[6%] h-[18%] rounded-[50%] bg-[radial-gradient(ellipse,rgba(139,223,255,0.28),rgba(139,223,255,0)_70%)] blur-md" />
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px]" />

          {/* your party so far */}
          <div className="absolute inset-x-5 top-5 z-20 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-white/50">Your party</span>
            <AnimatePresence>
              {chips.slice(0, Math.min(step + 1, 3)).map((c) => (
                <motion.span key={c} layout initial={{ opacity: 0, scale: 0.6, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.6 }} transition={spring}
                  className="rounded-full bg-white/[0.1] px-3 py-1.5 text-[0.85rem] font-medium text-white ring-1 ring-white/20 backdrop-blur">
                  {c}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          <div className="absolute inset-0 top-14">
            <LayoutGroup>
              <AnimatePresence mode="popLayout">
                {step === 0 && <motion.div key="deck" className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><Deck occ={occ} setOcc={setOcc} /></motion.div>}
                {step === 1 && <motion.div key="circle" className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><Circle occ={occ} g={g} setG={setG} /></motion.div>}
                {step === 2 && <motion.div key="arch" className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><Arches occ={occ} v={v} setV={setV} /></motion.div>}
                {step === 3 && <motion.div key="inv" className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><Invitation occ={occ} g={g} v={v} onEdit={() => jump(0)} /></motion.div>}
              </AnimatePresence>
            </LayoutGroup>
          </div>

          <div className="absolute inset-x-5 bottom-4 z-20 flex items-center justify-between text-[0.8rem] text-white/50">
            <span>{step < 3 ? 'Tap to choose, or keep scrolling' : 'Ready when you are'}</span>
            <span>Photos: stock placeholders</span>
          </div>
        </div>
      </div>
    </section>
  );
}
