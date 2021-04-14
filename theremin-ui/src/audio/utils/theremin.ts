import * as Tone from 'tone';
import { ToneOscillatorConstructorOptions } from 'tone/build/esm/source/oscillator/OscillatorInterface';
import { Decibels, Frequency, Hertz } from 'tone/Tone/core/type/Units';

/** Initial frequency (all the way left). */
export const kInitFreq: Hertz = 440;
/** Decibels per height. */
export const kHDivisions = 20;

/** Represents qualities of a sound. */
export type Sound = {
  frequency: Frequency;
  volume: Decibels;
};

/** Represents the location of a mouse cursor. */
export type Location = {
  x: number;
  y: number;
};

export type ThereminParams = Partial<ToneOscillatorConstructorOptions>;


/**
 * Takes the average _normalized_ location and converts to a sound.
 */
const locsToSound = (locs: Location[]): Sound | null => {
  // Mean of a list.
  const mean = (zs: number[]) => zs.reduce((a, b) => a + b) / zs.length;
  const xs = locs.map(({ x }) => x);
  const ys = locs.map(({ y }) => y);
  const x = mean(xs);
  const y = mean(ys);

  if (!(0 <= x && x <= 1 && 0 <= y && y <= 1)) return null;

  const frequency = kInitFreq * (2 ** x);
  const volume = kHDivisions * y;
  return { frequency, volume };
};


/**
 * Represents a Theremin with two players.
 */
export default class Theremin {
  osc: Tone.Oscillator;
  myLocation: Location;
  peerLocation: Location;

  constructor(params: ThereminParams) {
    this.osc = new Tone.Oscillator(params).toDestination();
    this.peerLocation = { x: 0, y: 0 };
    this.myLocation = { x: 0, y: 0 };
  }

  public start() {
    this.osc.start();
  }

  public stop() {
    this.osc.stop();
  }

  /**
   * Updates the sound of the theremin and sends data to peer.
   * Returns the combined sound to be played.
   */
  public updateSound = () => {
    const sound = locsToSound([
      this.myLocation, this.peerLocation,
    ]);

    // Cursor is off of the screen.
    if (sound === null) return null;

    const { frequency, volume } = sound;

    this.osc.frequency.value = frequency;
    this.osc.volume.value = volume;

    return sound;
  };

}
