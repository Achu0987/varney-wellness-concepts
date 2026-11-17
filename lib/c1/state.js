// Shared, mutable scene state. GSAP (scroll) writes it, the R3F rig reads and damps it every frame.
export const S = {
  // camera
  cx: 0, cy: 1.7, cz: 10.4, lx: 0, ly: 1.45, lz: 0,
  // sculpture
  sx: 2.6, sy: 0, rot: -0.55, scale: 1,
  // look
  xray: 0.15, glow: 1, flood: 0,
  // env flags (set on mount)
  reduced: false, mobile: false,
  mouse: { x: 0, y: 0 },
};

export const KEYS = ['cx', 'cy', 'cz', 'lx', 'ly', 'lz', 'sx', 'sy', 'rot', 'scale', 'xray', 'glow', 'flood'];
