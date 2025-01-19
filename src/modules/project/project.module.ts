import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Project, ProjectSchema } from "src/model/project/project.model";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { FeedbackModule } from "./feedback/feedback.module";
import { FileUploadModule } from "../file-upload/file-upload.module";
import { FileUploadService } from "../file-upload/file-upload.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
        FeedbackModule,
        FileUploadModule,
    ],
    providers: [
        ProjectService,
        FileUploadService,
    ],
    controllers: [
        ProjectController,
    ],
    exports: [
        ProjectService,
    ],
})
export class ProjectModule { }