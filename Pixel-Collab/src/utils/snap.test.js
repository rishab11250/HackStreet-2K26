import { clampGridSize, snapPoint, snapScalar } from './snap';

describe('snapScalar', () => {
  it('snaps to nearest grid step', () => {
    expect(snapScalar(23, 10)).toBe(20);
    expect(snapScalar(27, 10)).toBe(30);
    expect(snapScalar(-13, 10)).toBe(-10);
  });

  it('returns value when grid is invalid or value is not finite', () => {
    expect(snapScalar(5, 0)).toBe(5);
    expect(snapScalar(5, -1)).toBe(5);
    expect(snapScalar(NaN, 10)).toBeNaN();
  });
});

describe('snapPoint', () => {
  it('snaps both axes', () => {
    expect(snapPoint({ x: 12.4, y: 88.1 }, 20)).toEqual({ x: 20, y: 80 });
  });
});

describe('clampGridSize', () => {
  it('clamps to 10–100 and rounds', () => {
    expect(clampGridSize(5)).toBe(10);
    expect(clampGridSize(150)).toBe(100);
    expect(clampGridSize(33.7)).toBe(34);
  });
});
