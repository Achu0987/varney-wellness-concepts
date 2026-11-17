'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProgress } from '@react-three/drei';

const ease = [0.22, 1, 0.36, 1];
const WORD = 'Varney Wellness';

/**
 * Brand intro, in three beats like a film title:
 * 1. the Varney Wellness mark rises on the hero's violet gradient while the page really loads (3D, images, fonts);
 * 2. a short hold once everything is ready;
 * 3. the mark dissolves and the site crossfades in. `onReady` fires at the start of beat 3.
 */
export default function Loader({ onReady, onLanded }) {
  const { progress: assetProgress } = useProgress();
  const [stage, setStage] = useState('scan'); // scan -> logo -> out -> done
  const [shown, setShown] = useState(0);
  const wordRef = useRef(null);
  const [fly, setFly] = useState(null);
  const target = useRef(0);
  const flags = useRef({ load: false, fonts: false, three: false, t0: 0 });

  // what "loaded" really means: window load, fonts ready, the 3D scene's first frame
  useEffect(() => {
    flags.current.t0 = performance.now();
    window.__lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    const onLoad = () => { flags.current.load = true; };
    if (document.readyState === 'complete') onLoad(); else window.addEventListener('load', onLoad);
    document.fonts?.ready.then(() => { flags.current.fonts = true; });
    const on3d = () => { flags.current.three = true; };
    window.addEventListener('vw-3d-ready', on3d);
    const fallback = setTimeout(() => { flags.current.load = flags.current.fonts = flags.current.three = true; }, 5000);
    return () => { window.removeEventListener('load', onLoad); window.removeEventListener('vw-3d-ready', on3d); clearTimeout(fallback); };
  }, []);

  // the counter eases toward the real progress, never faster than a short minimum show
  useEffect(() => {
    if (stage !== 'scan') return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minMs = reduced ? 300 : 1800;
    let raf;
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const f = flags.current;
      const parts = [f.load ? 1 : 0.6, f.fonts ? 1 : 0.7, f.three ? 1 : Math.min(0.9, assetProgress / 100 * 0.9)];
      const real = (parts.reduce((a, b) => a + b, 0) / parts.length) * 100;
      const timeCap = Math.min(100, ((performance.now() - f.t0) / minMs) * 100);
      target.current = Math.min(real, timeCap);
      setShown((s) => {
        const n = s + (target.current - s) * (1 - Math.exp(-dt * 7));
        return target.current >= 99.9 && n > 98.5 ? 100 : n;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage, assetProgress]);

  useEffect(() => {
    if (stage === 'scan' && shown >= 100) {
      const t = setTimeout(() => setStage('logo'), 250);
      return () => clearTimeout(t);
    }
    if (stage === 'logo') {
      const t = setTimeout(() => {
        // measure where the hero's own logo sits, so the mark can fly into it
        const el = wordRef.current;
        const target = document.querySelector('[data-brand]');
        if (el && target) {
          const a = el.getBoundingClientRect();
          const b = target.getBoundingClientRect();
          setFly({ x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: b.width / a.width });
        }
        setStage('out');
        onReady?.();
      }, 700);
      return () => clearTimeout(t);
    }
    if (stage === 'out') {
      const t = setTimeout(() => {
        setStage('done');
        onLanded?.();
        document.documentElement.style.overflow = '';
        window.__lenis?.start();
      }, 1250);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [stage, shown, onReady, onLanded]);

  const pct = Math.round(shown);

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          key="loader"
          role="status"
          aria-live="polite"
          aria-label={stage === 'scan' ? `Loading ${pct}%` : 'Varney Wellness'}
          className={`fixed inset-0 z-[200] overflow-hidden ${stage === 'out' ? 'pointer-events-none' : ''}`}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div aria-hidden="true" className="absolute inset-0 bg-navy" animate={{ opacity: stage === 'out' ? 0 : 1 }} transition={{ duration: 0.4 }} />
          {/* beat 2 background: the hero's own gradient blooms in, then gives way to the real hero */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(135deg,#7557FF_0%,#6f8dff_55%,#8BDFFF_120%)]"
            initial={{ opacity: 1 }}
            animate={{ opacity: stage === 'out' ? 0 : 1 }}
            transition={{ duration: stage === 'out' ? 1 : 1.1, ease }}
          />

          {/* beat 2: the mark */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            {true && (
              <>
                <motion.svg initial={{ opacity: 0, scale: 0.6, rotate: -40 }} animate={stage === 'out' ? { opacity: 0, scale: 0.5, rotate: 0 } : { opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: stage === 'out' ? 0.5 : 0.9, ease }} width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />
                  <path d="M18 22 L32 46 L46 22" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="32" cy="32" r="4" fill="#8BDFFF" />
                </motion.svg>
                <motion.div
                  ref={wordRef}
                  className="mt-5"
                  style={{ transformOrigin: '50% 50%' }}
                  animate={stage === 'out' && fly ? fly : { x: 0, y: 0, scale: 1 }}
                  transition={{ duration: 1.15, ease: [0.65, 0, 0.2, 1] }}
                >
                  <h2 className="h-gs flex overflow-hidden text-[clamp(2.4rem,7vw,6rem)] leading-[1.05]" aria-label={WORD}>
                    {WORD.split('').map((ch, i) => (
                      <motion.span key={i} aria-hidden="true" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.03 }} className={`${ch === ' ' ? 'w-[0.28em]' : ''} ${i > 6 ? 'text-ice' : ''}`}>
                        {ch === ' ' ? '\u00A0' : ch}
                      </motion.span>
                    ))}
                  </h2>
                </motion.div>
                <motion.p initial={{ opacity: 0, y: 12 }} animate={stage === 'out' ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }} transition={{ duration: stage === 'out' ? 0.4 : 0.8, ease, delay: stage === 'out' ? 0 : 0.6 }} className="mt-3 text-[1.05rem] text-white/85">
                  The future of wellness is personal.
                </motion.p>
                <motion.div animate={{ opacity: stage === 'scan' ? 1 : 0 }} transition={{ duration: 0.4 }} className="mt-8 h-[2px] w-40 overflow-hidden rounded-full bg-white/25" aria-hidden="true">
                  <div className="h-full bg-white" style={{ width: `${shown}%` }} />
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
