'use client';
import { A } from '@/lib/asset';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);
const MiniIcon = dynamic(() => import('./MiniIcon'), { ssr: false });

const CARDS = [
  { title: 'Personalized Wellness', kind: 'knot', color: '#8BDFFF', tone: 'glass', img: A('/images/care1.jpg'), tint: 'bg-ice/30' },
  { title: 'Advanced Aesthetic Care', kind: 'gem', color: '#ffffff', tone: 'violet', img: A('/images/care2.jpg'), tint: 'bg-violet/60' },
  { title: 'Health & Wellbeing', kind: 'gyro', color: '#7557FF', tone: 'ice', img: A('/images/care3.jpg'), tint: 'bg-ice/40' },
  { title: 'Your Wellness Journey', kind: 'spiral', color: '#8BDFFF', tone: 'deep', img: A('/images/care4.jpg'), tint: 'bg-violet/40' },
];

const TONES = {
  glass: 'text-white',
  violet: 'text-white shadow-[0_30px_80px_-30px_rgba(117,87,255,0.8)]',
  ice: 'text-white',
  deep: 'text-white ring-1 ring-ice/30',
};

export default function Care() {
  const root = useRef(null);
  const pin = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.from('.care-line', { yPercent: 115, duration: 1.1, ease: 'power4.out', stagger: 0.1, scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } });

      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const dist = () => track.current.scrollWidth - window.innerWidth + 80;
        const tween = gsap.to(track.current, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: { trigger: pin.current, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        gsap.utils.toArray('.care-card').forEach((card) => {
          gsap.fromTo(card, { rotateY: 14, y: 30 }, {
            rotateY: -8, y: 0, ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 95%', end: 'right 5%', scrub: true },
          });
        });
      });
    }, root);
    return () => { ctx.revert(); mm.revert(); };
  }, []);

  return (
    <section id="care" data-chapter="What we offer" ref={root} aria-labelledby="care-title" className="relative">
      <div ref={pin} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-24 md:py-16" style={{ perspective: 1400 }}>
        <div className="px-[var(--m)]">
          <h2 id="care-title" className="display text-[clamp(2rem,5.6vw,6.4rem)]">
            {['Care that', 'moves with you.'].map((l) => (
              <span key={l} className="mask-line"><span className="care-line block">{l}</span></span>
            ))}
          </h2>
          <p className="mt-4 max-w-[46ch] text-cool">Placeholder descriptions. Final services are confirmed with Dr. Varney before anything is published.</p>
        </div>

        <ul ref={track} className="mt-10 flex gap-5 overflow-x-auto px-[var(--m)] pb-4 [scrollbar-width:none] max-md:snap-x max-md:snap-mandatory md:w-max md:overflow-visible md:pr-[10vw]">
          {CARDS.map((c, i) => (
            <li key={c.title} className={`care-card relative overflow-hidden flex h-[30rem] w-[min(80vw,24rem)] shrink-0 flex-col justify-between rounded-[2rem] p-6 max-md:snap-center md:h-[min(30rem,62svh)] ${TONES[c.tone]} ${i % 2 ? 'md:mt-10' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
              <img src={c.img} alt="" className="absolute inset-0 h-full w-full object-cover saturate-[0.85] brightness-[0.7]" />
              <div aria-hidden="true" className={`absolute inset-0 ${c.tint} mix-blend-soft-light`} />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,32,0.1),rgba(8,14,32,0.92)_75%)]" />
              <div className="relative -mx-2 h-[46%] min-h-[9rem]"><MiniIcon kind={c.kind} color={c.color} /></div>
              <div className="relative">
                <h3 className="display !text-[clamp(1.6rem,2.1vw,2.1rem)] !leading-[0.98] !normal-case">{c.title}</h3>
                <p className={`mt-3 text-[0.98rem] text-white/80`}>
                  Placeholder description. A short, approved summary of this area of care will appear here.
                </p>
                <span className={`mt-5 inline-flex items-center gap-2 text-[0.9rem] font-bold text-ice`}>
                  Learn more <ArrowUpRight size={16} />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
