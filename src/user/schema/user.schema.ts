import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ default: 0 })
  userLevel: 0 | 1;
}

export const UserSchema = SchemaFactory.createForClass(User);
