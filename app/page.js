'use client';
import { useEffect } from 'react';
import { BASE } from '@/lib/asset';

// The site opens on Concept 01 (works as a static page on GitHub Pages too).
export default function Home() {
  useEffect(() => { window.location.replace(`${BASE}/concept-1/`); }, []);
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <p>
        <a href={`${BASE}/concept-1/`}>Concept 01</a> &nbsp;|&nbsp; <a href={`${BASE}/concept-2/`}>Concept 02</a>
      </p>
    </main>
  );
}
