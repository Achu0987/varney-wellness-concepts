'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Cake, Gem, Users, Leaf, Briefcase, Sparkles, Building2, Home, MapPin, Compass, Check, Download, ChevronLeft, ChevronRight, PartyPopper } from 'lucide-react';
import { C3, makeStage } from './Crowd';

const Crowd = dynamic(() => import('./Crowd'), { ssr: false });
const ease = [0.16, 1, 0.3, 1];
const toast = (m) => window.dispatchEvent(new CustomEvent('c3-toast', { detail: m }));

const OCC = [
  { id: 'birthday', t: 'Birthday celebration', word: 'Birthday', icon: Cake },
  { id: 'bridal', t: 'Bridal or bachelorette', word: 'Bridal', icon: Gem },
  { id: 'friends', t: "Friends' gathering", word: 'Friends', icon: Users },
  { id: 'wellness', t: 'Private wellness event', word: 'Wellness', icon: Leaf },
  { id: 'corporate', t: 'Corporate event', word: 'Team', icon: Briefcase },
  { id: 'custom', t: 'Something else', word: 'Yours', icon: Sparkles },
];
const VENUES = [
  { id: 'clinic', t: 'At the clinic', note: 'if available', icon: Building2 },
  { id: 'home', t: 'Private residence', note: 'if approved', icon: Home },
  { id: 'venue', t: 'Private event venue', note: 'if approved', icon: MapPin },
  { id: 'other', t: 'Somewhere else', note: 'tell us where', icon: Compass },
];
const GUESTS = [{ t: '4–6', n: 5 }, { t: '7–10', n: 8 }, { t: '11–15', n: 13 }, { t: '16+', n: 18 }];
const TIMES = ['Morning', 'Afternoon', 'Evening'];
const INTERESTS = ['Botox consultation, if approved', 'General aesthetic consultation', 'Not sure yet'];
const STEPS = ['Occasion', 'Venue', 'Guests', 'Details', 'Review', 'Send'];

const STYLE = {
  none: { pal: [C3.cor, C3.lav, C3.off, C3.lav3, C3.cor, C3.lav] },
  birthday: { pal: [C3.cor, C3.lav, C3.off, C3.lav3], acc: () => 'hat' },
  bridal: { pal: [C3.lav, C3.lav3, C3.cor, C3.lav], acc: (i, n) => (i === Math.floor((n - 1) / 2) ? 'veil' : i % 2 ? 'flower' : null), lead: C3.off },
  friends: { pal: [C3.cor, C3.lav3, C3.off, C3.pur3, C3.lav], acc: (i) => (i % 2 ? 'shades' : null) },
  wellness: { pal: [C3.lav, C3.off, C3.lav3], acc: () => 'band' },
  corporate: { pal: [C3.pur3, C3.off, C3.lav3, C3.gra], acc: () => 'tie' },
  custom: { pal: [C3.cor, C3.lav, C3.lav3, C3.off], acc: () => 'spark' },
};

function crowdSpecs(occ, n) {
  const s = STYLE[occ] || STYLE.none;
  const two = n > 7;
  const back = two ? Math.floor(n / 2) : 0;
  const front = n - back;
  const out = [];
  const row = (count, z, lift, scale, offset) => {
    for (let i = 0; i < count; i++) {
      const idx = out.length;
      const span = count === 1 ? 0 : 0.76 - (count < 4 ? 0.3 : 0);
      const x = 0.5 - span / 2 + (count === 1 ? 0 : (i / (count - 1)) * span) + offset;
      const seed = (idx * 9301 + 49297) % 233280 / 233280;
      const leadIdx = Math.floor((front - 1) / 2);
      const isLead = z === 0 && i === leadIdx;
      out.push({
        key: `${occ}-${idx}`, x, z, lift, scale: scale * (0.9 + seed * 0.22), seed,
        color: isLead && s.lead ? s.lead : s.pal[idx % s.pal.length],
        acc: s.acc ? s.acc(z === 0 ? i : -1, z === 0 ? front : 0) : null,
        delay: idx * 0.045,
      });
    }
  };
  row(back, -260, 46, 0.8, 0.03);
  row(front, 0, 0, 1, 0);
  return out;
}

