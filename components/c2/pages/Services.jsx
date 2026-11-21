'use client';
import { A } from '@/lib/asset';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Shell, PageHero, Closing, Pill, TextLink, R, ease } from '../site/Site';
import { SERVICES } from '../site/data';

/* sticky photograph beside a list: the row in the middle of the screen is the one you are reading */
function List() {
  const [on, setOn] = useState(0);
  const rows = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setOn(Number(e.target.dataset.i)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);
  const s = SERVICES[on];
  return (
    <section className="bg-[#F7F3EC] px-[var(--m)] py-24 md:py-36">
      <div className="mx-auto grid max-w-[1360px] gap-10 lg:grid-cols-12 lg:gap-0">
        <div className="hidden lg:sticky lg:top-[14vh] lg:col-span-5 lg:block lg:self-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] lg:aspect-[4/5] lg:rounded-t-full lg:rounded-b-none">
            <AnimatePresence initial={false}>
              <motion.img key={s.slug} src={s.img} alt={s.alt} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease }} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: s.pos }} />
            </AnimatePresence>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <h2 data-reveal className="c2-serif text-[clamp(2.4rem,3.6vw,3.4rem)] leading-[1] text-[#173B35]">Four areas of care</h2>
          <p data-reveal="0.1" className="mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-[#242424]">Placeholder service areas. The final treatment menu is confirmed with Dr. Varney before publication.</p>
          <ul className="mt-12 lg:pb-[8vh]">
            {SERVICES.map((x, i) => {
              const act = on === i;
              return (
                <li key={x.slug} ref={(n) => { rows.current[i] = n; }} data-i={i} className="py-6" onPointerEnter={() => setOn(i)}>
                  <Link href={R(`/services/${x.slug}`)} onFocus={() => setOn(i)} className="group block">
                    <span className="flex items-baseline justify-between gap-6">
                      <span className={`c2-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.05] transition-colors duration-300 ${act ? 'text-[#173B35]' : 'text-[#5f6f6a]'}`}>{x.t}</span>
                      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-500 group-hover:rotate-45 ${act ? 'bg-[#173B35] text-[#F7F3EC]' : 'bg-[#ece5d8] text-[#173B35]'}`}><ArrowUpRight size={18} /></span>
                    </span>
                    <span className={`grid transition-[grid-template-rows] duration-500 ${act ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <span className="overflow-hidden">
                        <span className="mt-3 block max-w-[38ch] text-[1.0625rem] leading-relaxed text-[#242424]">{x.short} Begins with a consultation.</span>
                        <img src={x.img} alt="" loading="lazy" decoding="async" className="mt-5 block aspect-[16/10] w-full rounded-[12px] object-cover lg:hidden" style={{ objectPosition: x.pos }} />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Begins() {
  const steps = [['A conversation', 'Your goals, your history, your questions.'], ['An assessment', 'So every recommendation is safe for you.'], ['A plan', 'Written for you, explained in plain words.']];
  return (
    <section className="bg-[#D9E2D6] px-[var(--m)] py-24 md:py-32">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h2 data-reveal className="c2-serif max-w-[14ch] text-[clamp(2.5rem,4.4vw,4.2rem)] leading-[1] text-[#173B35]">Every service begins the same way</h2>
          <div data-reveal="0.1"><TextLink href={R('/your-visit')}>See your visit, step by step</TextLink></div>
        </div>
        <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {steps.map(([t, d], i) => (
            <li key={t} data-reveal={String(0.1 + i * 0.08)}>
              <span className="c2-serif block text-[clamp(2.4rem,4vw,3.6rem)] leading-[0.95] text-[#173B35]">{t}</span>
              <span className="mt-4 block max-w-[28ch] text-[1.125rem] leading-relaxed text-[#173B35]">{d}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Parties() {
  return (
    <section className="bg-[#F7F3EC] p-[8px] md:p-[10px]">
      <div className="relative min-h-[80svh] overflow-hidden rounded-[12px]">
        <img src={A('/images/p4.jpg')} alt="Friends raising glasses at a long candlelit table (stock photo)" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78),rgba(0,0,0,0.2)_70%)]" /> {/* taste-skill-ignore: photo scrim */}
        <div className="relative flex min-h-[80svh] flex-col justify-end p-[calc(var(--m)-8px)] pb-12 text-[#F7F3EC] md:max-w-[44rem] md:pb-16">
          <h2 data-reveal className="c2-serif text-[clamp(2.8rem,6vw,6rem)] leading-[0.95]">Private parties</h2>
          <p data-reveal="0.1" className="mt-5 max-w-[38ch] text-[1.125rem] leading-relaxed">Gather your people for a private Botox party inquiry, at the clinic, at home or at a venue. Every guest is assessed individually.</p>
          <div data-reveal="0.2"><Pill href={R('/private-parties')} tone="ivory" className="mt-8">Plan a private party</Pill></div>
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <Shell light>
      <PageHero img={A('/c2/portrait.jpg')} alt="A woman with closed eyes in soft warm light (stock photo)" pos="50% 40%" title="Services" lead="Four areas of physician-led care, each one beginning with an unhurried consultation." action={{ href: R('/contact'), label: 'Book a Consultation' }} />
      <List />
      <Begins />
      <Parties />
      <Closing img={A('/c2/bottles.jpg')} alt="Skincare bottles on a shelf beside blossom (stock photo)" />
    </Shell>
  );
}
