import { kHDivisions, kInitFreq, Sound } from 'audio/utils/theremin';

/**
 * Converts a sound into a color of red.
 */
export const calcColor = (sound: Sound) => {
  // Recover x, y values.
  const { frequency, volume } = sound;
  const x = Math.log2(+frequency / kInitFreq);
  const y = volume / kHDivisions;

  const clamp = (a: number, lo: number, hi: number) => (
    Math.max(lo, Math.min(hi, a))
  );
  // Map x, y to the range {0, 1, ..., 255}.
  const [xx,] = [x, y].map(p => Math.floor(clamp(256 * p, 0, 255)));
  return `rgba(${xx},0,0,${y})`;
};