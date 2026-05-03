import { vi } from 'vitest';

/**
 * Minimal CanvasRenderingContext2D stub for jsdom (no `canvas` npm package).
 */
export function createCanvasContextMock() {
  return {
    canvas: null,
    scale: vi.fn(),
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    putImageData: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    set lineDashOffset(_v) {},
    get lineDashOffset() {
      return 0;
    },
    set fillStyle(_v) {},
    get fillStyle() {
      return '';
    },
    set strokeStyle(_v) {},
    get strokeStyle() {
      return '';
    },
    set lineWidth(_v) {},
    get lineWidth() {
      return 1;
    },
    set font(_v) {},
    get font() {
      return '';
    },
    set globalAlpha(_v) {},
    get globalAlpha() {
      return 1;
    },
    set globalCompositeOperation(_v) {},
    get globalCompositeOperation() {
      return 'source-over';
    },
    set lineCap(_v) {},
    get lineCap() {
      return 'butt';
    },
    set lineJoin(_v) {},
    get lineJoin() {
      return 'miter';
    },
    set miterLimit(_v) {},
    get miterLimit() {
      return 10;
    },
    setLineDash: vi.fn(),
  };
}

export function installCanvasMock() {
  const orig = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function getContextMock(type, ...rest) {
    if (type === '2d') {
      const ctx = createCanvasContextMock();
      ctx.canvas = this;
      return ctx;
    }
    return orig.call(this, type, ...rest);
  };
}
