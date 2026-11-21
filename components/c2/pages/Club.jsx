'use client';
import { A } from '@/lib/asset';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Shell, PageHero, Closing, R } from '../site/Site';

/* the Florida peninsula, one filled shape (no location dot until the address is confirmed) */
const FLORIDA = 'M12.7 12.7 C23.2 11.3 59.5 12.7 76.7 12.7 C93.9 12.6 108.4 10.1 115.9 12.2 C123.3 14.3 111.6 22.5 121.4 25.1 C131.2 27.7 157.4 26.7 174.7 27.8 C192.0 28.8 215.6 32.4 225.3 31.3 C235.0 30.3 227.9 22.7 232.7 21.5 C237.6 20.4 250.1 20.7 254.3 24.7 C258.5 28.7 256.4 38.4 257.8 45.5 C259.3 52.7 260.5 60.0 262.9 67.7 C265.4 75.5 268.5 83.7 272.7 92.2 C277.0 100.7 285.5 110.7 288.4 118.8 C291.4 127.0 289.0 133.6 290.4 141.0 C291.8 148.4 294.1 154.7 297.1 163.2 C300.0 171.7 305.9 183.2 308.0 192.1 C310.2 201.0 310.1 207.9 310.0 216.5 C309.9 225.2 309.1 236.5 307.3 244.1 C305.4 251.6 301.4 257.5 299.0 261.8 C296.7 266.1 296.9 268.0 293.1 269.8 C289.4 271.7 281.0 274.0 276.7 272.9 C272.3 271.8 269.8 268.1 266.9 263.2 C263.9 258.2 263.3 248.7 259.0 243.2 C254.8 237.6 245.9 235.0 241.4 229.9 C236.8 224.7 234.5 217.6 231.6 212.1 C228.6 206.5 227.3 203.2 223.7 196.5 C220.1 189.9 213.9 179.5 210.0 172.1 C206.1 164.7 201.0 158.8 200.2 152.1 C199.4 145.5 204.0 138.8 205.3 132.1 C206.6 125.5 208.6 117.7 208.0 112.2 C207.5 106.6 205.8 103.6 202.2 98.8 C198.6 94.0 191.7 89.2 186.5 83.3 C181.2 77.4 176.3 68.3 170.8 63.3 C165.2 58.3 158.0 54.2 153.1 53.1 C148.2 52.0 145.9 54.2 141.4 56.6 C136.8 59.1 130.6 65.1 125.7 67.7 C120.8 70.3 115.9 71.7 112.0 72.2 C108.0 72.7 104.1 73.1 102.2 70.8 C100.2 68.6 103.5 62.9 100.2 58.9 C96.9 54.9 89.7 50.2 82.5 46.9 C75.4 43.5 65.9 39.7 57.1 38.9 C48.2 38.1 36.3 41.1 29.6 42.0 C22.9 42.9 18.6 45.5 17.1 44.2 C15.5 42.9 20.7 38.3 20.2 34.4 C19.7 30.6 15.2 24.7 13.9 21.1 C12.7 17.5 2.3 14.1 12.7 12.7 Z';
const FL_VB = '0 0 320 283';

