import { describe, expect, it } from 'vitest';
import { getElementBounds, initialsFromName } from './geometry';

describe('initialsFromName', () => {
  it('builds two-letter initials', () => {
    expect(initialsFromName('Jordan Lee')).toBe('JL');
    expect(initialsFromName('Ada')).toBe('A');
  });
});

describe('getElementBounds freehand', () => {
  it('prefers smoothPoints over raw points when both exist', () => {
    const el = {
      type: 'freehand',
      x: 0,
      y: 0,
      strokeWidth: 4,
      points: [
        [100, 100],
        [110, 100],
      ],
      smoothPoints: [
        [95, 98],
        [120, 105],
      ],
    };
    const b = getElementBounds(el);
    expect(b.x).toBeLessThanOrEqual(93);
    expect(b.width).toBeGreaterThan(20);
  });

  it('pads by half stroke width', () => {
    const el = {
      type: 'freehand',
      x: 50,
      y: 50,
      strokeWidth: 10,
      points: [
        [100, 100],
        [110, 110],
      ],
      smoothPoints: [],
    };
    const b = getElementBounds(el);
    expect(b.x).toBe(95);
    expect(b.y).toBe(95);
    expect(b.width).toBe(20);
    expect(b.height).toBe(20);
  });
});
