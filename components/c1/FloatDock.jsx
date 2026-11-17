'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, CalendarCheck, PartyPopper, X } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

function scrollToTarget(href) {
  const el = href === '#top' ? 0 : document.querySelector(href);
  if (window.__lenis) window.__lenis.scrollTo(el ?? 0, { duration: 1.6, offset: -10 });
  else if (el) el.scrollIntoView({ behavior: 'smooth' });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
const toast = (m) => window.dispatchEvent(new CustomEvent('vw-toast', { detail: m }));

const ACTIONS = [
  { icon: CalendarCheck, t: 'Book a consultation', d: 'Start with Dr. Varney', run: () => toast('Consultation booking is not part of this concept preview.') },
  { icon: PartyPopper, t: 'Plan a private party', d: 'Botox party inquiry', run: () => scrollToTarget('#party') },
  { icon: ArrowUp, t: 'Back to top', d: 'Return to the start', run: () => scrollToTarget('#top') },
];

/** Bottom-right booking button that opens three quick actions; appears once the hero is scrolled past. */
export default function FloatDock() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const wrap = useRef(null);

  useEffect(() => {
    const on = () => {
      const hero = document.getElementById('top');
      const vis = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.5 : window.scrollY > window.innerHeight;
      setShow(vis);
      if (!vis) setOpen(false);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const key = (e) => { if (e.key === 'Escape') setOpen(false); };
    const out = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    window.addEventListener('keydown', key);
    window.addEventListener('pointerdown', out);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', out); };
  }, [open]);

  return (
    <motion.div
      ref={wrap}
      initial={false} animate={show ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 30 }} transition={{ duration: 0.6, ease }}
      style={{ pointerEvents: show ? 'auto' : 'none' }} aria-hidden={!show} inert={show ? undefined : ''}
      className="fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3 md:bottom-6 md:right-6"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            id="dock-menu" role="menu" aria-label="Quick actions"
            initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.35, ease }}
            className="w-[min(19rem,calc(100vw-2rem))] origin-bottom-right rounded-[1.6rem] bg-paper p-2.5 shadow-[0_30px_60px_-30px_rgb(var(--c-ink)/0.5)] ring-1 ring-white/10"
          >
            <p className="px-3 pb-2 pt-2 text-[0.9375rem] font-semibold text-white">How can we help?</p>
            {ACTIONS.map((a, i) => (
              <motion.button
                key={a.t} type="button" role="menuitem"
                initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease, delay: 0.06 + i * 0.06 }}
                onClick={() => { setOpen(false); a.run(); }}
                className="group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors duration-300 hover:bg-navy-3 focus-visible:bg-navy-3 active:translate-y-px"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-deep text-white transition-transform duration-300 group-hover:-rotate-6"><a.icon size={19} /></span>
                <span className="leading-tight">
                  <span className="block text-[1rem] font-semibold text-white">{a.t}</span>
                  <span className="block text-[0.875rem] text-white/60">{a.d}</span>
                </span>
              </motion.button>
            ))}
            <p className="px-3 pb-1.5 pt-2 text-[0.8125rem] text-white/55">Concept preview: nothing is sent or booked.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button" onClick={() => setOpen((v) => !v)}
        aria-expanded={open} aria-controls="dock-menu" aria-label={open ? 'Close quick actions' : 'Open quick actions'}
        className="group inline-flex h-14 items-center gap-3 rounded-full bg-violet-deep pl-2 pr-6 text-[1rem] font-semibold text-white shadow-[0_16px_36px_-14px_rgb(7_76_55/0.6)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-violet-mid active:translate-y-0"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-paper text-violet-deep">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={open ? 'x' : 'cal'} initial={{ opacity: 0, rotate: -45, scale: 0.6 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 45, scale: 0.6 }} transition={{ duration: 0.25, ease }} className="grid place-items-center">
              {open ? <X size={18} /> : <CalendarCheck size={18} />}
            </motion.span>
          </AnimatePresence>
        </span>
        {open ? 'Close' : 'Book a visit'}
      </button>
    </motion.div>
  );
}
