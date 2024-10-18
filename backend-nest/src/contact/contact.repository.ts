import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './schemas/contact.schema';
import { CreateContactDto } from './dtos/create-contact.dto';
import { UpdateContactDto } from './dtos/update-contact.dto';

@Injectable()
export class ContactRepository {
  constructor(
    @InjectModel(Contact.name) private readonly contactModel: Model<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    return new this.contactModel(createContactDto).save();
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ contacts: Contact[]; totalContacts: number }> {
    const skip = (page - 1) * limit;

    // Get paginated contacts
    const contacts = await this.contactModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();

    // Get total count of contacts in the database
    const totalContacts = await this.contactModel.countDocuments().exec();

    return { contacts, totalContacts };
  }

  async findOne(id: string): Promise<Contact> {
    return this.contactModel.findById(id).exec();
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    return this.contactModel
      .findByIdAndUpdate(id, updateContactDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<any> {
    return this.contactModel.findByIdAndDelete(id).exec();
  }

  async lockContact(id: string, username: string): Promise<Contact> {
    return this.contactModel
      .findByIdAndUpdate(
        id,
        { locked: true, lockedBy: username },
        { new: true },
      )
      .exec();
  }

  async unlockContact(id: string): Promise<Contact> {
    return this.contactModel
      .findByIdAndUpdate(id, { locked: false, lockedBy: null }, { new: true })
      .exec();
  }
}
