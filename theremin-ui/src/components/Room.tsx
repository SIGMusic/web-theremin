import React from 'react';
import {
  ProgressBar, InputGroup, Button, Intent, FormGroup, Tooltip, H5, Slider,
  Colors, Spinner,
} from '@blueprintjs/core';

import Message, { TIMEOUT } from 'utils/Message';
import 'styles/Room.css';


const {
  REACT_APP_THEREMIN_HOST = 'localhost',
  REACT_APP_THEREMIN_PORT = '',
} = process.env;


enum Stage {
  Loading,
}

interface Props {
  roomCode: string;
}

interface State {
  stage: Stage;
}

export default class Room extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      stage: Stage.Loading,
    };
  }

  componentDidMount = () => {
    // TODO(davidb2): Connect w/ peer.
    Message.show({
      timeout: TIMEOUT,
      message: 'Successfully joined room',
      icon: 'tick',
      intent: Intent.SUCCESS,
    });
  };

  componentWillUnmount = () => { };

  render = () => {
    const { stage } = this.state;
    return <div>{stage === Stage.Loading && <Spinner />}</div>;
  };
}