function Panorama() {
  return (
    <section className="overflow-hidden bg-[#F7F3EC] pt-24 md:pt-36">
      <div className="mx-auto max-w-[1360px] px-[var(--m)]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 data-reveal className="c2-serif max-w-[12ch] text-[clamp(2.8rem,6.5vw,6rem)] leading-[0.95] text-[#173B35] lg:col-span-7">Care, at a slower pace.</h2>
          <div data-reveal="0.1" className="grid gap-5 text-[1.125rem] leading-relaxed text-[#242424] lg:col-span-4 lg:col-start-9">
            <p className="max-w-[34ch]">Planned around appointments, so every room stays calm. Visiting arrangements are confirmed by the practice.</p>
            <p className="max-w-[34ch]">Led by Dr. Joseph Varney, MD, from first visit to follow-up.</p>
          </div>
        </div>
      </div>
      <div data-reveal="0.15" className="mt-12 aspect-[4/5] w-full overflow-hidden sm:aspect-[21/9]">
        <img src={A('/c2/pool.jpg')} alt="A calm indoor pool with tall windows onto trees (stock photo)" loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </div>
    </section>
  );
}

function About() {
  const facts = [['Location', 'Florida, USA'], ['Visits', 'By appointment (to be confirmed)'], ['Led by', 'Dr. Joseph Varney, MD'], ['Opening', 'To be announced']];
  return (
    <section className="bg-[#D9E2D6] px-[var(--m)] py-24 md:py-36">
      <div className="mx-auto max-w-[1360px]">
        <h2 data-reveal className="c2-serif text-[clamp(2.5rem,4.4vw,4.2rem)] leading-[1] text-[#173B35]">A club, not a clinic</h2>
        <p data-reveal="0.1" className="mt-6 max-w-[40ch] text-[clamp(1.2rem,1.5vw,1.375rem)] leading-relaxed text-[#173B35]">Varney Wellness is built around fewer people and more time. Every plan starts with a conversation and is written for one person.</p>
        <div className="mt-16 grid gap-4 lg:grid-cols-12">
          <figure data-reveal className="relative m-0 lg:col-span-8">
            <img src={A('/images/dark.jpg')} alt="A warm, textured stone wall in soft light (stock photo)" loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-[12px] object-cover sm:aspect-[16/10]" />
            <figcaption className="bg-[#F7F3EC] p-6 text-[1rem] leading-relaxed text-[#242424] sm:absolute sm:right-0 sm:top-0 sm:w-[22rem] sm:rounded-bl-[12px] sm:rounded-tr-[12px]">Rooms are designed to slow everything down: natural light, soft materials and real quiet between appointments.</figcaption>
          </figure>
          <div data-reveal="0.15" className="md:grid md:grid-cols-2 md:items-start md:gap-8 lg:col-span-4 lg:block">
            <div className="relative flex aspect-[3/2] flex-col justify-end overflow-hidden rounded-[12px] bg-[#173B35] p-7 lg:aspect-auto lg:h-[60%]">
              <svg viewBox={FL_VB} className="absolute right-[7%] top-[9%] h-[78%] w-auto" role="img" aria-label="Outline of Florida">
                <path d={FLORIDA} fill="#C5A77B" fillOpacity="0.14" stroke="#C5A77B" strokeWidth="1.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              </svg>
              <p className="c2-serif relative text-[clamp(2rem,2.6vw,2.6rem)] leading-none text-[#F7F3EC]">Florida</p>
              <span className="relative mt-3 block h-[2px] w-10 rounded-full bg-[#C5A77B]" aria-hidden="true" />
              <p className="relative mt-3 max-w-[14ch] text-[0.9375rem] leading-snug text-[#F7F3EC]/80">Exact address to be confirmed</p>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 md:mt-0 lg:mt-8">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.9375rem] text-[#173B35]/80">{k}</dt>
                  <dd className="mt-1 text-[1.0625rem] text-[#173B35]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* one frame, three distances: the same photograph moves closer as you scroll */
function Distances() {
  const root = useRef(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
      tl.to('.ds-img', { scale: 1.8, transformOrigin: '30% 70%', duration: 1, ease: 'power2.inOut' })
        .fromTo('.ds-b', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, 0.5)
        .to('.ds-img', { scale: 3, transformOrigin: '62% 30%', duration: 1, ease: 'power2.inOut' })
        .fromTo('.ds-c', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 1.6);
    });
    return () => mm.revert();
  }, []);
  return (
    <section ref={root} className="relative bg-[#F7F3EC] motion-safe:h-[300vh]">
      <div className="flex flex-col items-center justify-center gap-4 overflow-hidden px-[var(--m)] py-24 motion-safe:sticky motion-safe:top-0 motion-safe:h-[100svh] motion-safe:pb-6 motion-safe:pt-20">
        <h2 className="contents">
          <span className="c2-serif order-1 block text-center text-[clamp(2.4rem,min(7vw,8.5svh),7rem)] leading-[0.95] text-[#173B35]">Every detail</span>
          <span className="ds-b c2-serif relative z-10 order-3 mt-2 block text-center text-[clamp(2.4rem,min(7vw,8.5svh),7rem)] leading-[0.95] text-[#173B35] motion-reduce:!opacity-100">considered.</span>
        </h2>
        <div className="relative order-2 flex w-full items-start justify-center gap-10">
          <div className="aspect-[4/5] w-[min(80vw,32rem,46svh)] overflow-hidden rounded-t-full">
            <img src={A('/c2/bath.jpg')} alt="Candles and a glass beside a warm bath (stock photo)" loading="lazy" decoding="async" className="ds-img h-full w-full object-cover will-change-transform" />
          </div>
          <p className="ds-c absolute left-[calc(50%+min(40vw,16rem,23svh)+2.5rem)] top-0 hidden max-w-[24ch] text-[1.0625rem] leading-relaxed text-[#242424] motion-reduce:!opacity-100 lg:block">Candlelight, soft linen, warm water and nothing rushed. The finished rooms are designed with the practice.</p>
        </div>
        <p className="ds-c order-4 max-w-[30ch] text-center text-[1rem] leading-relaxed text-[#242424] motion-reduce:!opacity-100 lg:hidden">Candlelight, soft linen, warm water and nothing rushed. The finished rooms are designed with the practice.</p>
      </div>
    </section>
  );
}

export default function Club() {
  return (
    <Shell light>
      <PageHero img={A('/images/care2.jpg')} alt="A warm, quiet treatment lounge (stock photo)" pos="50% 60%" title="The Club" lead="A private, physician-led wellness club in Florida. Calm rooms, unhurried time, and one doctor who knows you." action={{ href: R('/contact'), label: 'Book a Consultation' }} />
      <Panorama />
      <About />
      <Distances />
      <Closing title="See what a visit involves." text="From your first message to your follow-up, every step is calm, private and explained." second={{ href: R('/your-visit'), label: 'Your visit, step by step' }} />
    </Shell>
  );
}
