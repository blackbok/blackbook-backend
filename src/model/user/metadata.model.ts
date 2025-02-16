import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Address } from './adress.model';
import { AuthProvider } from 'src/common/utils/enum/Role';

@Schema()
export class Metadata {
  @Prop({ type: [Types.ObjectId], required: false, ref: 'Project' })
  favouriteProjects: Types.ObjectId[];

  @Prop({ type: String, required: false })
  bio: string;

  @Prop({ type: String, required: false })
  gender: string;

  @Prop({ type: String, required: false })
  profilePicUrl: string;

  @Prop({ type: String, required: false })
  phone: string;

  @Prop({ type: String, required: false })
  college: string;

  @Prop({ type: String, required: false })
  degree: string;

  @Prop({ type: String, required: false })
  stream: string;

  @Prop({ type: Address, required: false })
  address: Address;

  @Prop({ type: [Types.ObjectId], required: false })
  followers: Types.ObjectId[];
}

@Schema()
export class AuthMetadata {
  @Prop({ type: String, required: false })
  refreshToken: string;

  @Prop({ type: String, required: false })
  acessToken: string;

  @Prop({ type: Date, required: false })
  acessTokenExpiresAt: Date;

  @Prop({ type: Date, required: false })
  refreshTokenExpiresAt: Date;

  @Prop({ enum: AuthProvider, required: true })
  authProvider: AuthProvider;

  @Prop({ type: String, required: false })
  providerId: string;
}
