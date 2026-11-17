'use client';
import { go } from '@/lib/c1/util';

export default function Footer() {
  const link = (e, h) => { e.preventDefault(); go(h); };
  return (
    <footer className="relative overflow-hidden bg-[#050a18] px-[var(--m)] pb-8 pt-20">
      <div className="mx-auto grid max-w-[1400px] gap-10 text-[0.98rem] md:grid-cols-4">
        <div>
          <p className="display text-[1.3rem]">Varney <span className="text-ice">Wellness</span></p>
          <p className="mt-3 max-w-[26ch] text-cool">Physician-led wellness, designed around you.</p>
        </div>
        <div>
          <h3 className="mb-3 text-[0.85rem] font-bold uppercase tracking-[0.2em] text-ice">Explore</h3>
          <ul className="grid gap-2 text-cool">
            {[['About', '#perspective'], ['Services', '#care'], ['Experience', '#party'], ['Contact', '#cta']].map(([l, h]) => (
              <li key={l}><a href={h} onClick={(e) => link(e, h)} className="transition-colors hover:text-white">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-[0.85rem] font-bold uppercase tracking-[0.2em] text-ice">Visit</h3>
          <p className="text-cool">Address placeholder<br />Florida, USA<br />Hours to be confirmed</p>
        </div>
        <div>
          <h3 className="mb-3 text-[0.85rem] font-bold uppercase tracking-[0.2em] text-ice">Contact</h3>
          <p className="text-cool">Phone and email to be supplied by the practice.</p>
        </div>
      </div>

      <p aria-hidden="true" className="display mx-auto mt-16 max-w-[1400px] select-none whitespace-nowrap text-center text-[clamp(2.4rem,11.2vw,12rem)] leading-[0.85] text-transparent [-webkit-text-stroke:1.5px_rgba(139,223,255,0.28)]">
        Varney Wellness
      </p>

      <div className="mx-auto mt-10 flex max-w-[1400px] flex-wrap items-center justify-between gap-3 text-[0.82rem] text-cool">
        <p>Concept 01 of 03 · Illustrative preview, not a live medical website. Copy is placeholder pending approval.</p>
        <p>Credits: 3D head scan by Lee Perry-Smith (CC BY 3.0, triplegangers.com); skull by Vladimir Petkovic (CC0); sofa and candle holder by Wayfair (CC BY 4.0), via Khronos glTF Sample Assets; photos from Unsplash.</p>
      </div>
    </footer>
  );
}
