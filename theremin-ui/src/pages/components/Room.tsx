import React from 'react';
import { Surface } from 'gl-react-dom';
import { Shaders, Node, GLSL } from 'gl-react';
import { Intent, Spinner } from '@blueprintjs/core';

import Theremin from 'audio/utils/theremin';
import { calcColor } from 'graphics/utils/color';
import Mice from 'graphics/components/Mice';
import { Location } from 'misc/utils/location';
import Message, { kTimeout } from 'misc/utils/Message';
import Channel from 'networking/utils/connect';
import 'styles/Room.css';


const kBlack = '#000000';

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
  mouse: Location;
}

/**
 * A `Room` is the main playground for playing with the theremin.
 * On this page, users are able to see their peer's mouse location as well.
 */
export default class Room extends React.Component<Props, State> {
  channel: Channel;
  theremin: Theremin;
  screenRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    const { channel } = props;
    // Get the channel that was passed down.
    this.channel = channel;

    this.channel.openRoom({
      onClose: this.onClose,
      onData: this.onData,
      onError: this.onError,
      onOpen: this.onOpen,
    });

    this.theremin = new Theremin({
      frequency: 440,
      type: 'sine',
      volume: -10,
    });

    this.screenRef = React.createRef();

    this.state = {
      color: kBlack,
      stage: Stage.Loading,
      mouse: { x: 0, y: 0 },
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
    this.theremin.peerLocation = peerLocation;
    this.updateSound(false);
  };

  /**
   * Updates the sound played. If  
   * @param broadcast whether or not to broadcast location to peer if relevant.
   * @returns 
   */
  private updateSound = (broadcast: boolean) => {
    const sound = this.theremin.updateSound();

    // Cursor is off of the screen.
    if (sound === null) return;

    // Send this data to the peer!
    if (broadcast) {
      this.channel.sendData(this.theremin.myLocation);
    }

    const { stage } = this.state;
    if (stage !== Stage.Playing) return;

    const color = calcColor(sound);
    this.setState({ stage, color });
  };

  /**
   * Fired when the left mouse is released. Turns on theremin.
   */
  private onMouseDown = () => {
    this.theremin.start();
    this.setState({
      stage: Stage.Playing,
    });
  };

  /**
   * Fired when the left mouse is released. Turns off theremin.
   */
  private onMouseUp = () => {
    this.theremin.stop();
    this.setState({
      stage: Stage.Muted,
    });
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

    this.theremin.myLocation = normalized;
    this.updateSound(true);
    this.setState({
      mouse: this.theremin.myLocation,
    });
  }

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
    const { stage, color, mouse } = this.state;
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
        <Surface
          width={300}
          height={300}>
          <Mice mouse={mouse} />
        </Surface>
      </div>
    );
  };
}