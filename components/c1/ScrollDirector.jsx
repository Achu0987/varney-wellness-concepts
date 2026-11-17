'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { S, KEYS } from '@/lib/c1/state';

gsap.registerPlugin(ScrollTrigger);

/**
 * Owns smooth scrolling (Lenis) and the "director": scroll position writes the
 * camera/sculpture state S, which the R3F rig damps every frame.
 */
export default function ScrollDirector() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-aspect-ratio: 23/20)').matches;
    S.reduced = reduced;

    let lenis;
    let tick;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // ---- keyframes -------------------------------------------------------
    const gx = wide ? 2.6 : 0; // sculpture x (right of the copy on desktop)
    const up = 0;
    const view = (o) => {
      const base = { sx: gx, sy: 0, rot: -0.55, scale: 1, xray: 0, glow: 1, flood: 0, cy: 1.9, cz: 9.2, ly: 1.75, lz: 0 };
      const k = { ...base, ...o };
      k.cx = k.sx;
      k.lx = k.sx - (wide ? 0.22 * k.cz : 0);
      if (!wide) k.ly -= 0.21 * k.cz; // phone: look below the bust so it sits in the upper half, copy below
      return k;
    };
    const K = {
      hero: view(wide ? {} : { scale: 0.75, cz: 12 }),
      intro: view({ rot: -0.3, cz: 9.4, ...(wide ? {} : { scale: 0.85, cz: 11 }) }),
      profile: view({ cz: wide ? 6.8 : 12.5, cy: 2.4, ly: 2.5, rot: -1.7, xray: 0.7, glow: 1.2, sy: up }),
      heart: view({ cz: wide ? 4.6 : 7.2, cy: 2.8, ly: 2.7, rot: -0.75, xray: 1, glow: 1.9, sy: up }),
      back: view({ cz: wide ? 7.5 : 11, cy: 2.4, ly: 2.2, rot: -3.3, xray: 0.5, glow: 1.2, sy: up }),
      care: view({ sx: wide ? -gx * 1.6 : 0, cz: 12.5, scale: 0.7, rot: -0.5, xray: 0.1, glow: 0.5, sy: 0 }),
      cta: view({ cz: 9.0, cy: 0.5, ly: 2.2, rot: -0.35, scale: 1.05, xray: 0.2, glow: 1.7, flood: 1, ...(wide ? {} : { cz: 11 }) }),
    };
    KEYS.forEach((k) => { S[k] = K.hero[k]; });

    const seg = (from, to, st) =>
      gsap.fromTo(S, { ...from }, { ...to, ease: 'none', immediateRender: false, scrollTrigger: { scrub: 1, ...st } });

    const ctx = gsap.context(() => {
      if (!reduced) {
        seg(K.hero, K.intro, { trigger: '#hero', start: 'top top', end: 'bottom top' });
        const tl = gsap.timeline({ scrollTrigger: { trigger: '#perspective', start: 'top top', end: 'bottom bottom', scrub: 1 } });
        tl.fromTo(S, { ...K.intro }, { ...K.profile, ease: 'none', duration: 1, immediateRender: false })
          .fromTo(S, { ...K.profile }, { ...K.heart, ease: 'none', duration: 1, immediateRender: false })
          .fromTo(S, { ...K.heart }, { ...K.back, ease: 'none', duration: 1, immediateRender: false });
        seg(K.back, K.care, { trigger: '#care', start: 'top bottom', end: 'top top' });
        seg(K.care, K.cta, { trigger: '#cta', start: 'top bottom', end: 'top 25%' });
      } else {
        KEYS.forEach((k) => { S[k] = K.intro[k]; });
      }

      // Pause the main canvas whenever opaque sections cover it completely.
      ScrollTrigger.create({
        trigger: '#party', endTrigger: '#doctor', start: 'top top', end: 'bottom bottom',
        onToggle: (self) => window.dispatchEvent(new CustomEvent('c1-visible', { detail: !self.isActive })),
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const t = setTimeout(refresh, 1200);

    return () => {
      clearTimeout(t);
      window.removeEventListener('load', refresh);
      ctx.revert();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      window.__lenis = null;
    };
  }, []);
  return null;
}
