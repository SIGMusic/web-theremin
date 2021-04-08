/* eslint-disable */
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Intent, InputGroup, Popover, Menu, MenuItem, Position,
} from '@blueprintjs/core';

import Room from 'pages/components/Room';
import Message, { TIMEOUT } from 'misc/utils/Message';
import Channel from 'networking/utils/connect';

import 'styles/LandingPage.css';

enum Action {
  WaitingForId,
  ReadyToJoinRoom,
  JoiningRoom,
}

interface Props extends RouteComponentProps { }

interface State {
  /* Toggle for determining whether the user wants to create a new room or join
   * an existing room.
   */
  creatingNewRoom: boolean;
  /* The room code typed into the text box by the user. */
  peerId: string;
  action: Action;
}


/**
 * Represents the LandingPage that the user will initially see when navigating
 * to the theremin application, granted that they did not specify a room code
 * in the url.
 */
class LandingPage extends React.Component<Props, State> {
  private channel: Channel;

  constructor(props: Props) {
    super(props);

    this.channel = new Channel({ onIdGiven: this.onIdGiven });

    this.state = {
      creatingNewRoom: false,
      peerId: '',
      action: Action.WaitingForId,
    };
  }

  componentDidMount = () => { };

  onIdGiven = () => {
    this.setState({
      action: Action.ReadyToJoinRoom,
    });
  };


  /**
   * Join a room.
   *
   * @param peerId - the code of the room to join.
   *
   * This function loads a new page.
   */
  joinRoom = () => {
    this.setState({
      action: Action.JoiningRoom,
    });
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

    this.joinRoom();
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

    // We need to create a new channel.
    const { peerId } = this.state;
    this.channel = new Channel({ peerId });

    this.joinRoom();
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
    const newPeerId = e.target.value;
    const { target } = e;
    const { selectionStart, selectionEnd } = target;
    return this.setState({
      peerId: newPeerId,
    }, () => target.setSelectionRange(selectionStart || 0, selectionEnd || 0));
  };

  render = () => {
    const { creatingNewRoom, peerId, action } = this.state;

    if (action === Action.JoiningRoom) {
      return <Room channel={this.channel} />;
    }

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
          placeholder=""
          rightElement={newOrExistingRoomMenu}
          onChange={this.onCodeChange}
          value={peerId}
        />
        {action !== Action.WaitingForId &&
        <Button
          large
          intent={Intent.PRIMARY}
          text="Launch!"
          onClick={creatingNewRoom ? this.launchNewRoom : this.joinExistingRoom}
        />
        }
      </div>
    );
  };
}

export default withRouter(LandingPage);