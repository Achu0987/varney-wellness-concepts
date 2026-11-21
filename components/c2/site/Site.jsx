'use client';
import { A } from '@/lib/asset';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { LEGAL } from './legal';

gsap.registerPlugin(ScrollTrigger);
export const ease = [0.22, 1, 0.36, 1];
export const IVORY = '#F7F3EC';
export const R = (p = '') => `/concept-2${p}`;

export const NAV = [
  ['The Club', R('/the-club')],
  ['Services', R('/services')],
  ['Private Parties', R('/private-parties')],
  ['Dr. Varney', R('/dr-varney')],
  ['Your Visit', R('/your-visit')],
];
const FOOT = [
  ['Explore', [['Home', R()], ['The Club', R('/the-club')], ['Dr. Varney', R('/dr-varney')], ['Services', R('/services')], ['Private Parties', R('/private-parties')]]],
  ['Visit', [['Your Visit', R('/your-visit')], ['Contact', R('/contact')], ['Questions', R('/contact#questions')]]],
  ['Legal', [['Privacy', 'legal:privacy'], ['Terms', 'legal:terms'], ['Medical disclaimer', 'legal:medical-disclaimer']]],
];

export function go(e, href) {
  const el = document.querySelector(href);
  if (!el) return;
  e?.preventDefault();
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.6, offset: -40 }); else el.scrollIntoView({ behavior: 'smooth' });
}
export const toast = (m) => window.dispatchEvent(new CustomEvent('c2-toast', { detail: m }));

/* the one button: a forest or ivory pill with the gold disc that turns on hover */
export function Pill({ href, children, tone = 'forest', className = '', onClick }) {
  const t = tone === 'ivory'
    ? 'bg-[#F7F3EC] text-[#173B35] hover:bg-white'
    : tone === 'gold' ? 'bg-[#C5A77B] text-[#173B35] hover:bg-[#d6bb92]' : 'bg-[#173B35] text-[#F7F3EC] hover:bg-[#0f2a25]';
  const disc = tone === 'gold' ? 'bg-[#173B35] text-[#F7F3EC]' : 'bg-[#C5A77B] text-[#173B35]';
  const inner = (
    <>
      {children}
      <span className={`grid h-10 w-10 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45 ${disc}`}><ArrowUpRight size={18} /></span>
    </>
  );
  const cls = `group inline-flex h-14 items-center gap-3 rounded-full pl-7 pr-2 text-[1rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A77B] ${t} ${className}`;
  if (href?.startsWith('#')) return <a href={href} onClick={(e) => { onClick?.(e); go(e, href); }} className={cls}>{inner}</a>;
  return <Link href={href} className={cls} onClick={onClick}>{inner}</Link>;
}

