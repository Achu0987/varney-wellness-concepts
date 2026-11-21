'use client';
import { A } from '@/lib/asset';
import { Shell, PageHero, Closing, R } from '../site/Site';

const APPROACH = [
  ['Listen first', 'Every plan begins with a full conversation about your health, your history and what you hope to change.'],
  ['Explain plainly', 'Options, likely outcomes and risks are explained in everyday language, and doing nothing is always one of the options.'],
  ['Follow through', 'Care does not end at the appointment. Follow-up is part of the plan, with the same physician each time.'],
];
const CREDS = ['Medical education', 'Board certification', 'Clinical experience', 'Professional memberships'];

function Portrait() {
  return (
    <section className="bg-[#F7F3EC] px-[var(--m)] py-24 md:py-36">
      <div className="mx-auto grid max-w-[1360px] items-center gap-12 md:grid-cols-12 md:gap-10">
        <figure data-reveal className="m-0 md:col-span-5">
          <div className="aspect-[3/4] overflow-hidden rounded-t-full">
            <img src={A('/images/doc.jpg')} alt="Stock portrait placeholder (not Dr. Varney)" loading="lazy" decoding="async" className="h-full w-full object-cover object-[50%_20%]" />
          </div>
          <figcaption className="mt-3 text-[0.9375rem] text-[#242424]/80">Stock placeholder, not Dr. Varney</figcaption>
        </figure>
        <div className="md:col-span-6 md:col-start-7">
          <h2 data-reveal className="c2-serif max-w-[14ch] text-[clamp(2.5rem,4.4vw,4.2rem)] leading-[1] text-[#173B35]">Physician and founder</h2>
          <p data-reveal="0.1" className="mt-7 max-w-[44ch] text-[1.1875rem] leading-relaxed text-[#242424]">Dr. Joseph Varney, MD, founded Varney Wellness as a private, physician-led club in Florida: fewer people, more time, and one doctor who knows your story.</p>
          <blockquote data-reveal="0.15" className="m-0 mt-10 rounded-[1.5rem] bg-[#173B35] p-8 text-[#F7F3EC] md:p-10">
            <p className="c2-serif text-[clamp(1.375rem,2vw,1.9rem)] leading-[1.3]">“Introduction placeholder. A personal note from Dr. Varney on why he founded the club and how he likes to care for people will appear here.”</p>
            <footer className="mt-6 text-[1rem] text-[#F7F3EC]/85">To be written with Dr. Varney</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section className="bg-[#EFE8DC] px-[var(--m)] py-24 md:py-36">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 data-reveal className="c2-serif text-[clamp(2.5rem,4.4vw,4.2rem)] leading-[1] text-[#173B35] lg:col-span-6">How he practises</h2>
          <p data-reveal="0.1" className="max-w-[36ch] self-end text-[1.0625rem] leading-relaxed text-[#242424] lg:col-span-4 lg:col-start-9">Three habits shape every appointment. Illustrative wording, to be confirmed with Dr. Varney.</p>
        </div>
        <div className="mt-16 grid gap-14 lg:grid-cols-12">
          <div data-reveal className="hidden lg:col-span-4 lg:block">
            <div className="aspect-[3/4] overflow-hidden rounded-t-full"><img src={A('/c2/shadow1.jpg')} alt="Warm leaf shadows on a wall (stock photo)" loading="lazy" decoding="async" className="h-full w-full object-cover" /></div>
          </div>
          <ol className="grid content-center gap-14 lg:col-span-7 lg:col-start-6">
            {APPROACH.map(([t, d], i) => (
              <li key={t} data-reveal={String(i * 0.08)} className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-10">
                <h3 className="c2-serif text-[clamp(2.2rem,3.6vw,3.4rem)] leading-[0.95] text-[#173B35]">{t}</h3>
                <p className="max-w-[40ch] text-[1.125rem] leading-relaxed text-[#242424] sm:pt-2">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Credentials() {
  return (
    <section className="bg-[#D9E2D6] px-[var(--m)] py-24 md:py-32">
      <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 data-reveal className="c2-serif text-[clamp(2.5rem,4.4vw,4.2rem)] leading-[1] text-[#173B35]">Training and credentials</h2>
          <p data-reveal="0.1" className="mt-6 max-w-[36ch] text-[1.0625rem] leading-relaxed text-[#173B35]">Nothing is listed here until it is supplied and confirmed by the practice.</p>
        </div>
        <dl data-reveal="0.1" className="lg:col-span-7">
          {CREDS.map((c) => (
            <div key={c} className="grid gap-1 border-t-2 border-[#173B35]/15 py-6 last:border-b-2 sm:grid-cols-2 sm:gap-8">
              <dt className="c2-serif text-[1.65rem] leading-[1.1] text-[#173B35]">{c}</dt>
              <dd className="text-[1.0625rem] text-[#173B35] sm:pt-1.5">To be confirmed by the practice</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default function Doctor() {
  return (
    <Shell light>
      <PageHero img={A('/images/care3.jpg')} alt="A warm, candlelit stone room (stock photo)" pos="50% 50%" title="Dr. Joseph Varney, MD" size="md" lead="Physician and founder of Varney Wellness, a private, physician-led wellness club in Florida." action={{ href: R('/contact'), label: 'Book a Consultation' }} />
      <Portrait />
      <Approach />
      <Credentials />
      <Closing title="Meet Dr. Varney in person." text="A first consultation is a conversation: your health, your goals and your questions, with time to answer them." img={A('/c2/golden.jpg')} alt="A woman in warm evening light (stock photo)" second={{ href: R('/the-club'), label: 'About the club' }} />
    </Shell>
  );
}
