import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ContactLockedEvent,
  ContactUnlockedEvent,
} from '../events/contact.events';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ContactGateway {
  @WebSocketServer()
  server: Server;

  @OnEvent('contact.locked')
  handleContactLocked(event: ContactLockedEvent) {
    this.server.emit('contactLocked', event);
  }

  @OnEvent('contact.unlocked')
  handleContactUnlocked(event: ContactUnlockedEvent) {
    this.server.emit('contactUnlocked', event);
  }
}
