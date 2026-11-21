'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import { Shell, PageHero, Closing, R } from '../site/Site';
import { SERVICES } from '../site/data';

function Intro({ s }) {
  return (
    <section className="bg-[#F7F3EC] px-[var(--m)] py-24 md:py-36">
      <div className="mx-auto grid max-w-[1360px] items-center gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-6">
          <h2 data-reveal className="c2-serif max-w-[14ch] text-[clamp(2.5rem,4.4vw,4.2rem)] leading-[1] text-[#173B35]">What it is</h2>
          <p data-reveal="0.1" className="mt-7 max-w-[46ch] text-[1.1875rem] leading-relaxed text-[#242424]">{s.intro}</p>
          <p data-reveal="0.15" className="mt-6 max-w-[46ch] text-[0.9375rem] leading-relaxed text-[#242424]/80">Illustrative description. Final wording and availability are confirmed with Dr. Varney.</p>
        </div>
        <div data-reveal="0.15" className="md:col-span-5 md:col-start-8">
          <div className="aspect-[4/5] overflow-hidden rounded-t-full"><img src={s.img2} alt={s.alt2} loading="lazy" decoding="async" className="h-full w-full object-cover" /></div>
        </div>
      </div>
    </section>
  );
}

function Suits({ s }) {
  return (
    <section className="bg-[#173B35] px-[var(--m)] py-24 text-[#F7F3EC] md:py-32">
      <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-12">
        <h2 data-reveal className="c2-serif text-[clamp(2.4rem,4vw,3.8rem)] leading-[1] lg:col-span-4">It may suit you if</h2>
        <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:col-span-8">
          {s.suits.map((x, i) => (
            <li key={x} data-reveal={String(i * 0.06)} className="flex gap-4">
              <span className="mt-[0.55em] h-2.5 w-2.5 shrink-0 rounded-full bg-[#C5A77B]" aria-hidden="true" />
              <span className="c2-serif text-[clamp(1.4rem,2vw,1.85rem)] leading-[1.2]">{x}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* what to expect: four moments joined by a gold line that draws itself as you read */
function Expect({ s }) {
  const root = useRef(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.ex-line', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.ex-list', start: 'top 65%', end: 'bottom 60%', scrub: true } });
    });
    return () => mm.revert();
  }, []);
  return (
    <section ref={root} className="bg-[#EFE8DC] px-[var(--m)] py-24 md:py-36">
      <div className="mx-auto grid max-w-[1360px] gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 data-reveal className="c2-serif text-[clamp(2.5rem,4.4vw,4.2rem)] leading-[1] text-[#173B35]">What to expect</h2>
          <p data-reveal="0.1" className="mt-6 max-w-[34ch] text-[1.0625rem] leading-relaxed text-[#242424]">The same calm sequence every time, at a pace that suits you.</p>
        </div>
        <ol className="ex-list relative grid gap-12 pl-10 lg:col-span-7 lg:col-start-6">
          <span className="absolute bottom-2 left-[5px] top-2 w-[2px] rounded-full bg-[#173B35]/15" aria-hidden="true"><span className="ex-line block h-full w-full origin-top rounded-full bg-[#C5A77B]" /></span>
          {s.steps.map(([t, d]) => (
            <li key={t} data-reveal className="relative">
              <span className="absolute -left-10 top-[0.6em] h-3 w-3 rounded-full bg-[#173B35] ring-4 ring-[#EFE8DC]" aria-hidden="true" />
              <h3 className="c2-serif text-[clamp(1.9rem,2.8vw,2.6rem)] leading-[1.05] text-[#173B35]">{t}</h3>
              <p className="mt-3 max-w-[44ch] text-[1.125rem] leading-relaxed text-[#242424]">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function GoodToKnow({ s }) {
  return (
    <section className="bg-[#F7F3EC] px-[var(--m)] py-20 md:py-28">
      <div data-reveal className="mx-auto grid max-w-[1360px] gap-6 rounded-[1.5rem] bg-[#D9E2D6] p-8 lg:grid-cols-12 md:p-14">
        <h2 className="c2-serif text-[clamp(2rem,3vw,2.8rem)] leading-[1] text-[#173B35] lg:col-span-4">Good to know</h2>
        <div className="grid gap-4 text-[1.0625rem] leading-relaxed text-[#173B35] lg:col-span-8">
          {s.note && <p>{s.note}</p>}
          <p>No outcome is guaranteed. Recommendations depend on your health and history, and are only made after a consultation and assessment.</p>
          <p>Pricing is confirmed by the practice and explained before anything is agreed.</p>
        </div>
      </div>
    </section>
  );
}

function Related({ s }) {
  const others = SERVICES.filter((x) => x.slug !== s.slug);
  return (
    <section className="bg-[#F7F3EC] px-[var(--m)] pb-24 md:pb-32">
      <div className="mx-auto max-w-[1360px]">
        <h2 data-reveal className="c2-serif text-[clamp(2.2rem,3.4vw,3.2rem)] leading-[1] text-[#173B35]">Other areas of care</h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {others.map((x, i) => (
            <li key={x.slug} data-reveal={String(i * 0.08)}>
              <Link href={R(`/services/${x.slug}`)} className="group block">
                <span className="block aspect-[4/3] overflow-hidden rounded-[12px]"><img src={x.img} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" style={{ objectPosition: x.pos }} /></span>
                <span className="mt-5 flex items-start justify-between gap-4">
                  <span>
                    <span className="c2-serif block text-[1.75rem] leading-[1.1] text-[#173B35]">{x.t}</span>
                    <span className="mt-2 block max-w-[32ch] text-[1rem] text-[#242424]">{x.short}</span>
                  </span>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ece5d8] text-[#173B35] transition-[background-color,color,transform] duration-500 group-hover:rotate-45 group-hover:bg-[#173B35] group-hover:text-[#F7F3EC]"><ArrowUpRight size={18} /></span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Service({ slug }) {
  const s = SERVICES.find((x) => x.slug === slug) || SERVICES[0];
  return (
    <Shell light>
      <PageHero img={s.img} alt={s.alt} pos={s.pos} title={s.t} lead={s.lead} size="md" action={{ href: R('/contact'), label: 'Book a Consultation' }} />
      <Intro s={s} />
      <Suits s={s} />
      <Expect s={s} />
      <GoodToKnow s={s} />
      <Related s={s} />
      <Closing title="Talk it through first." text={`A consultation is the first step for ${s.t.toLowerCase()}. Bring your questions; there is time for all of them.`} img={s.img3} alt={s.alt3} second={{ href: R("/services"), label: "All services" }} />
    </Shell>
  );
}
