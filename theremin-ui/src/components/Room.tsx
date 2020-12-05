/* eslint-disable */
import React from 'react';
import {
  ProgressBar, InputGroup, Button, Intent, FormGroup, Tooltip, H5, Slider,
  Colors, Spinner,
} from '@blueprintjs/core';
import * as Tone from 'tone';

import Message, { TIMEOUT } from 'utils/Message';
import Channel, { ChannelParams } from 'utils/connect';
import 'styles/Room.css';


const {
  REACT_APP_THEREMIN_HOST = 'localhost',
  REACT_APP_THEREMIN_PORT = '',
} = process.env;

// Initial frequency (all the way left).
const kInitFreq = 440;
// Decibels per height.
const kHDivisions = 20;
const kWaveType = 'sine';
const kInitVol = -10;
const kBlack = '#000000';

// Represents the location of a mouse cursor.
type Location = {
  x: number;
  y: number;
};

// Represents qualities of a sound.
type Sound = {
  frequency: number;
  volume: number;
};

enum Stage {
  Loading,
  Playing,
  Muted,
}

interface Props {
  roomCode: string;
  host: boolean;
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

export default class Room extends React.Component<Props, State> {
  channel: Channel | null = null;
  osc: Tone.Oscillator;
  screenRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);

    this.osc = new Tone
      .Oscillator({ type: kWaveType, frequency: kInitFreq, volume: kInitVol })
      .toDestination();
    this.screenRef = React.createRef();
    this.state = {
      color: kBlack,
      stage: Stage.Loading,
    };
  }

  private onOpen = () => {
    console.log('opened connection.');
    console.log('sending greeting.');
    this.channel!.sendData({ message: 'hi' });
  };

  private onError = (error: any) => {
    console.log('Got an error', error);
  };

  private onClose = () => {
    console.log('closed connection lol.');
  };

  private onData = (data: any) => {
    console.log(`data received: ${data}`);
  };

  private onMouseDown = () => {
    this.osc.start();
    this.setState({
      stage: Stage.Playing,
    });
  };

  private onMouseUp = () => {
    this.osc.stop();
    this.setState({
      stage: Stage.Muted,
    });
  };

  /**
   * Takes the average location and converts to a sound.
   */
  private locsToSound = (locs: Location[]): Sound | null => {
    const { current } = this.screenRef;
    // Somehow the rectangle cannot be found.
    if (current === null) return null;

    const { height, width } = current.getBoundingClientRect();
    console.log(height, width);
    /* Mean of a list. */
    const mean = (zs: number[]) => zs.reduce((a, b) => a + b) / zs.length;
    const xs = locs.map(({ x }) => x / width);
    const ys = locs.map(({ y }) => y / height);
    const x = mean(xs);
    const y = mean(ys);

    if (!(0 <= x && x <= 1 && 0 <= y && y <= 1)) return null;

    const frequency = kInitFreq * (2 ** x);
    const volume = kHDivisions * y;
    return { frequency, volume };
  };


  private onMouseMove = (event: MouseEvent) => {
    const { x, y } = event;

    const sound = this.locsToSound([
      { x, y },
    ]);
    // Cursor is off of the screen.
    if (sound === null) return;

    const { frequency, volume } = sound;
    console.log(`(${x}, ${y}) => ${frequency} Hz, ${volume} db`);

    this.osc.frequency.value = frequency;
    this.osc.volume.value = volume;

    const { stage } = this.state;
    if (stage !== Stage.Playing) return;

    const color = calcColor(sound);
    this.setState({ stage, color });
  };

  componentDidMount = () => {
    // TODO(davidb2): incorporate peer.
    /*
    const { roomCode, host } = this.props;

    this.channel = new Channel({
      roomCode,
      host,
      onClose: this.onClose,
      onData: this.onData,
      onError: this.onError,
      onOpen: this.onOpen,
    });
    */

    Message.show({
      timeout: TIMEOUT,
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

  componentWillUnmount = () => {
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
  };

  render = () => {
    const { stage, color } = this.state;
    console.log(color);
    return (
      <div
        className="full"
        ref={this.screenRef}
        style={{
          borderColor: stage === Stage.Playing ? color : kBlack,
          borderWidth: '7px',
          borderStyle: 'solid',
        }}
      >
        {stage === Stage.Loading && <Spinner />}
      </div>
    );
  };
}