/* a quiet text link with the gold underline */
export function TextLink({ href, children, light = false, className = '' }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 py-1 text-[1rem] ${light ? 'text-[#F7F3EC]' : 'text-[#173B35]'} ${className}`}>
      <span className="relative">{children}<span className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[#C5A77B] transition-transform duration-500 group-hover:scale-x-[0.4]" /></span> {/* taste-skill-ignore: link underline / sticky bar / overlay / photo scrim */}
      <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
    </Link>
  );
}

/* ------------------------------------------------------------------ header */
export function Nav({ light = false }) {
  const path = usePathname()?.replace(/\/$/, '') || '';
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [shown, setShown] = useState(true);
  useEffect(() => {
    if (!window.__c2Loading) return undefined;
    setShown(false);
    const on = () => setShown(true);
    window.addEventListener('c2-entered', on, { once: true });
    return () => window.removeEventListener('c2-entered', on);
  }, []);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 60);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const lt = light && !solid;
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[var(--m)] transition-[background-color,color,padding,box-shadow] duration-500 ${solid ? 'bg-[#F7F3EC] py-3.5 shadow-[0_10px_30px_-20px_rgba(23,59,53,0.35)]' : 'py-5'} ${lt ? 'text-[#F7F3EC]' : 'text-[#173B35]'}`}> {/* taste-skill-ignore: link underline / sticky bar / overlay / photo scrim */}
        <Link href={R()} className="leading-none" aria-label="Varney Wellness, home">
          <span data-brand className="c2-serif text-[1.65rem] transition-opacity duration-300" style={{ opacity: shown ? 1 : 0 }}>Varney Wellness</span>
        </Link>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className={`flex gap-8 text-[0.95rem] ${lt ? 'text-[#F7F3EC]' : 'text-[#242424]'}`}>
            {NAV.map(([l, h]) => {
              const on = path === h || path.startsWith(`${h}/`);
              return (
                <li key={h}>
                  <Link href={h} aria-current={on ? 'page' : undefined} className="group relative py-1 transition-colors hover:text-[#C5A77B]">
                    {l}<span className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[#C5A77B] transition-transform duration-500 group-hover:scale-x-100 ${on ? 'scale-x-100' : 'scale-x-0'}`} /> {/* taste-skill-ignore: link underline / sticky bar / overlay / photo scrim */}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link href={R('/contact')} className={`hidden h-11 items-center rounded-full border px-6 text-[0.95rem] transition-colors sm:inline-flex ${lt ? 'border-[#F7F3EC] hover:bg-[#F7F3EC] hover:text-[#173B35]' : 'border-[#173B35] hover:bg-[#173B35] hover:text-[#F7F3EC]'}`}>Book a Consultation</Link>
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className={`grid h-11 w-11 place-items-center rounded-full lg:hidden ${lt ? 'bg-[#F7F3EC] text-[#173B35]' : 'bg-[#173B35] text-[#F7F3EC]'}`}><Menu size={18} /></button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div role="dialog" aria-modal="true" aria-label="Menu" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[#173B35] px-[var(--m)] py-6 text-[#F7F3EC]">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#F7F3EC]/30"><X size={18} /></button>
            <ul className="mt-10 grid gap-2">
              {[['Home', R()], ...NAV, ['Contact', R('/contact')]].map(([l, h], i) => (
                <motion.li key={h} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06, duration: 0.7, ease }}>
                  <Link href={h} onClick={() => setOpen(false)} className="c2-serif block text-[clamp(2.4rem,10vw,4rem)] leading-[1.1]">{l}</Link>
                </motion.li>
              ))}
            </ul>
            <Link href={R('/contact')} onClick={() => setOpen(false)} className="mt-auto inline-flex h-14 w-fit items-center rounded-full bg-[#C5A77B] px-8 pt-px text-[#173B35]">Book a Consultation</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ footer: the homepage close, with the site's pages */
export function Footer({ id }) {
  const [msg, setMsg] = useState('');
  return (
    <footer id={id} className="relative overflow-hidden bg-[#173B35] px-[var(--m)] pb-6 pt-16 text-[#F7F3EC] md:pt-20">
      <div className="mx-auto grid max-w-[1360px] gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p data-reveal className="c2-serif max-w-[18ch] text-[clamp(2.2rem,3.8vw,3.6rem)] leading-[1.02]">Your next chapter begins quietly.</p>
          <Pill href={R('/contact')} tone="gold" className="mt-8">Book a Consultation</Pill>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); const v = e.currentTarget.elements.email.value; setMsg(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? 'Thank you. This is a preview, so nothing was stored.' : 'Please enter a valid email address.'); }} className="self-end" noValidate data-reveal="0.15">
          <p className="c2-serif text-[1.6rem]">The Varney Letter</p>
          <p className="mt-2 text-[#F7F3EC]/75">Occasional notes on wellbeing. Subscription preview only.</p>
          <div className="mt-6 flex items-center gap-3">
            <label htmlFor={`c2-email-${id || 'f'}`} className="sr-only">Email</label>
            <input id={`c2-email-${id || 'f'}`} name="email" type="email" placeholder="Your email address" className="min-w-0 flex-1 border-0 border-b border-[#C5A77B]/60 bg-transparent py-3 text-[1.1rem] text-[#F7F3EC] placeholder:text-[#F7F3EC]/55 focus:border-[#C5A77B] focus:outline-none" />
            <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#F7F3EC] text-[#173B35] transition-transform hover:rotate-45" aria-label="Subscribe"><ArrowUpRight size={18} /></button>
          </div>
          <p className="mt-3 min-h-[1.5em] text-[0.95rem] text-[#C5A77B]" role="status">{msg}</p>
        </form>
      </div>
      <nav aria-label="Footer" className="mx-auto mt-12 grid max-w-[1360px] gap-8 sm:grid-cols-3 sm:gap-10" data-reveal="0.1">
        {FOOT.map(([h, items]) => (
          <div key={h}>
            <p className="c2-serif text-[1.35rem] text-[#C5A77B]">{h}</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[1rem]">
              {items.map(([l, href]) => <li key={href}>{href.startsWith('legal:') ? <button type="button" onClick={() => openLegal(href.slice(6))} className="text-left text-[#F7F3EC]/85 transition-colors hover:text-[#C5A77B]">{l}</button> : <Link href={href} className="text-[#F7F3EC]/85 transition-colors hover:text-[#C5A77B]">{l}</Link>}</li>)}
            </ul>
          </div>
        ))}
      </nav>
      <p className="c2-serif mx-auto mt-10 max-w-[1360px] select-none text-center text-[clamp(3rem,9vw,8.5rem)] leading-[0.8] tracking-[0.06em] text-[#F7F3EC]/[0.07]" aria-hidden="true">VARNEY</p>
      <LegalSheet />
    </footer>
  );
}

export function Toast() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    let t;
    const on = (e) => { setMsg(e.detail); clearTimeout(t); t = setTimeout(() => setMsg(''), 3600); };
    window.addEventListener('c2-toast', on);
    return () => window.removeEventListener('c2-toast', on);
  }, []);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
      <AnimatePresence>{msg && <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="rounded-full bg-[#173B35] px-6 py-3 text-[0.95rem] text-[#F7F3EC] shadow-xl">{msg}</motion.p>}</AnimatePresence> {/* taste-skill-ignore: link underline / sticky bar / overlay / photo scrim */}
    </div>
  );
}

