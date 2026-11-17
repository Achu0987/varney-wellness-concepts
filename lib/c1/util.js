export function go(id) {
  const el = typeof id === 'string' ? document.querySelector(id) : id;
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export function toast(message) {
  window.dispatchEvent(new CustomEvent('c1-toast', { detail: message }));
}
