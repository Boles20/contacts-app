import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Contact extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ default: '' })
  notes: string;

  @Prop({ default: false })
  locked: boolean;

  @Prop({ default: null })
  lockedBy: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
