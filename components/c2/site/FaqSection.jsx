'use client';
import { A } from '@/lib/asset';

import { FAQ } from './data';

/* questions beside a tall photograph, held on the contact page */
export default function FaqSection() {
  return (
      <section id="questions" className="scroll-mt-24 overflow-hidden bg-[#D9E2D6] px-[var(--m)] py-24 md:py-32">
        <div className="mx-auto grid max-w-[1360px] gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 className="c2-serif text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.92] text-[#173B35]">Questions</h2>
            <p className="mt-8 max-w-[40ch] text-[1.125rem] leading-relaxed text-[#173B35]">Florida, USA, by appointment only. The address is still to be confirmed, and every plan begins with a consultation.</p>
            <div className="mt-20 grid gap-14">
              {FAQ.map(([h, qs]) => (
                <div key={h}>
                  <h3 data-reveal className="c2-serif text-[clamp(1.9rem,2.6vw,2.4rem)] leading-none text-[#173B35]">{h}</h3>
                  <div className="mt-6 grid gap-3">
                    {qs.map(([q, a]) => (
                      <details key={q} data-reveal className="group rounded-[1.25rem] bg-[#cdd8c9] px-6 py-5 open:bg-[#F7F3EC]">
                        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-6 text-[1.1875rem] text-[#173B35] [&::-webkit-details-marker]:hidden">
                          {q}
                          <span className="relative h-4 w-4 shrink-0" aria-hidden="true"><span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 bg-[#173B35]" /><span className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 bg-[#173B35] transition-transform duration-300 group-open:scale-y-0" /></span>
                        </summary>
                        <p className="mt-3 max-w-[56ch] text-[1.0625rem] leading-relaxed text-[#242424]">{a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:col-span-5 lg:col-start-8 lg:block">
            <div className="sticky top-28">
              <div className="aspect-[3/4] overflow-hidden rounded-t-full"><img src={A('/images/care2.jpg')} alt="A warm, quiet treatment lounge (stock photo)" className="h-full w-full object-cover" /></div>
              <div className="absolute -bottom-10 -left-10 aspect-square w-[38%] overflow-hidden rounded-[12px] border-[6px] border-[#D9E2D6]"><img src={A('/c2/bottles.jpg')} alt="" className="h-full w-full object-cover" /></div>
              <div className="absolute -right-6 top-[40%] aspect-[3/4] w-[30%] overflow-hidden rounded-[12px] border-[6px] border-[#D9E2D6]"><img src={A('/c2/lotion.jpg')} alt="" loading="lazy" className="h-full w-full object-cover" /></div>
            </div>
          </div>
        </div>
      </section>

  );
}
