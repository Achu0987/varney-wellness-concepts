'use client';
import { A } from '@/lib/asset';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Shell, Pill, Closing, R } from '../site/Site';
import { SERVICES } from '../site/data';
import FaqSection from '../site/FaqSection';

const HOURS = [['Monday to Friday', 'To be confirmed'], ['Saturday', 'To be confirmed'], ['Sunday', 'Closed (to be confirmed)']];
const TOPICS = [...SERVICES.map((s) => s.t), 'A private party', 'Not sure yet'];
const TIMES = ['Mornings', 'Afternoons', 'Evenings', 'Any time'];

/* the visit card, held on a photograph of the place */
function Card() {
  return (
    <section className="relative bg-[#F7F3EC] p-[8px] md:p-[10px]">
      <div className="relative h-[70svh] overflow-hidden rounded-[12px] md:h-[calc(100svh-20px)] md:min-h-[640px]">
        <img src={A('/images/band.jpg')} alt="A bright lobby with a wall of plants and soft seating (stock photo)" className="h-full w-full origin-[88%_15%] scale-[1.35] object-cover object-[70%_40%] md:scale-[1.3]" fetchPriority="high" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0))]" /> {/* taste-skill-ignore: photo scrim */}
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(0deg,rgba(0,0,0,0.6),rgba(0,0,0,0))]" /> {/* taste-skill-ignore: photo scrim */}
        <h1 className="c2-serif absolute bottom-28 left-[calc(var(--m)-8px)] text-[clamp(3.6rem,12.5vw,12rem)] leading-[0.9] text-[#F7F3EC] md:bottom-10">Contact</h1> {/* taste-skill-ignore: photo scrim */}
      </div>
      <div className="relative z-10 mx-[calc(var(--m)-8px)] -mt-20 rounded-[12px] bg-[#F7F3EC] p-7 md:absolute md:right-[calc(var(--m)+10px)] md:top-28 md:mx-0 md:mt-0 md:w-[26rem] md:p-9">
        <img src={A('/c2/pool.jpg')} alt="" className="float-right ml-4 aspect-[3/4] w-16 rounded-[6px] object-cover md:w-20" />
        <h2 className="c2-serif text-[clamp(2.2rem,3vw,2.8rem)] leading-[1] text-[#173B35]">Visit the club</h2>
        <address className="mt-6 text-[1.0625rem] not-italic leading-relaxed text-[#242424]">Address placeholder<br />Florida, USA</address>
        <dl className="mt-6 grid gap-2.5 text-[1rem]">
          {HOURS.map(([d, t]) => (
            <div key={d} className="flex justify-between gap-4"><dt className="text-[#242424]">{d}</dt><dd className="text-right tabular-nums text-[#242424]/85">{t}</dd></div>
          ))}
        </dl>
        <p className="mt-6 text-[1rem] text-[#242424]">Phone and email to be supplied by the practice</p>
        <Pill href="#request" className="mt-8 w-full justify-between">Request a consultation</Pill>
      </div>
    </section>
  );
}

