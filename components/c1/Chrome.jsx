'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Magnetic from './Magnetic';
import { go } from '@/lib/c1/util';

const LINKS = [
  ['About', '#perspective'],
  ['Services', '#care'],
  ['Experience', '#party'],
  ['Contact', '#cta'],
];

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last.current && y > 160 && !open);
      last.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  const click = (e, href) => { e.preventDefault(); setOpen(false); go(href); };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3">
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: hidden ? 0 : 0.2 }}
        className="pointer-events-auto w-full max-w-[1240px]"
      >
        <div className="glass flex items-center justify-between gap-6 rounded-full py-2.5 pl-6 pr-2.5 ring-1 ring-white/10">
          <a href="#hero" onClick={(e) => click(e, '#hero')} className="display text-[1.05rem] tracking-[0.04em]" aria-label="Varney Wellness, back to top">
            Varney <span className="text-ice">Wellness</span>
          </a>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-9">
              {LINKS.map(([label, href]) => (
                <li key={href}>
                  <a href={href} onClick={(e) => click(e, href)} className="group relative py-1 text-[0.95rem] font-medium text-cool transition-colors hover:text-white">
                    {label}
                    <span className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 rounded bg-ice transition-transform duration-500 group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <Magnetic strength={0.2} className="hidden sm:inline-block">
              <a href="#cta" onClick={(e) => click(e, '#cta')} className="btn btn-ice !min-h-[46px] !px-6">Book Consultation</a>
            </Magnetic>
            <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} className="btn btn-glass !min-h-[46px] !w-[46px] !p-0 md:hidden">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 90% 5%)' }}
            animate={{ clipPath: 'circle(150% at 90% 5%)' }}
            exit={{ clipPath: 'circle(0% at 90% 5%)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-navy px-[var(--m)]"
          >
            <ul className="grid gap-2">
              {[...LINKS, ['Book Consultation', '#cta']].map(([label, href], i) => (
                <motion.li key={label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }}>
                  <a href={href} onClick={(e) => click(e, href)} className="display block py-2 text-[11vw]">{label}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Soft cursor follower + vertical scroll progress. Cursor on desktop pointers only. */
export function CursorAndProgress() {
  const ring = useRef(null);
  const bar = useRef(null);
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => {
      const p = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (bar.current) bar.current.style.transform = `scaleY(${p.toFixed(4)})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (!fine) return () => window.removeEventListener('scroll', onScroll);

    const x = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3.out' });
    const y = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3.out' });
    const s = gsap.quickTo(ring.current, 'scale', { duration: 0.35, ease: 'power3.out' });
    const move = (e) => {
      x(e.clientX); y(e.clientY);
      ring.current.style.opacity = '1';
      s(e.target.closest?.('a,button,label,input,[data-cursor]') ? 2.1 : 1);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('pointermove', move); };
  }, []);

  return (
    <>
      <div ref={ring} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ice/20 opacity-0 mix-blend-screen ring-1 ring-ice/60 md:block" />
      <div aria-hidden="true" className="pointer-events-none fixed right-3 top-1/2 z-40 hidden h-28 w-[3px] -translate-y-1/2 overflow-hidden rounded bg-white/10 md:block">
        <div ref={bar} className="h-full w-full origin-top scale-y-0 bg-ice" />
      </div>
    </>
  );
}

export function Toast() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    let t;
    const on = (e) => { setMsg(e.detail); clearTimeout(t); t = setTimeout(() => setMsg(''), 3800); };
    window.addEventListener('c1-toast', on);
    return () => { window.removeEventListener('c1-toast', on); clearTimeout(t); };
  }, []);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
      <AnimatePresence>
        {msg && (
          <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="glass flex items-center gap-2 rounded-full px-6 py-3 text-[0.95rem] font-medium ring-1 ring-white/15">
            <ArrowUpRight size={16} className="text-ice" /> {msg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Always tells the visitor which chapter of the story they are in. */
export function ChapterLabel() {
  const [chapters, setChapters] = useState([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-chapter]')];
    const names = [];
    els.forEach((el) => { const n = el.dataset.chapter; if (!names.includes(n)) names.push(n); });
    setChapters(names);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(names.indexOf(e.target.dataset.chapter)); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  if (!chapters.length) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-5 left-[var(--m)] z-40 hidden items-center gap-3 rounded-full bg-navy/70 py-2 pl-4 pr-5 text-[0.85rem] font-bold backdrop-blur-md ring-1 ring-white/10 md:flex">
      <span className="flex gap-1.5">{chapters.map((n, i) => <i key={n} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-6 bg-ice' : 'w-1.5 bg-white/30'}`} />)}</span>
      <span className="text-ice">{String(active + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}</span>
      <span>{chapters[active]}</span>
    </div>
  );
}
