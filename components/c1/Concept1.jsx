'use client';
import dynamic from 'next/dynamic';
import ScrollDirector from './ScrollDirector';
import { Nav, CursorAndProgress, Toast, ChapterLabel } from './Chrome';
import Hero from './Hero';
import Perspective from './Perspective';
import Care from './Care';
import Party from './Party';
import Space from './Space';
import Moments from './Moments';
import Doctor from './Doctor';
import FinalCta from './FinalCta';
import Footer from './Footer';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

export default function Concept1() {
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Scene />
      <ScrollDirector />
      <Nav />
      <CursorAndProgress />
      <ChapterLabel />
      <Toast />
      <main id="main" className="relative z-10">
        <Hero />
        <Perspective />
        <Care />
        <Space />
        <Party />
        <Moments />
        <Doctor />
        <FinalCta />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