function Field({ id, label, error, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[1rem] text-[#173B35]">{label}</label>
      {children}
      {hint && !error && <p className="mt-2 text-[0.9375rem] text-[#242424]/80">{hint}</p>}
      {error && <p id={`${id}-err`} className="mt-2 text-[0.9375rem] text-[#9a3b2a]">{error}</p>}
    </div>
  );
}
const input = 'mt-2 h-14 w-full rounded-[12px] border-0 bg-[#EFE8DC] px-5 text-[1.0625rem] text-[#242424] placeholder:text-[#242424]/55 transition-colors focus:bg-white focus:outline focus:outline-2 focus:outline-[#C5A77B]';

function Request() {
  const [err, setErr] = useState({});
  const [done, setDone] = useState(false);
  const [topic, setTopic] = useState('');
  const [time, setTime] = useState('Any time');
  const [note, setNote] = useState('');
  const [plan, setPlan] = useState('');
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const t = q.get('topic');
    const match = TOPICS.find((x) => x.toLowerCase().includes((t || '').toLowerCase()));
    if (t && match) setTopic(match);
    if (q.get('note')) { setPlan(q.get('note')); setNote(q.get('note')); }
  }, []);
  const submit = (e) => {
    e.preventDefault();
    const f = e.currentTarget.elements;
    const n = {};
    if (!f.name.value.trim()) n.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value)) n.email = 'Please enter an email address we can reply to, like name@example.com.';
    if (!topic) n.topic = 'Choose what you would like to talk about.';
    if (!f.consent.checked) n.consent = 'Please confirm you have read the note above.';
    setErr(n);
    const first = Object.keys(n)[0];
    if (first) { if (first !== 'topic') f[first]?.focus?.(); return; }
    setDone(true);
  };
  return (
    <section id="request" className="bg-[#F7F3EC] px-[var(--m)] py-24 md:py-36">
      <div className="mx-auto grid max-w-[1360px] gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 data-reveal className="c2-serif max-w-[12ch] text-[clamp(2.5rem,4.4vw,4.2rem)] leading-[1] text-[#173B35]">Request a consultation</h2>
          <p data-reveal="0.1" className="mt-6 max-w-[34ch] text-[1.0625rem] leading-relaxed text-[#242424]">Tell us a little about yourself and the practice will reply to arrange a time. Please do not include medical details here.</p>
          <div data-reveal="0.2" className="relative mt-10 hidden w-[min(100%,20rem)] lg:block">
            <div className="aspect-[4/5] overflow-hidden rounded-t-full">
            <img src={A('/images/care4.jpg')} alt="A quiet bathing room with a tall window (stock photo)" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          {done ? (
            <div role="status" className="rounded-[1.5rem] bg-[#D9E2D6] p-10 md:p-14">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[#173B35] text-[#F7F3EC]"><Check size={24} /></span>
              <p className="c2-serif mt-8 text-[clamp(2rem,3vw,2.8rem)] leading-[1.05] text-[#173B35]">Thank you. Your request is ready.</p>
              <p className="mt-4 max-w-[44ch] text-[1.0625rem] leading-relaxed text-[#173B35]">In the finished site the practice would reply within its stated hours. This is a preview, so nothing was sent or stored.</p>
              <button type="button" onClick={() => setDone(false)} className="mt-8 text-[1rem] text-[#173B35] underline decoration-[#C5A77B] decoration-2 underline-offset-4">Start again</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-7" data-reveal="0.1">
              {plan && <p role="status" className="rounded-[1.25rem] bg-[#173B35] px-6 py-5 text-[1.0625rem] leading-relaxed text-[#F7F3EC]"><span className="c2-serif mb-1 block text-[1.5rem] text-[#C5A77B]">Your party plan is attached</span>{plan}</p>}
              <div className="grid gap-7 sm:grid-cols-2">
                <Field id="name" label="Your name" error={err.name}><input id="name" name="name" autoComplete="name" className={input} aria-invalid={!!err.name} aria-describedby={err.name ? 'name-err' : undefined} /></Field>
                <Field id="email" label="Email" error={err.email}><input id="email" name="email" type="email" autoComplete="email" className={input} aria-invalid={!!err.email} aria-describedby={err.email ? 'email-err' : undefined} /></Field>
              </div>
              <Field id="phone" label="Phone (optional)" hint="Only if you would like a call back."><input id="phone" name="phone" type="tel" autoComplete="tel" className={input} /></Field>
              <fieldset>
                <legend className="text-[1rem] text-[#173B35]">What would you like to talk about?</legend>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {TOPICS.map((t) => (
                    <button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)} className={`min-h-[48px] rounded-full px-5 text-[1rem] transition-colors ${topic === t ? 'bg-[#173B35] text-[#F7F3EC]' : 'bg-[#EFE8DC] text-[#173B35] hover:bg-[#e4dccd]'}`}>{t}</button>
                  ))}
                </div>
                {err.topic && <p className="mt-2 text-[0.9375rem] text-[#9a3b2a]">{err.topic}</p>}
              </fieldset>
              <fieldset>
                <legend className="text-[1rem] text-[#173B35]">Best time to reach you</legend>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {TIMES.map((t) => (
                    <button key={t} type="button" aria-pressed={time === t} onClick={() => setTime(t)} className={`min-h-[48px] rounded-full px-5 text-[1rem] transition-colors ${time === t ? 'bg-[#173B35] text-[#F7F3EC]' : 'bg-[#EFE8DC] text-[#173B35] hover:bg-[#e4dccd]'}`}>{t}</button>
                  ))}
                </div>
              </fieldset>
              <Field id="msg" label="Anything else (optional)" hint="No medical details, please."><textarea id="msg" name="msg" rows={4} value={note} onChange={(e) => setNote(e.target.value)} className={`${input} h-auto py-4`} /></Field>
              <div>
                <label className="flex items-start gap-3 text-[1rem] leading-relaxed text-[#242424]">
                  <input name="consent" type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#173B35]" aria-invalid={!!err.consent} />
                  I understand this is a request to be contacted, not a booking or medical advice.
                </label>
                {err.consent && <p className="mt-2 text-[0.9375rem] text-[#9a3b2a]">{err.consent}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <button type="submit" className="group inline-flex h-14 items-center gap-3 rounded-full bg-[#173B35] pl-7 pr-2 text-[1rem] text-[#F7F3EC] transition-colors hover:bg-[#0f2a25]">Send request <span className="grid h-10 w-10 place-items-center rounded-full bg-[#C5A77B] text-[#173B35] transition-transform duration-500 group-hover:rotate-45"><Check size={18} /></span></button>
                <p className="text-[0.9375rem] text-[#242424]/80">Preview form: nothing is sent.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <Shell light>
      <Card />
      <Request />
      <FaqSection />
      <Closing title="Not sure where to start?" text="See what happens at a first visit, from your first message to your follow-up." img={A('/c2/golden.jpg')} alt="A woman in warm evening light (stock photo)" second={{ href: R('/your-visit'), label: 'Your visit, step by step' }} />
    </Shell>
  );
}
