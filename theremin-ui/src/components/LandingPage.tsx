/* eslint-disable */
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Intent, InputGroup, Popover, Menu, MenuItem, Position,
} from '@blueprintjs/core';
import randomstring from 'randomstring';


import Message, { TIMEOUT } from 'utils/Message';

import 'styles/LandingPage.css';


interface JoinRoomParams {
  roomCode: string;
  host: boolean;
}

interface Props extends RouteComponentProps { }

interface State {
  /* Toggle for determining whether the user wants to create a new room or join
   * an existing room.
   */
  creatingNewRoom: boolean;
  /* The room code typed into the text box by the user. */
  roomCode: string;
}


/**
 * Represents the LandingPage that the user will initially see when navigating
 * to the theremin application, granted that they did not specify a room code
 * in the url.
 */
class LandingPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      creatingNewRoom: true,
      roomCode: '',
    };
  }

  componentDidMount = () => { };

  /**
   * Generates a random alphanumeric string.
   */
  generateRoomCode = () => (
    randomstring.generate({
      length: 5,
      charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    })
  );

  /**
   * Join a room.
   *
   * @param roomCode - the code of the room to join.
   *
   * This function loads a new page.
   */
  joinRoom = ({ roomCode, host }: JoinRoomParams) => {
    const { history } = this.props;
    const hostString = host ? '?host=true' : '';
    history.push(`${process.env.NODE_ENV === 'production' ? '/web-theremin' : ''}/${roomCode}${hostString}`);
  };

  /**
   * Creates a brand new room.
   * The code for the room is randomly generated within this function.
   */
  launchNewRoom = () => {
    Message.show({
      timeout: TIMEOUT,
      message: 'Launching new room ...',
      icon: 'drawer-left',
      intent: Intent.PRIMARY,
    });

    const roomCode = this.generateRoomCode();
    this.joinRoom({ roomCode, host: true });
  };

  /**
   * Joins a room using the room code specified in the input box.
   *
   */
  joinExistingRoom = () => {
    Message.show({
      timeout: TIMEOUT,
      message: 'Joining existing room ...',
      icon: 'drawer-left',
      intent: Intent.PRIMARY,
    });

    const { roomCode } = this.state;
    this.joinRoom({ roomCode, host: false });
  };


  /**
   * A toggle for determining whether the user wants to create a new room or
   * join an existing room.
   *
   * @param yes - If yes is `true`, then the user desires to create a new room.
   *
   * This function updates the state.
   */
  setNewRoom = (yes: boolean) => (
    this.setState({
      creatingNewRoom: yes,
    })
  );

  /**
   * Update the room code while the user types.
   */
  onCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRoomCode = e.target.value.toUpperCase();
    const { target } = e;
    const { selectionStart, selectionEnd } = target;
    return this.setState({
      roomCode: newRoomCode,
    }, () => target.setSelectionRange(selectionStart || 0, selectionEnd || 0));
  };

  render = () => {
    const { creatingNewRoom, roomCode } = this.state;
    const newOrExistingRoomMenu = (
      <Popover
        content={(
          <Menu>
            <MenuItem
              text="Create New Room"
              onClick={() => this.setNewRoom(true)}
            />
            <MenuItem
              text="Join Existing Room"
              onClick={() => this.setNewRoom(false)}
            />
          </Menu>
        )}
        position={Position.BOTTOM_RIGHT}
      >
        <Button
          rightIcon="caret-down"
          text={creatingNewRoom ? 'Create New Room' : 'Join Existing Room'}
        />
      </Popover>
    );

    return (
      <div>
        <h1>Theremin</h1>
        <InputGroup
          disabled={creatingNewRoom}
          large
          placeholder="JM4W7"
          rightElement={newOrExistingRoomMenu}
          onChange={this.onCodeChange}
          value={roomCode}
        />
        <Button
          large
          intent={Intent.PRIMARY}
          text="Launch!"
          onClick={creatingNewRoom ? this.launchNewRoom : this.joinExistingRoom}
        />
      </div>
    );
  };
}

export default withRouter(LandingPage);