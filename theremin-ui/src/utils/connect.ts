import Peer, { DataConnection } from 'peerjs';

export interface ChannelParams {
  /* The room code to send/receive messages. */
  roomCode: string;
  /* True if the user created this room from the landing page. */
  host: boolean;
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

  constructor(params: ChannelParams) {
    const {
      roomCode,
      host,
      onClose,
      onData,
      onError,
      onOpen,
    } = params;

    this.onClose = onClose;
    this.onData = onData;
    this.onError = onError;
    this.onOpen = onOpen;

    // Have PeerJS only print errors.
    this.peer = new Peer(host ? roomCode : undefined, {
      host: 'localhost',
      port: 9000,
      path: '/theremin',
      debug: 3,
    });
    this.setHandlers();

    if (!host) {
      console.log(`Trying to connect to peer ${roomCode}.`);
      this.connection = this.peer.connect(roomCode);
      console.log('connection', this.connection);
      this.setConnectionHandlers();
      console.log('setConnectionHandlers');
    }
  }

  /**
   * Attempts to send data. If there is no connection or the connection is not
   * open, no action is taken and `false` is returned.
   */
  sendData = (data: any) => {
    if (this.connection === null || !this.connection.open) return false;
    this.connection.send(data);
    return true;
  };

  private setHandlers = () => {
    this.peer!.on('open', this.connectToRoom);
    this.peer!.on('connection', this.onConnection);
    this.peer!.on('error', console.error);
    this.peer!.on('close', () => console.log('closing ...'));
    this.peer!.on('disconnected', () => console.log('disconnected ...'));
  };

  private connectToRoom = () => {
    // Close the current connection.
    if (this.connection !== null) {
      this.connection.close();
    }

    this.setConnectionHandlers();
  };

  private setConnectionHandlers = () => {
    if (this.connection === null) return;

    console.log('Connected to:', this.connection!.peer);

    this.connection!.on('close', () => {
      console.log('Connection Closed');
      this.connection = null;
      this.onClose();
    });
    this.connection!.on('data', d => {
      console.log(' data ... ', d);
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
