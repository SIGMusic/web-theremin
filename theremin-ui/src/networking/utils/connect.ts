import Peer, { DataConnection } from 'peerjs';

export interface ChannelParams {
  /* The room code to send/receive messages. */
  peerId?: string;
  /* Called when id is ready to use. */
  onIdGiven?: (myId: string) => void;
}

export interface RoomParams {
  /* Called when connection closed. */
  onClose: () => void;
  /* Called when data is received. */
  onData: (data: any) => void;
  /* Called when an error occurs. */
  onError: (error: any) => void;
  /* Called when connection is ready to use. */
  onOpen: () => void;
}

/**
 * Object allowing for the transmission of messages.
 */
export default class Channel {
  private connection: DataConnection | null = null;
  private peer: Peer | null = null;
  private onClose: () => void;
  private onData: (data: any) => void;
  private onError: (error: any) => void;
  private onOpen: () => void;
  private onIdGiven: (myId: string) => void;
  private peerId: string | null = null;
  private myId: string | null = null;

  constructor(params: ChannelParams) {
    const {
      peerId,
      onIdGiven,
    } = params;

    this.onIdGiven = onIdGiven || (() => {});
    this.peerId = peerId || null;

    // Have PeerJS only print errors.
    this.peer = new Peer(undefined, {
      secure: true,
      host: 'web-theremin-peer-js-server.herokuapp.com',
      port: 443,
      key: 'CheR4uo4',
      debug: 1,
    });
    this.setHandlers();
  }

  /** The id of the user in this channel. */
  get id(): string | null { return this.myId; }

  /**
   * Sets up handlers, kinda the second initializer.
   */
  openRoom = (params: RoomParams) => {
    const {
      onClose,
      onData,
      onError,
      onOpen,
    } = params;

    this.onClose = onClose;
    this.onData = onData;
    this.onError = onError;
    this.onOpen = onOpen;
  };

  /**
   * Attempts to send data. If there is no connection or the connection is not
   * open, no action is taken and `false` is returned.
   */
  sendData = (data: any) => {
    if (this.connection === null || !this.connection.open) return false;
    this.connection.send(data);
    return true;
  };

  /**
   * Sets up handlers.
   */
  private setHandlers = () => {
    this.peer!.on('open', myId => {
      this.connectToRoom(myId);
    });
    this.peer!.on('connection', connection => {
      this.onConnection(connection);
    });
    this.peer!.on('error', e => {
      console.error('error', e);
    });
    this.peer!.on('close', () => console.log('closing ...'));
    this.peer!.on('disconnected', () => console.log('disconnected ...'));
  };

  /**
   * Attempts to connect to a peer.
   * The input is this user's id, not the peer's id.
   * We already know the peer's id, or else there is no peer.
   */
  private connectToRoom = (myId: string) => {
    this.myId = myId;
    this.onIdGiven(myId);
    if (this.peerId !== null) {
      console.log(`Trying to connect to peer ${this.peerId}.`);
      this.connection = this.peer!.connect(this.peerId, { reliable: true });
      this.setConnectionHandlers();
    }
  };

  /**
   * Channel handlers.
   */
  private setConnectionHandlers = () => {
    if (this.connection === null) return;

    console.log('Connected to:', this.connection!.peer);

    this.connection!.on('close', () => {
      console.log('Connection Closed');
      this.connection = null;
      this.onClose();
    });
    this.connection!.on('data', d => {
      this.onData(d);
    });
    this.connection!.on('error', e => {
      console.error(' error ... ', e);
      this.onError(e);
    });
    this.connection!.on('open', () => {
      console.log(' open ... ');
      this.onOpen();
    });
  };

  /**
   * Called after receiveing DataConnection.
   */
  private onConnection = (connection: DataConnection) => {
    console.log('Recieved connection');

    // Only allow a single connection.
    if (this.connection !== null && this.connection.open) {
      console.log('Second connection attempt refused');
      connection.on('open', () => {
        connection.send('Already connected to another client.');
        connection.close();
      });
      return;
    }

    // If not occupied, connect.
    this.connection = connection;
    this.setConnectionHandlers();
  };
}
