import { Server } from 'socket.io';

export class SocketInitializer {
  private server: Server;

  initSocket(port: number): Server {
    this.server = new Server(port, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    return this.server;
  }
}
