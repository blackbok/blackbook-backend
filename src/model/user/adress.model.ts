import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Address {
  @Prop({ type: String, required: false })
  city: string;

  @Prop({ type: String, required: false })
  state: string;

  @Prop({ type: String, required: false })
  country: string;

  @Prop({ type: String, required: false })
  pincode: string;
}
