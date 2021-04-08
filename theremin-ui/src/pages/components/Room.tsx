import React from 'react';
import { Intent, Spinner } from '@blueprintjs/core';
import * as Tone from 'tone';

import Message, { kTimeout } from 'misc/utils/Message';
import Channel from 'networking/utils/connect';
import 'styles/Room.css';


/** Initial frequency (all the way left). */
const kInitFreq = 440;
/** Decibels per height. */
const kHDivisions = 20;
const kWaveType = 'sine';
const kInitVol = -10;
const kBlack = '#000000';

/** Represents the location of a mouse cursor. */
type Location = {
  x: number;
  y: number;
};

/** Represents qualities of a sound. */
type Sound = {
  frequency: number;
  volume: number;
};

/** The state of the theremin. */
enum Stage {
  Loading,
  Playing,
  Muted,
}

interface Props {
  channel: Channel;
}

interface State {
  color: string;
  stage: Stage;
}

// Converts a sound into a color of red.
const calcColor = (sound: Sound) => {
  // Recover x, y values.
  const { frequency, volume } = sound;
  const x = Math.log2(frequency / kInitFreq);
  const y = volume / kHDivisions;

  const clamp = (a: number, lo: number, hi: number) => (
    Math.max(lo, Math.min(hi, a))
  );
  // Map x, y to the range {0, 1, ..., 255}.
  const [xx, yy] = [x, y].map(p => Math.floor(clamp(256 * p, 0, 255)));
  return `rgba(${xx},0,0,${y})`;
};

/**
 * A `Room` is the main playground for playing with the theremin.
 * On this page, users are able to see their peer's mouse location as well.
 */
export default class Room extends React.Component<Props, State> {
  channel: Channel;
  osc: Tone.Oscillator;
  screenRef: React.RefObject<HTMLDivElement>;
  myLocation: Location;
  peerLocation: Location;

  constructor(props: Props) {
    super(props);
    const { channel } = props;

    this.peerLocation = { x: 0, y: 0 };
    this.myLocation = { x: 0, y: 0 };
    this.channel = channel;
    this.channel.openRoom({
      onClose: this.onClose,
      onData: this.onData,
      onError: this.onError,
      onOpen: this.onOpen,
    });

    this.osc = new Tone
      .Oscillator({ type: kWaveType, frequency: kInitFreq, volume: kInitVol })
      .toDestination();
    this.screenRef = React.createRef();
    this.state = {
      color: kBlack,
      stage: Stage.Loading,
    };
  }

  /**
   * Called when peer connection opens.
   */
  private onOpen = () => {
    console.log('opened peer connection.');
  };

  /**
   * Called when there is an error in the peer connection.
   */
  private onError = (error: any) => {
    console.log('error in peer connection:', error);
  };

  /**
   * Called when peer connection closes.
   */
  private onClose = () => {
    console.log('closing peer connection.');
  };

  /**
   * Called when data received from peer. Updates theremin sound.
   */
  private onData = (data: any) => {
    const peerLocation = data as Location;
    this.peerLocation = peerLocation;
    this.updateSound();
  };

  /**
   * Fired when the left mouse is released. Turns on theremin.
   */
  private onMouseDown = () => {
    this.osc.start();
    this.setState({
      stage: Stage.Playing,
    });
  };

  /**
   * Fired when the left mouse is released. Turns off theremin.
   */
  private onMouseUp = () => {
    this.osc.stop();
    this.setState({
      stage: Stage.Muted,
    });
  };

  /**
   * Takes the average _normalized_ location and converts to a sound.
   */
  private locsToSound = (locs: Location[]): Sound | null => {
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
   * Converts the (x,y) location on the screen into the range [0,1]x[0,1].
   */
  private normalize = (location: Location): Location | null => {
    const { current } = this.screenRef;

    // Somehow the rectangle could not be found.
    if (current === null) return null;

    const { height, width } = current.getBoundingClientRect();
    const { x, y } = location;
    return { x: x / width, y: y / height };
  };

  /**
   * Fired when the mouse moves. Changes stored location and theremin sound.
   */
  private onMouseMove = (event: MouseEvent) => {
    const normalized = this.normalize({ x: event.x, y: event.y });
    if (normalized === null) return;

    this.myLocation = normalized;
    this.updateSound();
  }

  /**
   * Updates the sound of the theremin and sends data to peer.
   */
  private updateSound = () => {
    const sound = this.locsToSound([
      this.myLocation, this.peerLocation,
    ]);

    // Cursor is off of the screen.
    if (sound === null) return;

    // Send this data to the peer!
    this.channel.sendData(this.myLocation);

    const { frequency, volume } = sound;

    this.osc.frequency.value = frequency;
    this.osc.volume.value = volume;

    const { stage } = this.state;
    if (stage !== Stage.Playing) return;

    const color = calcColor(sound);
    this.setState({ stage, color });
  };

  /**
   * Initialization of UI code.
   */
  componentDidMount = () => {
    Message.show({
      timeout: kTimeout,
      message: 'Successfully joined room',
      icon: 'tick',
      intent: Intent.SUCCESS,
    });

    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    this.setState({
      stage: Stage.Playing,
    });
  };

  /**
   * User is not using this page any more.
   */
  componentWillUnmount = () => {
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
  };

  /**
   * Where everything comes together: spits out the HTML code.
   */
  render = () => {
    const { stage, color } = this.state;
    return (
      <div
        className='full'
        ref={this.screenRef}
        style={{
          borderColor: stage === Stage.Playing ? color : kBlack,
          borderWidth: '7px',
          borderStyle: 'solid',
        }}
      >
        <h1>{this.channel.id}</h1>
        {stage === Stage.Loading && <Spinner />}
      </div>
    );
  };
}