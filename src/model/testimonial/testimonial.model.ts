import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TesitmonialDocument = HydratedDocument<Tesitmonial>;
@Schema()
export class Tesitmonial {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  designation: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String, required: true })
  image: string;
}

export const TesitmonialSchema = SchemaFactory.createForClass(Tesitmonial);
