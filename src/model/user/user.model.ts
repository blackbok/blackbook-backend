import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/common/utils/enum/Role';
import { SocialMedia } from './social-media.model';
import { AuthMetadata, Metadata } from './metadata.model';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Types.ObjectId, required: false })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  passwordHash: string;

  @Prop({ required: true, default: Role.USER })
  role: string;

  @Prop({ required: true, type: AuthMetadata })
  authMetadata: AuthMetadata;

  @Prop({ required: true, type: Metadata })
  metadata: Metadata;

  @Prop({ required: false, type: SocialMedia })
  socialMedia: SocialMedia;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
