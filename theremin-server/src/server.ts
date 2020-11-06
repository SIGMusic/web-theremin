#!/usr/bin/env node
import 'module-alias/register';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import { ExpressPeerServer } from 'peer';
import cors from 'cors';


dotenv.config();

const { PATH = '/theremin', PORT = '5000' } = process.env;

const startServer = (app: Express) => {
  const port = Number.parseInt(PORT, 10);
  const path = PATH.trim();

  const server = app.listen(PORT);
  const peerServer = ExpressPeerServer(server, {
    port,
    path,
    allow_discovery: true,
  });

  app.use('/', peerServer);

  return server;
};

const app = express();
const server = startServer(app);

server.on('listening', () => console.info('listening ...'));
server.on('connection', client => console.info('CONNECTED id', client.address()));
server.on('disconnect', client => console.info('DISCONNECTED id', client.address()));
server.on('close', () => console.error('closed'));

app.use(
  cors({
    credentials: true,
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
  }),
);