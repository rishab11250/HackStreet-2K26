import { getElementBounds } from './geometry';

/** World-space snapping uses this many “CSS pixels worth” so it feels steady when zoom changes. */
export const SNAP_PEER_SCREEN_DEFAULT = 10;

/** @typedef {{ minX: number; maxX: number; minY: number; maxY: number }} AABB */

const EPS = 1e-6;

export function boundsToAABB(b) {
  return {
    minX: b.x,
    minY: b.y,
    maxX: b.x + b.width,
    maxY: b.y + b.height,
  };
}

export function shiftAABB(bb, dx, dy) {
  return {
    minX: bb.minX + dx,
    maxX: bb.maxX + dx,
    minY: bb.minY + dy,
    maxY: bb.maxY + dy,
  };
}

/**
 * Bounding box of moved selection at drag start (union of bounds in world coords).
 * @param {object[]} elements
 * @param {string[]} movingIds
 * @returns {AABB|null}
 */
export function selectionAABAtStart(elements, movingIds) {
  const idSet = new Set(movingIds);
  const movers = elements.filter((e) => idSet.has(e.id));
  if (movers.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  movers.forEach((el) => {
    const r = boundsToAABB(getElementBounds(el));
    minX = Math.min(minX, r.minX);
    minY = Math.min(minY, r.minY);
    maxX = Math.max(maxX, r.maxX);
    maxY = Math.max(maxY, r.maxY);
  });
  return { minX, maxX, minY, maxY };
}

/** AABBs of every element except those being dragged. */
export function collectPeersAABBs(elements, movingIds) {
  const idSet = new Set(movingIds);
  return elements
    .filter((e) => !idSet.has(e.id))
    .map((e) => boundsToAABB(getElementBounds(e)));
}

function xAnchors(bb) {
  const cx = (bb.minX + bb.maxX) / 2;
  return [
    { key: 'l', pos: bb.minX },
    { key: 'c', pos: cx },
    { key: 'r', pos: bb.maxX },
  ];
}

function yAnchors(bb) {
  const cy = (bb.minY + bb.maxY) / 2;
  return [
    { key: 't', pos: bb.minY },
    { key: 'c', pos: cy },
    { key: 'b', pos: bb.maxY },
  ];
}

function collectXTargets(peers) {
  const xs = [];
  peers.forEach((b) => {
    xs.push(b.minX, (b.minX + b.maxX) / 2, b.maxX);
  });
  return xs;
}

function collectYTargets(peers) {
  const ys = [];
  peers.forEach((b) => {
    ys.push(b.minY, (b.minY + b.maxY) / 2, b.maxY);
  });
  return ys;
}

/**
 * Finds smallest |correction| so an anchor aligns to a neighbor line within threshold.
 * @returns {{ corr: number, target: number | null }}
 */
function best1DAnchorsToTargets(anchors, targets, threshold) {
  let bestCorr = 0;
  let bestMag = threshold + 1;
  let bestTarget = null;
  anchors.forEach((a) => {
    targets.forEach((t) => {
      const corr = t - a.pos;
      const mag = Math.abs(corr);
      if (mag <= threshold && mag + EPS < bestMag) {
        bestMag = mag;
        bestCorr = corr;
        bestTarget = t;
      }
    });
  });
  if (bestMag > threshold) return { corr: 0, target: null };
  return { corr: bestCorr, target: bestTarget };
}

/** World-space guides for overlays (converted to screen in the UI). */
export function computePeerSnap(dx, dy, bbox0, peerAABBs, thresholdWorld) {
  if (
    !bbox0 ||
    peerAABBs.length === 0 ||
    !Number.isFinite(thresholdWorld) ||
    thresholdWorld <= 0
  ) {
    return {
      dx,
      dy,
      peerSnapActive: false,
      peerSnapGuides: [],
    };
  }

  const rawTentative = shiftAABB(bbox0, dx, dy);

  const tx = collectXTargets(peerAABBs);
  const ty = collectYTargets(peerAABBs);

  const xAnch = xAnchors(rawTentative);

  const xSnap = best1DAnchorsToTargets(xAnch, tx, thresholdWorld);
  const dxAdj = dx + xSnap.corr;
  const tentativeAfterX = shiftAABB(bbox0, dxAdj, dy);

  const ySnap = best1DAnchorsToTargets(yAnchors(tentativeAfterX), ty, thresholdWorld);
  const dyAdj = dy + ySnap.corr;
  const tentativeFinal = shiftAABB(bbox0, dxAdj, dyAdj);

  /** @type {Array<{ kind:'v'; x:number; y0:number; y1:number } | { kind:'h'; y:number; x0:number; x1:number }>} */
  const guides = [];

  let peerSnapActive = false;
  const pad = 360;

  if (xSnap.corr !== 0 && xSnap.target != null) {
    peerSnapActive = true;
    const yMid = (tentativeFinal.minY + tentativeFinal.maxY) / 2;
    guides.push({
      kind: 'v',
      x: xSnap.target,
      y0: yMid - pad,
      y1: yMid + pad,
    });
  }

  if (ySnap.corr !== 0 && ySnap.target != null) {
    peerSnapActive = true;
    const xMid = (tentativeFinal.minX + tentativeFinal.maxX) / 2;
    guides.push({
      kind: 'h',
      y: ySnap.target,
      x0: xMid - pad,
      x1: xMid + pad,
    });
  }

  return {
    dx: dxAdj,
    dy: dyAdj,
    peerSnapActive,
    peerSnapGuides: guides,
  };
}
