import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class SocialMedia {
    @Prop({ type: String, required: false })
    linkedIn: string;

    @Prop({ type: String, required: false })
    github: string;

    @Prop({ type: String, required: false })
    twitter: string;

    @Prop({ type: String, required: false })
    instagram: string;

    @Prop({ type: String, required: false })
    facebook: string;

    @Prop({ type: String, required: false })
    website: string;

    @Prop({ type: String, required: false })
    medium: string;

    @Prop({ type: String, required: false })
    behance: string;
}
