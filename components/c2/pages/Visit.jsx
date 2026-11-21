'use client';
import { A } from '@/lib/asset';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Shell, PageHero, Closing, TextLink, R } from '../site/Site';

const MOMENTS = [
  { t: 'Get in touch', d: 'Send a short request. The practice replies to arrange a time that suits you.', img: A('/images/band.jpg'), alt: 'A bright lobby with a wall of plants (stock photo)', gap: 'md:mt-6' },
  { t: 'Arrive quietly', d: 'A calm, private arrival. Arrival details are confirmed by the practice.', img: A('/c2/pool.jpg'), alt: 'A calm indoor pool (stock photo)', gap: 'md:mt-28' },
  { t: 'Talk it through', d: 'A one-to-one conversation with Dr. Varney about you and your goals.', img: A('/c2/towel.jpg'), alt: 'A woman in soft natural light (stock photo)', gap: 'md:mt-14' },
  { t: 'A careful assessment', d: 'Your history and any checks needed, so advice is safe and suitable.', img: A('/c2/serum.jpg'), alt: 'A woman touching her cheek beside a glass bottle (stock photo)', gap: 'md:mt-36' },
  { t: 'Your plan', d: 'Options explained plainly, including doing nothing. You decide.', img: A('/c2/golden.jpg'), alt: 'A woman in warm evening light (stock photo)', gap: 'md:mt-10' },
  { t: 'Follow-up', d: 'Check-ins whenever you need them, so the plan keeps fitting your life.', img: A('/c2/tubview.jpg'), alt: 'A bathing room with a window onto mountains (stock photo)', gap: 'md:mt-24' },
];
const BRING = [
  ['A list of medicines', 'Anything you take regularly, including supplements.'],
  ['Your questions', 'Write them down; there is time for every one.'],
  ['Relevant records', 'Recent results or letters, if you have them.'],
  ['Time', 'First consultations are unhurried. Length to be confirmed by the practice.'],
];

