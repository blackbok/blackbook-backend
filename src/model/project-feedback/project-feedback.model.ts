import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectFeedbackDocument = HydratedDocument<ProjectFeedback>;

@Schema({ timestamps: true })  
export class ProjectFeedback {

    @Prop({ type: Types.ObjectId, required: true, ref: 'Project' })  
    projectId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: 'User' })  
    userId: Types.ObjectId;

    @Prop({ required: true })
    authorName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    comment: string;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const ProjectFeedbackSchema = SchemaFactory.createForClass(ProjectFeedback);