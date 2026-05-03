import { describe, expect, it } from 'vitest';
import {
  computePeerSnap,
  collectPeersAABBs,
  selectionAABAtStart,
  boundsToAABB,
} from './snapAlignment';
import { getElementBounds } from './geometry';

describe('computePeerSnap', () => {
  it('aligns moved box left edge to peer right edge when within threshold', () => {
    const bbox0 = { minX: 200, maxX: 300, minY: 100, maxY: 200 };
    const peers = [{ minX: 0, maxX: 100, minY: 100, maxY: 180 }];
    const rawDx = -99;
    const rawDy = 0;
    const res = computePeerSnap(rawDx, rawDy, bbox0, peers, 20);
    expect(res.dx).toBe(-100);
    expect(res.peerSnapActive).toBe(true);
    expect(res.peerSnapGuides.some((g) => g.kind === 'v' && g.x === 100)).toBe(true);
  });

  it('returns raw delta when peers are missing', () => {
    const bbox0 = { minX: 0, maxX: 10, minY: 0, maxY: 10 };
    const res = computePeerSnap(50, -12, bbox0, [], 10);
    expect(res.dx).toBe(50);
    expect(res.dy).toBe(-12);
    expect(res.peerSnapActive).toBe(false);
  });

  it('selectionAABAtStart merges movers', () => {
    const elements = [
      { id: 'a', type: 'rect', x: 10, y: 20, width: 30, height: 40, zIndex: 1 },
      { id: 'b', type: 'rect', x: 100, y: 0, width: 10, height: 10, zIndex: 1 },
    ];
    const bb = selectionAABAtStart(elements, ['a', 'b']);
    expect(bb).not.toBeNull();
    expect(bb.minX).toBe(10);
    expect(bb.minY).toBe(0);
  });

  it('collectPeersAABBs skips moving ids', () => {
    const elements = [{ id: 'x', type: 'rect', x: 0, y: 0, width: 10, height: 10 }];
    expect(collectPeersAABBs(elements, ['x']).length).toBe(0);
    expect(boundsToAABB(getElementBounds(elements[0])).minX).toBe(0);
  });
});
