import { Injectable } from '@nestjs/common';
import { ContactRepository } from './contact.repository';
import { CreateContactDto } from './dtos/create-contact.dto';
import { UpdateContactDto } from './dtos/update-contact.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ContactLockedEvent,
  ContactUnlockedEvent,
} from './events/contact.events';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  create(createContactDto: CreateContactDto) {
    return this.contactRepository.create(createContactDto);
  }

  findAll(page: number, limit: number) {
    return this.contactRepository.findAll(page, limit);
  }

  findOne(id: string) {
    return this.contactRepository.findOne(id);
  }

  update(id: string, updateContactDto: UpdateContactDto) {
    return this.contactRepository.update(id, updateContactDto);
  }

  delete(id: string) {
    return this.contactRepository.delete(id);
  }

  async lockContact(id: string, username: string) {
    const contact = await this.contactRepository.lockContact(id, username);
    this.eventEmitter.emit(
      'contact.locked',
      new ContactLockedEvent(id, username),
    );
    return contact;
  }

  async unlockContact(id: string) {
    const contact = await this.contactRepository.unlockContact(id);
    this.eventEmitter.emit('contact.unlocked', new ContactUnlockedEvent(id));
    return contact;
  }
}
