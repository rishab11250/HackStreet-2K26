import useViewport from '../hooks/useViewport';

/**
 * Figma-like alignment rails while snapping to peers (world coordinates → overlay).
 */
export default function SnapGuideLines({ guides }) {
  const { toScreen } = useViewport();

  if (!guides?.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[41] overflow-hidden" aria-hidden>
      {guides.map((g, i) => {
        if (g.kind === 'v') {
          const a = toScreen(g.x, g.y0);
          const b = toScreen(g.x, g.y1);
          const top = Math.min(a.y, b.y);
          const h = Math.abs(b.y - a.y);
          const left = a.x - 0.75;
          return (
            <div
              key={`v-${i}`}
              className="absolute rounded-full shadow-[0_0_10px_var(--color-primary)] transition-opacity duration-150"
              style={{
                left,
                top,
                width: 2,
                height: Math.max(h, 1),
                backgroundColor: 'var(--color-primary)',
                opacity: 0.9,
              }}
            />
          );
        }
        const a = toScreen(g.x0, g.y);
        const b = toScreen(g.x1, g.y);
        const left = Math.min(a.x, b.x);
        const w = Math.abs(b.x - a.x);
        const top = a.y - 0.75;
        return (
          <div
            key={`h-${i}`}
            className="absolute rounded-full shadow-[0_0_10px_var(--color-primary)] transition-opacity duration-150"
            style={{
              left,
              top,
              width: Math.max(w, 1),
              height: 2,
              backgroundColor: 'var(--color-primary)',
              opacity: 0.9,
            }}
          />
        );
      })}
    </div>
  );
}