/* backdrops: one flat world per venue, drawn in the palette */
function Backdrop({ venue, occ }) {
  const word = OCC.find((o) => o.id === occ)?.word || 'Party';
  const scenes = {
    none: { wall: '#FF9C8A', floor: C3.cor, ink: '#FFB3A5' },
    clinic: { wall: C3.lav, floor: C3.off, ink: '#DCCEFA' },
    home: { wall: '#F6D3CB', floor: '#EBB9AD', ink: '#FBE2DC' },
    venue: { wall: C3.gra, floor: C3.pur, ink: '#3A3545' },
    other: { wall: '#DCCEFA', floor: C3.off, ink: '#CDBBF5' },
  };
  const sc = scenes[venue || 'none'];
  return (
    <AnimatePresence initial={false}>
      <motion.div key={venue || 'none'} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease }}>
        <svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <rect width="1000" height="620" fill={sc.wall} />
          <rect y="521" width="1000" height="99" fill={sc.floor} />
          {venue === 'clinic' && (
            <g>
              <rect x="590" y="90" width="300" height="300" rx="150" fill={C3.off} />
              <rect x="736" y="90" width="8" height="300" fill="#DCCEFA" />
              <rect x="590" y="236" width="300" height="8" fill="#DCCEFA" />
              <rect x="80" y="420" width="70" height="101" rx="10" fill={C3.lav3} />
              <ellipse cx="115" cy="400" rx="48" ry="40" fill="#8E7AC8" />
            </g>
          )}
          {venue === 'home' && (
            <g>
              <rect x="560" y="380" width="380" height="141" rx="40" fill={C3.pur3} />
              <rect x="540" y="350" width="60" height="171" rx="30" fill={C3.pur} />
              <rect x="900" y="350" width="60" height="171" rx="30" fill={C3.pur} />
              <rect x="790" y="140" width="6" height="240" fill={C3.gra} />
              <path d="M745 140 h96 l-20 -60 h-56 z" fill={C3.off} />
            </g>
          )}
          {venue === 'venue' && (
            <g>
              <path d="M200 0 L60 521 H360 Z" fill="#E9DFFF" opacity="0.13" />
              <path d="M500 0 L360 521 H660 Z" fill="#FF806B" opacity="0.14" />
              <path d="M800 0 L660 521 H960 Z" fill="#E9DFFF" opacity="0.13" />
              {Array.from({ length: 22 }).map((_, i) => (
                <circle key={i} cx={30 + i * 45} cy={60 + Math.sin(i * 0.7) * 18} r="6" fill={i % 3 ? C3.lav : C3.cor} />
              ))}
            </g>
          )}
          {venue === 'other' && (
            <g>
              <circle cx="760" cy="200" r="90" fill={C3.cor} />
              <ellipse cx="200" cy="560" rx="420" ry="150" fill={C3.lav3} />
              <ellipse cx="820" cy="580" rx="380" ry="120" fill="#CDBBF5" />
            </g>
          )}
        </svg>
        <p className="c3-display pointer-events-none absolute left-[5%] top-[7%] select-none whitespace-nowrap text-[14cqw]" style={{ color: sc.ink }} aria-hidden="true">{word}</p>
      </motion.div>
    </AnimatePresence>
  );
}

