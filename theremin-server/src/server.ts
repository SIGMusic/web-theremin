#!/usr/bin/env node
import 'module-alias/register';
import dotenv from 'dotenv';
import { PeerServer } from 'peer';
import { Server } from 'net';


dotenv.config();

const { PATH = '/theremin', PORT = '9000' } = process.env;

const onServerRunning = (server: Server) => {
  if (server === null) {
    console.error('server not started :(');
    return;
  }

  const addr = server.address();
  if (addr === null || typeof addr === 'string') {
    console.error('address not found :(');
    return;
  }

  const { address, port } = addr;
  console.log(`Started PeerServer on ${address}, port: ${port}`);
};

const startServer = () => {
  const port = Number.parseInt(PORT, 10);
  const path = PATH.trim();
  return PeerServer({ port, path, key: 'peerjs' }, onServerRunning);
};

const server = startServer();

server.on('connection', client => {
  console.log(`Client connected: ${client.getId()}`);
});

server.on('disconnect', client => {
  console.log(`Client disconnected: ${client.getId()}`);
});