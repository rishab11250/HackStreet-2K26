/**
 * Custom CSS cursors as data-URL SVGs, using `url(...) hotspotX hotspotY, fallback`.
 *
 * Browser notes (manual QA):
 * - Chromium / Firefox: SVG data URLs generally work; max cursor size often 128×128 (32×32 is safe).
 * - Safari (desktop): supported; falls back if URL fails to decode.
 * - Touch / iOS: custom cursor URLs are often ignored; OS shows default touch affordances — fallback after comma still applies where supported.
 * - Always provide a standard CSS cursor after the comma (crosshair / grab) so a usable pointer appears if the custom image is rejected.
 *
 * Hotspots are chosen at the pencil tip / eraser center for predictable drawing/erasing.
 */
const svgDataUrl = (svgMarkup) =>
  `url("data:image/svg+xml,${encodeURIComponent(svgMarkup)}")`;

const PENCIL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path d="M4 28 4 24 20 8l4 4L8 28H4z" fill="#242428" stroke="#0f0f12" stroke-width="1.1" stroke-linejoin="round"/><path d="M20 8 27 1l4 4-7 7-4-4z" fill="#c9a227"/><path d="M27 1l2 2-3 3-2-2 3-3z" fill="#f2e6c9"/></svg>`;

const ERASER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="9" fill="rgba(240,91,91,0.28)" stroke="#F05B5B" stroke-width="2"/></svg>`;

/** Pencil nib near lower-left of icon — hotspot (5, 27) in 32×32 space */
export const PENCIL_CURSOR = `${svgDataUrl(PENCIL_SVG)} 5 27, crosshair`;

/** Eraser hotspot at circle center */
export const ERASER_CURSOR = `${svgDataUrl(ERASER_SVG)} 14 14, crosshair`;