/* smooth scroll + section entrances, shared by every page */
export function useSmooth() {
  useEffect(() => {
    document.documentElement.style.background = IVORY;
    document.body.style.background = IVORY;
    document.body.style.color = '#242424';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis; let tick;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.14, smoothWheel: true });
      if (window.__c2Loading) lenis.stop();
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    const rctx = reduced ? null : gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: Number(el.dataset.reveal) || 0, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 1200);
    const hash = window.location.hash;
    const th = hash.length > 1 ? setTimeout(() => { const el = document.querySelector(hash); if (!el) return; if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.4 }); else el.scrollIntoView(); }, 700) : null;
    return () => { clearTimeout(t); if (th) clearTimeout(th); rctx?.revert(); if (tick) gsap.ticker.remove(tick); lenis?.destroy(); window.__lenis = null; };
  }, []);
}

export function Shell({ children, light = false }) {
  useSmooth();
  return (
    <div className="c2 min-h-[100svh] bg-[#F7F3EC]">
      <a href="#main" className="skip">Skip to content</a>
      <Nav light={light} />
      <main id="main">{children}</main>
      <Footer />
      <Toast />
    </div>
  );
}

/* ------------------------------------------------------------------ the page opening: one photograph, the name low along its edge */
export function PageHero({ img, alt, title, lead, action, pos = '50% 50%', size = 'lg' }) {
  const root = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.ph-img', { scale: 1.12 }, { scale: 1, duration: 2.2, ease: 'power3.out' });
      gsap.fromTo('.ph-in', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, stagger: 0.1, ease: 'power3.out', delay: 0.15 });
      gsap.to('.ph-par', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);
  const ts = size === 'lg' ? 'text-[clamp(3.6rem,12.5vw,12rem)]' : 'text-[clamp(3rem,8.4vw,8.6rem)]';
  return (
    <section ref={root} className="bg-[#F7F3EC] p-[8px] md:p-[10px]">
      <div className="relative h-[calc(100svh-16px)] min-h-[560px] overflow-hidden rounded-[12px] md:h-[calc(100svh-20px)]">
        <div className="ph-par absolute inset-0 will-change-transform">
          <img src={img} alt={alt} className="ph-img h-full w-full object-cover" style={{ objectPosition: pos }} fetchPriority="high" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-[linear-gradient(0deg,rgba(0,0,0,0.78),rgba(0,0,0,0.35)_45%,rgba(0,0,0,0))]" /> {/* taste-skill-ignore: link underline / sticky bar / overlay / photo scrim */}
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0))]" /> {/* taste-skill-ignore: link underline / sticky bar / overlay / photo scrim */}
        <div className="absolute inset-x-[calc(var(--m)-8px)] bottom-7 grid gap-8 text-[#F7F3EC] md:bottom-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-14">
          <h1 className={`ph-in c2-serif max-w-[12ch] leading-[0.9] [text-wrap:balance] ${ts}`}>{title}</h1>
          <div className="ph-in lg:pb-4">
            <p className="max-w-[34ch] text-[1.125rem] leading-relaxed text-[#F7F3EC]">{lead}</p>
            {action && <Pill href={action.href} tone="ivory" className="mt-6">{action.label}</Pill>}
          </div>
        </div>
      </div>
    </section>
  );
}

