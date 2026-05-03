import { smoothPath } from './smoothPath';

const KEY_MAP = {
  id: 'i',
  type: 't',
  x: 'x',
  y: 'y',
  width: 'w',
  height: 'h',
  points: 'p',
  strokeColor: 'sc',
  fillColor: 'fc',
  strokeWidth: 'sw',
  opacity: 'o',
  fontSize: 'fs',
  fontWeight: 'fw',
  content: 'c',
  noteColor: 'nc',
  zIndex: 'z',
};

const REVERSE_KEY_MAP = Object.fromEntries(
  Object.entries(KEY_MAP).map(([k, v]) => [v, k])
);

/**
 * Compresses and encodes board elements to a URL-safe string
 */
export const serializeBoard = async (elements) => {
  try {
    // 1. Optimize elements: short keys, remove redundant data, round numbers
    const optimized = elements.map(el => {
      const newEl = {};
      for (const [key, value] of Object.entries(el)) {
        if (KEY_MAP[key]) {
          // Round numbers to 1 decimal place to save space
          if (typeof value === 'number' && key !== 'zIndex' && key !== 'createdAt') {
            newEl[KEY_MAP[key]] = Math.round(value * 10) / 10;
          } else if (key === 'points') {
            newEl[KEY_MAP[key]] = value.map(p => [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10]);
          } else {
            newEl[KEY_MAP[key]] = value;
          }
        }
      }
      return newEl;
    });

    const json = JSON.stringify(optimized);
    
    // 2. Compress using CompressionStream (GZIP)
    const stream = new Blob([json]).stream();
    const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
    const compressedResponse = new Response(compressedStream);
    const compressedBuffer = await compressedResponse.arrayBuffer();
    
    // 3. Convert to Base64 (URL-safe)
    const base64 = btoa(String.fromCharCode(...new Uint8Array(compressedBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
      
    return base64;
  } catch (e) {
    console.error('Failed to serialize board:', e);
    return '';
  }
};

/**
 * Decodes and parses board elements from a URL-safe string
 */
export const deserializeBoard = async (encoded) => {
  try {
    if (!encoded) return [];

    // 1. Decode Base64
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // 2. Decompress
    const stream = new Blob([bytes]).stream();
    const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
    const decompressedResponse = new Response(decompressedStream);
    const json = await decompressedResponse.text();
    
    // 3. Reconstruct elements: long keys, restore smoothPoints
    const optimized = JSON.parse(json);
    return optimized.map(opt => {
      const el = {};
      for (const [key, value] of Object.entries(opt)) {
        if (REVERSE_KEY_MAP[key]) {
          el[REVERSE_KEY_MAP[key]] = value;
        }
      }
      
      // Restore smoothPoints for freehand
      if (el.type === 'freehand' && el.points) {
        el.smoothPoints = smoothPath(el.points);
      }
      
      return el;
    });
  } catch (e) {
    console.error('Failed to deserialize board:', e);
    return [];
  }
};
