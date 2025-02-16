import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectFeedbackDocument = HydratedDocument<ProjectFeedback>;

@Schema({ timestamps: true })
export class ProjectFeedback {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Project', index: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  authorName: string;

  @Prop({ required: true, trim: true, lowercase: true, match: /\S+@\S+\.\S+/ })
  email: string;

  @Prop({ required: true, trim: true })
  comment: string;
}

export const ProjectFeedbackSchema =
  SchemaFactory.createForClass(ProjectFeedback);