function Calendar({ value, alt, onPick, mode }) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const first = (view.getDay() + 6) % 7;
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const label = view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const same = (a, b) => a && b && a.toDateString() === b.toDateString();
  const canBack = view > new Date(today.getFullYear(), today.getMonth(), 1);
  return (
    <div className="rounded-[14px] bg-off p-4 text-gra">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" disabled={!canBack} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} className="grid h-10 w-10 place-items-center rounded-full hover:bg-lav disabled:opacity-30" aria-label="Previous month"><ChevronLeft size={18} /></button>
        <p className="font-medium" aria-live="polite">{label}</p>
        <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} className="grid h-10 w-10 place-items-center rounded-full hover:bg-lav" aria-label="Next month"><ChevronRight size={18} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[0.8125rem] text-[#5B5566]">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => <span key={d} className="py-1">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: first }).map((_, i) => <span key={`e${i}`} />)}
        {Array.from({ length: days }).map((_, i) => {
          const d = new Date(view.getFullYear(), view.getMonth(), i + 1);
          const past = d < today;
          const isV = same(d, value); const isA = same(d, alt);
          return (
            <button
              key={i} type="button" disabled={past} onClick={() => onPick(d)}
              aria-label={`${d.toDateString()}${isV ? ', preferred date' : ''}${isA ? ', alternative date' : ''}`}
              aria-pressed={isV || isA}
              className={`aspect-square rounded-full text-[0.9375rem] transition-[background-color,color,transform] duration-200 disabled:cursor-not-allowed disabled:opacity-30 ${isV ? 'bg-pur text-off' : isA ? 'bg-cor text-gra' : 'hover:bg-lav active:scale-95'}`}
            >{i + 1}</button>
          );
        })}
      </div>
      <p className="mt-3 text-[0.875rem] text-[#5B5566]">Now choosing: <strong className="font-medium text-gra">{mode === 'alt' ? 'an alternative date (optional)' : 'your preferred date'}</strong></p>
    </div>
  );
}

