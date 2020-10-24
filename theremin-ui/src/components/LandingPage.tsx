import React from 'react';
import { Button, Intent, InputGroup, Popover, Menu, MenuItem, Position } from '@blueprintjs/core';


import Message, { TIMEOUT } from 'utils/Message';

import 'styles/LandingPage.css';


interface Props { }

interface State {
  creatingNewRoom: boolean;
  roomCode: string;
}

export default class LandingPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      creatingNewRoom: true,
      roomCode: '',
    };
  }

  componentDidMount = () => { };

  launchNewRoom = () => {
    Message.show({
      timeout: TIMEOUT,
      message: 'Launching new room ...',
      icon: 'drawer-left',
      intent: Intent.PRIMARY,
    });
  };

  joinExistingRoom = () => {
    Message.show({
      timeout: TIMEOUT,
      message: 'Joining existing room ...',
      icon: 'drawer-left',
      intent: Intent.PRIMARY,
    });
  };

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
        content={
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
        }
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