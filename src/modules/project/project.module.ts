import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Project, ProjectSchema } from "src/model/project/project.model";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { FeedbackModule } from "./feedback/feedback.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
        FeedbackModule,
    ],
    providers: [
        ProjectService,
    ],
    controllers: [
        ProjectController,
    ],
    exports: [
        ProjectService,
    ],
})
export class ProjectModule { }