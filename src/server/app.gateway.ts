import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway(80, {
  cors: {
    origin: '*',
  },
  credentials: true,
})
export class AppGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('hello')
  handleEvent(@MessageBody() data): void {
    console.log(data);
    this.server.emit('hello', data);
  }
}
