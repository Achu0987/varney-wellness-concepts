'use client';
import { A } from '@/lib/asset';
import { Shell, PageHero, Closing, TextLink, R } from '../site/Site';
import { FAQ } from '../site/data';
import Concierge from '../Concierge';

const OCCASIONS = [
  { t: 'Bridal gatherings', d: 'Before the big day, with the people who matter most.', img: A('/c2/bridal.jpg'), alt: 'A bride holding a bouquet in a sunny field (stock photo)', cls: 'md:col-span-5 md:mt-0 aspect-[4/5]' },
  { t: 'Birthdays', d: 'A quieter way to mark the year.', img: A('/images/p1.jpg'), alt: 'Friends raising glasses against a blue sky (stock photo)', cls: 'md:col-span-4 md:col-start-7 md:mt-32 aspect-[1/1]' },
  { t: 'Wellness evenings', d: 'Candlelight, conversation and time together.', img: A('/c2/bath.jpg'), alt: 'Candles and a glass beside a warm bath (stock photo)', cls: 'md:col-span-4 md:col-start-2 md:mt-16 aspect-[4/3]' },
  { t: 'Friends, any reason', d: 'No occasion needed.', img: A('/images/p3.jpg'), alt: 'Two hands clinking glasses of sparkling wine (stock photo)', cls: 'md:col-span-5 md:col-start-7 md:mt-28 aspect-[16/11]' },
];
const CARE = [
  ['Every guest is assessed', 'Each guest has a private consultation and medical assessment. Treatment only goes ahead when it is suitable for that person.'],
  ['The host does not decide eligibility', 'Who is treated, and how, is decided by the physician-led team alone.'],
  ['The setting is approved first', 'Homes and venues are possible only when the practice approves the space.'],
  ['It starts as an inquiry', 'Nothing is booked until the practice has reviewed your request and replied.'],
];

function Intro() {
  return (
    <section className="bg-[#F7F3EC] px-[var(--m)] pb-16 pt-24 md:pb-24 md:pt-36">
      <div className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-12">
        <h2 data-reveal className="c2-serif max-w-[12ch] text-[clamp(2.8rem,6.5vw,6rem)] leading-[0.95] text-[#173B35] lg:col-span-7">An evening, handled.</h2>
        <p data-reveal="0.1" className="max-w-[40ch] self-end text-[1.1875rem] leading-relaxed text-[#242424] lg:col-span-4 lg:col-start-9">You bring the people and the reason. The practice looks after the care, the assessments and the details, so you can enjoy the evening too.</p>
      </div>
    </section>
  );
}

function Occasions() {
  return (
    <section className="bg-[#F7F3EC] px-[var(--m)] pb-24 md:pb-36">
      <div className="mx-auto max-w-[1360px]">
        <h2 data-reveal className="c2-serif text-[clamp(2.2rem,3.4vw,3.2rem)] leading-[1] text-[#173B35]">For any occasion</h2>
        <ul className="mt-12 grid gap-10 md:grid-cols-12 md:gap-x-6 md:gap-y-0">
          {OCCASIONS.map((o, i) => (
            <li key={o.t} data-reveal={String((i % 2) * 0.1)} className={o.cls.split(' ').filter((c) => !c.startsWith('aspect')).join(' ')}>
              <div className={`overflow-hidden rounded-[12px] ${o.cls.split(' ').find((c) => c.startsWith('aspect'))}`}>
                <img src={o.img} alt={o.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
              <h3 className="c2-serif mt-5 text-[1.85rem] leading-[1.1] text-[#173B35]">{o.t}</h3>
              <p className="mt-2 text-[1.0625rem] text-[#242424]">{o.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Care() {
  return (
    <section className="bg-[#D9E2D6] px-[var(--m)] py-24 md:py-36">
      <div className="mx-auto grid max-w-[1360px] gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 data-reveal className="c2-serif max-w-[12ch] text-[clamp(2.5rem,4.4vw,4.2rem)] leading-[1] text-[#173B35]">Care comes first</h2>
          <div data-reveal="0.15" className="mt-10 hidden aspect-[4/5] w-[min(100%,22rem)] overflow-hidden rounded-t-full lg:block">
            <img src={A('/c2/shadow1.jpg')} alt="Warm leaf shadows on a wall (stock photo)" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
        </div>
        <dl className="grid content-start gap-10 lg:col-span-6 lg:col-start-7">
          {CARE.map(([t, d], i) => (
            <div key={t} data-reveal={String(i * 0.06)}>
              <dt className="c2-serif text-[clamp(1.7rem,2.4vw,2.2rem)] leading-[1.1] text-[#173B35]">{t}</dt>
              <dd className="mt-3 max-w-[46ch] text-[1.0625rem] leading-relaxed text-[#173B35]">{d}</dd>
            </div>
          ))}
          <p data-reveal className="text-[0.9375rem] text-[#173B35]/85">Event formats and availability are confirmed by the practice before publication.</p>
        </dl>
      </div>
    </section>
  );
}

function Questions() {
  const qs = FAQ.find(([h]) => h === 'Private parties')[1];
  return (
    <section className="bg-[#F7F3EC] px-[var(--m)] py-24 md:py-32">
      <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 data-reveal className="c2-serif text-[clamp(2.4rem,4vw,3.8rem)] leading-[1] text-[#173B35]">Party questions</h2>
          <div data-reveal="0.1" className="mt-6"><TextLink href={R('/contact#questions')}>All questions</TextLink></div>
        </div>
        <div className="grid gap-4 lg:col-span-8">
          {qs.map(([q, a], i) => (
            <details key={q} data-reveal={String(i * 0.06)} className="group rounded-[1.25rem] bg-[#EFE8DC] px-7 py-6 open:bg-[#ece5d8]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.25rem] text-[#173B35] [&::-webkit-details-marker]:hidden">
                {q}
                <span className="relative h-4 w-4 shrink-0" aria-hidden="true"><span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 bg-[#173B35]" /><span className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 bg-[#173B35] transition-transform duration-300 group-open:scale-y-0" /></span>
              </summary>
              <p className="mt-4 max-w-[56ch] text-[1.0625rem] leading-relaxed text-[#242424]">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Parties() {
  return (
    <Shell light>
      <PageHero img={A('/images/p4.jpg')} alt="Friends raising glasses at a long candlelit table (stock photo)" pos="50% 45%" title="Private Parties" lead="Plan a private Botox party inquiry for your people, at the clinic, at home or at a venue. Event inquiry only." action={{ href: '#parties', label: 'Plan your party' }} />
      <Intro />
      <Occasions />
      <Concierge />
      <Care />
      <Questions />
      <Closing title="Prefer to talk first?" text="Book a consultation for yourself, or ask the practice anything about hosting a private gathering." img={A('/images/p2.jpg')} alt="Two glasses of sparkling wine raised beside a bottle (stock photo)" second={{ href: R('/contact'), label: 'Contact the club' }} />
    </Shell>
  );
}
