import { Schema, Prop } from "@nestjs/mongoose";
import { ProjectStatusRole } from "src/common/utils/enum/Role";


@Schema()
export class ProjectMetadata {

    @Prop({ required: true })
    authorName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    college: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true, minlength: 50 })
    description: string;

    @Prop({ required: true })
    stream: string;

    @Prop({ required: true })
    category: string;

    @Prop({ type: [String], required: true })
    tags: string[];

    @Prop({ type: [String], required: true })
    components: string[];

    @Prop({ required: true })
    projectType: string;

    @Prop({ enum: ProjectStatusRole, default: ProjectStatusRole.PENDING, required: true })
    projectStatus: string;

    @Prop({ type: [String], required: false })
    appAndPlatforms: string[];

    @Prop({ default: false, required: false })
    isFinalYearProject: boolean;

    @Prop({ type: [String] })
    imagesUrl: string[];

    @Prop({ required: false })
    projectPdfUrl: string;


    @Prop({ required: false })
    blackbookPdfUrl: string;

    @Prop({ default: 0, type: Number })
    viewCount: number;

    @Prop({})
    projectUrl: string;

    @Prop({ type: [String], required: false })
    collaborators: string[];

    @Prop({ type: Number, required: false })
    upVotes: number;

    @Prop({ type: Number, required: false })
    downVotes: number;
}