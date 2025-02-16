import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Datastore>;

@Schema({ timestamps: true })
export class Datastore {
  @Prop({ required: true })
  tagList: string[];

  @Prop({ required: true, type: Object })
  categoryList: Record<string, any>;

  @Prop({ required: true })
  projectTypeList: string[];

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const DatastoreSchema = SchemaFactory.createForClass(Datastore);