function Choice({ active, onClick, icon: Icon, title, note, big }) {
  return (
    <button
      type="button" onClick={onClick} aria-pressed={active}
      className={`group relative flex min-h-[64px] w-full items-center gap-4 rounded-[14px] px-4 py-4 text-left transition-[background-color,color,transform,box-shadow] duration-300 active:scale-[0.98] ${active ? 'bg-cor text-gra shadow-[0_14px_30px_-18px_rgba(255,128,107,0.9)]' : 'bg-pur-2 text-off hover:-translate-y-0.5 hover:bg-pur-3'} ${big ? 'md:min-h-[88px]' : ''}`}
    >
      {Icon && <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors ${active ? 'bg-gra text-cor' : 'bg-pur text-lav'}`}><Icon size={20} strokeWidth={1.8} /></span>}
      <span className="flex-1">
        <span className="block text-[1.0625rem] font-medium leading-tight">{title}</span>
        {note && <span className={`mt-0.5 block text-[0.875rem] ${active ? 'text-gra' : 'text-lav'}`}>{note}</span>}
      </span>
      <span className={`grid h-6 w-6 place-items-center rounded-full transition-[opacity,transform] duration-300 ${active ? 'scale-100 bg-gra text-cor opacity-100' : 'scale-50 opacity-0'}`}><Check size={14} strokeWidth={3} /></span>
    </button>
  );
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.9375rem] text-lav">{label}</label>
      {children}
      {error && <p id={`${id}-err`} className="mt-1.5 text-[0.875rem] text-cor-2" role="alert">{error}</p>}
    </div>
  );
}
const inputCls = 'w-full rounded-[12px] border-2 border-transparent bg-pur-2 px-4 py-3 text-[1.0625rem] text-off placeholder:text-lav-3 transition-[border-color,background-color] focus:border-cor focus:bg-pur-3 focus:outline-none aria-[invalid=true]:border-cor-2';

export default function Planner() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [occ, setOcc] = useState(null);
  const [venue, setVenue] = useState(null);
  const [guests, setGuests] = useState(null);
  const [date, setDate] = useState(null);
  const [alt, setAlt] = useState(null);
  const [mode, setMode] = useState('pref');
  const [time, setTime] = useState(null);
  const [interests, setInterests] = useState([]);
  const [requests, setRequests] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', area: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const stage = useMemo(() => makeStage({ floor: 0.84 }), []);
  const stageEl = useRef(null);
  const panelTop = useRef(null);

  const n = guests != null ? GUESTS[guests].n : 4;
  const specs = useMemo(() => crowdSpecs(occ || 'none', n), [occ, n]);

  useEffect(() => {
    const el = stageEl.current;
    if (!el) return undefined;
    const move = (e) => { const r = el.getBoundingClientRect(); stage.pointer.x = e.clientX - r.left; stage.pointer.y = e.clientY - r.top; stage.pointer.t = performance.now() / 1000; };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [stage]);

  const cheer = (count = 3) => { for (let i = 0; i < count; i++) stage.hops.push(Math.floor(Math.random() * Math.max(n, 4))); };
  const fmt = (d) => d?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const occT = OCC.find((o) => o.id === occ)?.t;
  const venueT = VENUES.find((v) => v.id === venue)?.t;

  const valid = [occ, venue, guests != null, date && time, true, true][step];
  const go = (to) => {
    setDir(to > step ? 1 : -1); setStep(to);
    const top = panelTop.current?.getBoundingClientRect().top;
    if (top != null && (top < 0 || top > window.innerHeight * 0.5)) {
      const y = window.scrollY + top - 90;
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1 }); else window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  const pickDate = (d) => {
    if (mode === 'pref') { setDate(d); setMode('alt'); cheer(2); } else { setAlt(d); }
  };
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.name.trim()) er.name = 'Please add your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = 'Please add an email we can reply to, like name@example.com.';
    if (form.phone && form.phone.replace(/\D/g, '').length < 7) er.phone = 'That number looks short. Check it, or leave it empty.';
    if (!form.area.trim()) er.area = 'Please add the city or area for the event.';
    setErrors(er);
    if (Object.keys(er).length) { document.getElementById(`pl-${Object.keys(er)[0]}`)?.focus(); return; }
    setDone(true);
    stage.celebrateAt = performance.now() / 1000;
  };
  const summaryText = () => [
    'YOUR PRIVATE VARNEY EXPERIENCE (event inquiry draft)', '',
    `Occasion: ${occT || '-'}`, `Guests: ${guests != null ? GUESTS[guests].t : '-'}`, `Location: ${venueT || '-'}`,
    `Preferred date: ${date ? date.toDateString() : '-'}`, `Alternative date: ${alt ? alt.toDateString() : '-'}`, `Time window: ${time || '-'}`,
    `Interests: ${interests.join(', ') || '-'}`, `Requests: ${requests || '-'}`, '', 'Status: request pending confirmation',
    'This is an event inquiry only. Treatment, medical assessment, consent, supervision and venue suitability are subject to the practice\'s approval. Not every guest may be suitable for treatment.',
  ].join('\n');
  const download = () => {
    const url = URL.createObjectURL(new Blob([summaryText()], { type: 'text/plain' }));
    const a = document.createElement('a'); a.href = url; a.download = 'varney-party-inquiry.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const reset = () => { setDone(false); setStep(0); setOcc(null); setVenue(null); setGuests(null); setDate(null); setAlt(null); setMode('pref'); setTime(null); setInterests([]); setRequests(''); setForm({ name: '', email: '', phone: '', area: '', notes: '' }); };

  const chips = [
    ['Occasion', occT], ['Guests', guests != null ? GUESTS[guests].t : null], ['Venue', venueT], ['Date', date ? fmt(date) : null],
  ];

  return (
    <section id="parties" className="relative bg-pur px-[var(--m)] pb-24 pt-24 text-off md:pb-32 md:pt-32">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="c3-display text-[clamp(2.6rem,7vw,6.5rem)]" data-reveal>Plan the party.</h2>
        <p className="c3-display mt-3 text-[clamp(1.5rem,3vw,2.6rem)] text-cor" data-reveal="0.05">We'll help with the details.</p>
        <p className="mt-6 max-w-[54ch] text-[clamp(1.0625rem,1rem+0.25vw,1.25rem)] text-lav" data-reveal="0.1">Host a private Botox party with Dr. Varney's team. Pick the occasion, the place and the people, and watch your party take shape. Six short steps, about two minutes.</p>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10">
          {/* the stage: venue backdrop + live crowd */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div ref={stageEl} className="relative aspect-[5/4] w-full overflow-hidden rounded-[20px] [container-type:inline-size] sm:aspect-[16/11]">
              <Backdrop venue={venue} occ={occ} />
              <Crowd specs={specs} stage={stage} unit={0.78} className="absolute inset-0" />
              <AnimatePresence>
                {done && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }} className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-off px-4 py-2 text-[0.9375rem] font-medium text-gra">
                    <PartyPopper size={16} /> Inquiry ready
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Your party so far">
              {chips.map(([k, v]) => (
                <li key={k} className={`rounded-[12px] px-3.5 py-3 transition-colors duration-500 ${v ? 'bg-lav text-gra' : 'bg-pur-2 text-lav'}`}>
                  <span className="block text-[0.8125rem]">{k}</span>
                  <span className="block truncate text-[1rem] font-medium">{v || 'Not chosen'}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* the builder */}
          <div ref={panelTop} className="rounded-[20px] bg-[#2B1854] p-5 sm:p-8">
            {!done ? (
              <>
                <ol className="flex gap-1.5" aria-label="Steps">
                  {STEPS.map((s, i) => (
                    <li key={s} className="flex-1">
                      <button type="button" disabled={i > step} onClick={() => go(i)} className="block w-full text-left disabled:cursor-default" aria-current={i === step ? 'step' : undefined}>
                        <span className="block h-1.5 overflow-hidden rounded-full bg-pur-2"><span className="block h-full origin-left rounded-full bg-cor transition-transform duration-500" style={{ transform: `scaleX(${i < step ? 1 : i === step ? 0.5 : 0})` }} /></span>
                        <span className={`mt-2 hidden text-[0.8125rem] sm:block ${i === step ? 'text-off' : 'text-lav-3'}`}>{s}</span>
                      </button>
                    </li>
                  ))}
                </ol>
                <div className="relative mt-8 min-h-[420px]">
                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.div
                      key={step} custom={dir}
                      initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }}
                      transition={{ duration: 0.45, ease }}
                    >
                      {step === 0 && (
                        <fieldset>
                          <legend className="c3-head mb-5 text-[clamp(1.6rem,2.6vw,2.25rem)]">What are we celebrating?</legend>
                          <div className="grid gap-2.5 sm:grid-cols-2">
                            {OCC.map((o) => <Choice key={o.id} active={occ === o.id} onClick={() => { setOcc(o.id); cheer(5); }} icon={o.icon} title={o.t} />)}
                          </div>
                        </fieldset>
                      )}
                      {step === 1 && (
                        <fieldset>
                          <legend className="c3-head mb-5 text-[clamp(1.6rem,2.6vw,2.25rem)]">Where would you like it?</legend>
                          <div className="grid gap-2.5">
                            {VENUES.map((v) => <Choice key={v.id} big active={venue === v.id} onClick={() => { setVenue(v.id); cheer(3); }} icon={v.icon} title={v.t} note={v.note} />)}
                          </div>
                          <p className="mt-4 text-[0.9375rem] text-lav">Every location is confirmed by the practice before anything is booked.</p>
                        </fieldset>
                      )}
                      {step === 2 && (
                        <fieldset>
                          <legend className="c3-head mb-5 text-[clamp(1.6rem,2.6vw,2.25rem)]">How many guests?</legend>
                          <div className="grid grid-cols-2 gap-2.5">
                            {GUESTS.map((g, i) => (
                              <button key={g.t} type="button" aria-pressed={guests === i} onClick={() => { setGuests(i); cheer(4); }}
                                className={`rounded-[14px] p-4 text-left transition-[background-color,color,transform] duration-300 active:scale-[0.98] ${guests === i ? 'bg-cor text-gra' : 'bg-pur-2 text-off hover:-translate-y-0.5 hover:bg-pur-3'}`}>
                                <span className="c3-display block text-[2.4rem]">{g.t}</span>
                                <span className="mt-1 block text-[0.9375rem]">guests</span>
                                <span className="mt-3 flex flex-wrap gap-1" aria-hidden="true">
                                  {Array.from({ length: Math.min(g.n, 18) }).map((_, k) => <span key={k} className={`h-3 w-2 rounded-full ${guests === i ? 'bg-gra' : 'bg-lav-3'}`} />)}
                                </span>
                              </button>
                            ))}
                          </div>
                          <p className="mt-4 text-[0.9375rem] text-lav">These are inquiry ranges, not confirmed minimums.</p>
                        </fieldset>
                      )}
                      {step === 3 && (
                        <fieldset className="space-y-5">
                          <legend className="c3-head mb-5 text-[clamp(1.6rem,2.6vw,2.25rem)]">When suits you?</legend>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setMode('pref')} aria-pressed={mode === 'pref'} className={`rounded-full px-4 py-2 text-[0.9375rem] transition-colors ${mode === 'pref' ? 'bg-off text-gra' : 'bg-pur-2 text-off hover:bg-pur-3'}`}>Preferred {date ? `: ${fmt(date)}` : ''}</button>
                            <button type="button" onClick={() => setMode('alt')} aria-pressed={mode === 'alt'} className={`rounded-full px-4 py-2 text-[0.9375rem] transition-colors ${mode === 'alt' ? 'bg-off text-gra' : 'bg-pur-2 text-off hover:bg-pur-3'}`}>Alternative {alt ? `: ${fmt(alt)}` : ''}</button>
                          </div>
                          <Calendar value={date} alt={alt} onPick={pickDate} mode={mode} />
                          <div>
                            <p className="mb-2 text-[0.9375rem] text-lav">Time window</p>
                            <div className="flex flex-wrap gap-2">
                              {TIMES.map((t) => <button key={t} type="button" aria-pressed={time === t} onClick={() => setTime(t)} className={`rounded-full px-5 py-2.5 text-[1rem] transition-colors ${time === t ? 'bg-cor text-gra' : 'bg-pur-2 text-off hover:bg-pur-3'}`}>{t}</button>)}
                            </div>
                          </div>
                          <div>
                            <p className="mb-2 text-[0.9375rem] text-lav">General interests (optional)</p>
                            <div className="flex flex-wrap gap-2">
                              {INTERESTS.map((t) => {
                                const on = interests.includes(t);
                                return <button key={t} type="button" aria-pressed={on} onClick={() => setInterests(on ? interests.filter((x) => x !== t) : [...interests, t])} className={`rounded-full px-4 py-2 text-[0.9375rem] transition-colors ${on ? 'bg-lav text-gra' : 'bg-pur-2 text-off hover:bg-pur-3'}`}>{t}</button>;
                              })}
                            </div>
                          </div>
                          <Field id="pl-req" label="Special requests (optional)">
                            <textarea id="pl-req" rows={2} value={requests} onChange={(e) => setRequests(e.target.value)} className={inputCls} placeholder="A theme, accessibility needs, anything we should know" />
                          </Field>
                          {!date || !time ? <p className="text-[0.9375rem] text-lav">Choose a preferred date and a time window to continue.</p> : null}
                        </fieldset>
                      )}
                      {step === 4 && (
                        <div>
                          <h3 className="c3-head mb-5 text-[clamp(1.6rem,2.6vw,2.25rem)]">Your private Varney experience</h3>
                          <dl className="overflow-hidden rounded-[14px] bg-off text-gra">
                            {[['Occasion', occT], ['Guests', GUESTS[guests]?.t], ['Location', venueT], ['Preferred date', date && date.toDateString()], ['Alternative date', alt ? alt.toDateString() : 'None'], ['Time window', time], ['Interests', interests.join(', ') || 'None yet'], ['Requests', requests || 'None']].map(([k, v], i) => (
                              <div key={k} className={`grid grid-cols-[9rem_minmax(0,1fr)] gap-3 px-5 py-3 ${i % 2 ? 'bg-lav' : ''}`}>
                                <dt className="text-[0.9375rem] text-[#5B5566]">{k}</dt><dd className="m-0 break-words font-medium">{v}</dd>
                              </div>
                            ))}
                            <div className="grid grid-cols-[9rem_minmax(0,1fr)] gap-3 bg-cor px-5 py-3"><dt className="text-[0.9375rem]">Status</dt><dd className="m-0 font-medium">Request pending confirmation</dd></div>
                          </dl>
                          <button type="button" onClick={download} className="mt-4 inline-flex items-center gap-2 rounded-full bg-pur-2 px-5 py-3 text-[0.9375rem] text-off transition-colors hover:bg-pur-3"><Download size={16} /> Download this summary</button>
                        </div>
                      )}
                      {step === 5 && (
                        <form id="pl-form" onSubmit={submit} noValidate className="space-y-4">
                          <h3 className="c3-head mb-2 text-[clamp(1.6rem,2.6vw,2.25rem)]">Where should we reply?</h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {[['name', 'Host name', 'text', 'name'], ['email', 'Email', 'email', 'email'], ['phone', 'Phone (optional)', 'tel', 'tel'], ['area', 'Event city or area', 'text', 'address-level2']].map(([k, l, type, ac]) => (
                              <Field key={k} id={`pl-${k}`} label={l} error={errors[k]}>
                                <input id={`pl-${k}`} type={type} autoComplete={ac} value={form[k]} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `pl-${k}-err` : undefined}
                                  onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={inputCls} />
                              </Field>
                            ))}
                          </div>
                          <p className="text-[0.9375rem] text-lav">{guests != null ? GUESTS[guests].t : ''} guests, {date ? fmt(date) : ''}, taken from your plan.</p>
                          <Field id="pl-notes" label="Anything else (optional)">
                            <textarea id="pl-notes" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputCls} />
                          </Field>
                          <p className="text-[0.875rem] leading-relaxed text-lav">Event inquiry only. Not every guest may be suitable for treatment. Medical assessment, consent, supervision and venue suitability are subject to the practice's approval. Demo: nothing is sent from this preview.</p>
                        </form>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <p className="sr-only" aria-live="polite">Step {step + 1} of 6, {STEPS[step]}</p>
                  <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="inline-flex min-h-[48px] items-center gap-2 rounded-full px-4 text-off transition-opacity hover:bg-pur-2 disabled:opacity-0"><ArrowLeft size={18} /> Back</button>
                  <span className="ml-auto text-[0.9375rem] text-lav-3" aria-hidden="true">{step + 1} of 6</span>
                  {step < 5 ? (
                    <button type="button" onClick={() => valid && go(step + 1)} aria-disabled={!valid} className={`inline-flex min-h-[52px] items-center gap-2 rounded-full px-7 font-medium transition-[background-color,color,transform] duration-300 ${valid ? 'bg-cor text-gra hover:-translate-y-0.5' : 'cursor-not-allowed bg-pur-2 text-lav-3'}`}>
                      {step === 4 ? 'Looks right' : 'Next'} <ArrowRight size={18} />
                    </button>
                  ) : (
                    <button type="submit" form="pl-form" className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-cor px-7 font-medium text-gra transition-transform hover:-translate-y-0.5">Send inquiry <ArrowRight size={18} /></button>
                  )}
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="flex min-h-[520px] flex-col justify-center" role="status">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-cor text-gra"><Check size={30} strokeWidth={2.5} /></span>
                <h3 className="c3-display mt-6 text-[clamp(2.2rem,4vw,3.6rem)]">Thank you, {form.name.split(' ')[0]}.</h3>
                <p className="mt-4 max-w-[44ch] text-[1.125rem] text-lav">Your {occT?.toLowerCase()} for {GUESTS[guests]?.t} guests is drafted. In the finished site, the practice would reply to {form.email} to talk it through. Nothing is booked until they confirm.</p>
                <p className="mt-3 text-[0.9375rem] text-lav-3">Preview only: no data left this page.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="button" onClick={download} className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-off px-6 font-medium text-gra"><Download size={16} /> Download summary</button>
                  <button type="button" onClick={reset} className="inline-flex min-h-[48px] items-center rounded-full bg-pur-2 px-6 text-off hover:bg-pur-3">Plan another</button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