/* closing invitation used at the foot of every inner page */
export function Closing({ title = 'Begin with a conversation.', text = 'A first consultation is where every plan starts. Tell us a little about yourself and the practice will be in touch.', img = A('/c2/towel.jpg'), alt = 'A woman in soft natural light (stock photo)', second }) {
  return (
    <section className="bg-[#EFE8DC] px-[var(--m)] py-24 md:py-32">
      <div className="mx-auto grid max-w-[1360px] items-center gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-20">
        <div>
          <h2 data-reveal className="c2-serif max-w-[14ch] text-[clamp(2.6rem,5.4vw,5.4rem)] leading-[0.98] text-[#173B35]">{title}</h2>
          <p data-reveal="0.1" className="mt-6 max-w-[44ch] text-[1.125rem] leading-relaxed text-[#242424]">{text}</p>
          <div data-reveal="0.2" className="mt-9 flex flex-wrap items-center gap-6">
            <Pill href={R('/contact')}>Book a Consultation</Pill>
            {second && <TextLink href={second.href}>{second.label}</TextLink>}
          </div>
        </div>
        <div data-reveal="0.15" className="mx-auto w-[min(100%,26rem)]">
          <div className="aspect-[3/4] overflow-hidden rounded-t-full"><img src={img} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" /></div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ legal: a sheet that slides in over the page, so the reader never leaves it */
export const openLegal = (k) => window.dispatchEvent(new CustomEvent('c2-legal', { detail: k }));
export function LegalSheet() {
  const [k, setK] = useState(null);
  const panel = useRef(null);
  const opener = useRef(null);
  useEffect(() => {
    const on = (e) => { opener.current = document.activeElement; setK(e.detail); };
    window.addEventListener('c2-legal', on);
    return () => window.removeEventListener('c2-legal', on);
  }, []);
  useEffect(() => {
    if (!k) return undefined;
    window.__lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(() => panel.current?.querySelector('h2')?.focus(), 60);
    const key = (e) => {
      if (e.key === 'Escape') setK(null);
      if (e.key === 'Tab' && panel.current) {
        const f = [...panel.current.querySelectorAll('button, a[href]')];
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    };
    window.addEventListener('keydown', key);
    return () => { clearTimeout(t); window.removeEventListener('keydown', key); document.documentElement.style.overflow = prev; window.__lenis?.start(); opener.current?.focus?.(); };
  }, [k]);
  const d = k ? LEGAL[k] : null;
  return (
    <AnimatePresence>
      {d && (
        <motion.div key="legal" className="fixed inset-0 z-[90] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <button type="button" aria-label="Close" onClick={() => setK(null)} className="absolute inset-0 cursor-default bg-[#0b1f1b]/55" />
          <motion.div ref={panel} role="dialog" aria-modal="true" aria-labelledby="legal-h" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="relative flex h-full w-full max-w-[44rem] flex-col overflow-y-auto overscroll-contain bg-[#F7F3EC] px-7 pb-16 pt-6 text-[#242424] md:px-14" data-lenis-prevent>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Legal">
                {Object.entries(LEGAL).map(([key, v]) => (
                  <button key={key} type="button" role="tab" aria-selected={key === k} onClick={() => setK(key)} className={`min-h-[44px] rounded-full px-4 text-[0.95rem] transition-colors ${key === k ? 'bg-[#173B35] text-[#F7F3EC]' : 'bg-[#EFE8DC] text-[#173B35] hover:bg-[#e4dccd]'}`}>{v.t}</button>
                ))}
              </div>
              <button type="button" onClick={() => setK(null)} aria-label="Close" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#173B35] text-[#F7F3EC]"><X size={18} /></button>
            </div>
            <AnimatePresence mode="wait">
              <motion.article key={k} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease }} className="mt-12">
                <h2 id="legal-h" tabIndex={-1} className="c2-serif text-[clamp(2.6rem,6vw,4.4rem)] leading-[0.95] text-[#173B35] focus:outline-none">{d.t}</h2>
                <p className="mt-5 max-w-[42ch] text-[1.125rem] leading-relaxed">{d.lead}</p>
                <p className="mt-5 inline-block rounded-[12px] bg-[#EFE8DC] px-4 py-2.5 text-[0.95rem] text-[#173B35]">Draft outline. Final text to be written and reviewed by the practice’s legal adviser.</p>
                <div className="mt-12 grid gap-10">
                  {d.s.map(([h, p]) => (
                    <section key={h}>
                      <h3 className="c2-serif text-[1.75rem] leading-[1.1] text-[#173B35]">{h}</h3>
                      <p className="mt-3 max-w-[60ch] text-[1.0625rem] leading-[1.65]">{p}</p>
                    </section>
                  ))}
                </div>
              </motion.article>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
