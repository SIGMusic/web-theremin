import Peer, { DataConnection } from 'peerjs';

export interface ChannelParams {
  /* The room code to send/receive messages. */
  roomCode: string;
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
  connection: DataConnection | null = null;
  peer: Peer | null = null;
  onClose: () => void;
  onData: (data: any) => void;
  onError: (error: any) => void;
  onOpen: () => void;

  constructor({ roomCode, onData }: ChannelParams) {
    // Have PeerJS only print errors
    this.onData = onData;
    this.peer = new Peer(roomCode, {
      debug: 1,
    });
    this.setHandlers();
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
  };

  private connectToRoom = () => {
    // Close the current connection.
    if (this.connection !== null) {
      this.connection.close();
    }

    this.setConnectionHandlers();
  };

  private setConnectionHandlers = () => {
    console.log('Connected to:', this.connection!.peer);

    this.connection!.on('close', () => {
      console.log('Connection Closed');
      this.connection = null;
      this.onClose();
    });
    this.connection!.on('data', this.onData);
    this.connection!.on('error', this.onError);
    this.connection!.on('open', this.onOpen);
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