/* a row of moments you can drag, swipe or step through with the buttons */
function Row() {
  const track = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = track.current;
    const on = () => setP(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth));
    on();
    el.addEventListener('scroll', on, { passive: true });
    // drag with a mouse
    let down = false; let x0 = 0; let s0 = 0;
    const dn = (e) => { if (e.pointerType !== 'mouse') return; down = true; x0 = e.clientX; s0 = el.scrollLeft; el.style.scrollSnapType = 'none'; el.style.cursor = 'grabbing'; };
    const mv = (e) => { if (down) el.scrollLeft = s0 - (e.clientX - x0); };
    const up = () => { if (!down) return; down = false; el.style.scrollSnapType = ''; el.style.cursor = ''; };
    el.addEventListener('pointerdown', dn); window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
    return () => { el.removeEventListener('scroll', on); el.removeEventListener('pointerdown', dn); window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
  }, []);
  const step = (d) => { const el = track.current; el.scrollBy({ left: d * (el.firstElementChild?.offsetWidth + 32 || 300), behavior: 'smooth' }); };
  return (
    <section className="bg-[#F7F3EC] py-24 md:py-36" aria-labelledby="row-h">
      <div className="mx-auto max-w-[1360px] px-[var(--m)]">
        <div className="flex items-end justify-between gap-6">
          <h2 id="row-h" data-reveal className="c2-serif max-w-[14ch] text-[clamp(2.5rem,4.4vw,4.2rem)] leading-[1] text-[#173B35]">From first message to follow-up</h2>
          <div className="hidden gap-2 md:flex">
            <button type="button" onClick={() => step(-1)} aria-label="Previous moment" disabled={p < 0.01} className="grid h-12 w-12 place-items-center rounded-full bg-[#173B35] text-[#F7F3EC] transition-opacity hover:bg-[#0f2a25] disabled:opacity-35"><ArrowLeft size={18} /></button>
            <button type="button" onClick={() => step(1)} aria-label="Next moment" disabled={p > 0.99} className="grid h-12 w-12 place-items-center rounded-full bg-[#173B35] text-[#F7F3EC] transition-opacity hover:bg-[#0f2a25] disabled:opacity-35"><ArrowRight size={18} /></button>
          </div>
        </div>
        <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-[#173B35]/12" aria-hidden="true"><div className="h-full rounded-full bg-[#C5A77B]" style={{ width: `${Math.max(8, p * 100)}%`, transition: 'width 120ms linear' }} /></div>
      </div>
      <ol ref={track} className="mt-10 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--m)] pb-4 [scrollbar-width:none] md:gap-8 [&::-webkit-scrollbar]:hidden" style={{ scrollPaddingInline: 'var(--m)' }}>
        {MOMENTS.map((m) => (
          <li key={m.t} className="w-[72vw] shrink-0 snap-start select-none sm:w-[300px]">
            <h3 className="c2-serif text-[1.85rem] leading-[1.1] text-[#173B35]">{m.t}</h3>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-[#242424]">{m.d}</p>
            <div className={`mt-8 aspect-[4/5] overflow-hidden rounded-t-full ${m.gap}`}><img src={m.img} alt={m.alt} draggable="false" loading="lazy" decoding="async" className="h-full w-full object-cover" /></div>
          </li>
        ))}
        <li className="w-2 shrink-0" aria-hidden="true" />
      </ol>
    </section>
  );
}

function Bring() {
  return (
    <section className="bg-[#173B35] px-[var(--m)] py-24 text-[#F7F3EC] md:py-32">
      <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 data-reveal className="c2-serif text-[clamp(2.4rem,4vw,3.8rem)] leading-[1]">Before you come</h2>
          <p data-reveal="0.1" className="mt-6 max-w-[32ch] text-[1.0625rem] leading-relaxed text-[#F7F3EC]/85">A few things that help your first consultation. The practice confirms the final list.</p>
        </div>
        <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
          {BRING.map(([t, d], i) => (
            <div key={t} data-reveal={String(i * 0.06)}>
              <dt className="c2-serif text-[clamp(1.6rem,2.2vw,2rem)] leading-[1.1] text-[#C5A77B]">{t}</dt>
              <dd className="mt-3 max-w-[34ch] text-[1.0625rem] leading-relaxed">{d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Promise() {
  return (
    <section className="bg-[#EFE8DC] px-[var(--m)] py-24 md:py-32">
      <div className="mx-auto grid max-w-[1360px] items-center gap-12 md:grid-cols-12">
        <div data-reveal className="md:col-span-6">
          <img src={A('/images/dark.jpg')} alt="A warm, textured stone wall in soft light (stock photo)" loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-[12px] object-cover" />
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <h2 data-reveal className="c2-serif text-[clamp(2.4rem,4vw,3.8rem)] leading-[1] text-[#173B35]">Private by design</h2>
          <p data-reveal="0.1" className="mt-6 max-w-[40ch] text-[1.125rem] leading-relaxed text-[#242424]">The club is planned so every appointment feels private: a calm room, time to talk, and a plan that is yours alone. Final arrangements are confirmed by the practice.</p>
          <div data-reveal="0.2" className="mt-8"><TextLink href={R('/contact#questions')}>Questions about visiting</TextLink></div>
        </div>
      </div>
    </section>
  );
}

export default function Visit() {
  return (
    <Shell light>
      <PageHero img={A('/images/care1.jpg')} alt="A bright, minimal treatment room with a small tree (stock photo)" pos="50% 55%" title="Your Visit" lead="What happens from your first message to your follow-up, and how to prepare." action={{ href: R('/contact'), label: 'Book a Consultation' }} />
      <Row />
      <Bring />
      <Promise />
      <Closing title="Ready when you are." img={A('/c2/portrait.jpg')} alt="A woman with closed eyes in warm light (stock photo)" second={{ href: R('/services'), label: 'Explore services' }} />
    </Shell>
  );
}
