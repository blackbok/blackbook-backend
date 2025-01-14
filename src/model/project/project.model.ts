import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { ProjectMetadata } from "./project-metadata.model";

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
    @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
    userId: string;

    @Prop({ required: true, type: ProjectMetadata })
    metadata: ProjectMetadata;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: Date })
    updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
