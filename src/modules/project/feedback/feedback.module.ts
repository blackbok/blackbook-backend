import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FeedbackController } from "./feedback.controller";
import { FeedbackService } from "./feedback.service";
import { ProjectFeedback, ProjectFeedbackSchema } from "src/model/project-feedback/project-feedback.model";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ProjectFeedback.name, schema: ProjectFeedbackSchema }])
    ],
    controllers: [FeedbackController],
    providers: [FeedbackService],
    exports: [FeedbackService]
})
export class FeedbackModule { }