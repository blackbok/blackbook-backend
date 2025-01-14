import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProjectFeedback, ProjectFeedbackDocument } from "src/model/project-feedback/project-feedback.model";
import { CreateProjectFeedbackDto } from "./dto/create-feedback.dto";

@Injectable()
export class FeedbackService {
    constructor(
        @InjectModel(ProjectFeedback.name) private feedbackModel: Model<ProjectFeedbackDocument>
    ) { }

    async create(createFeedbackDto: CreateProjectFeedbackDto): Promise<ProjectFeedback> {
        return (await this.feedbackModel.create(createFeedbackDto));
    }

    async findAll(): Promise<ProjectFeedback[]> {
        return await this.feedbackModel.find().exec();
    }

    async findByProjectId(projectId: string): Promise<ProjectFeedback[]> {
        return await this.feedbackModel.find({ projectId }).exec();
    }

    async findByUserId(userId: string): Promise<ProjectFeedback[]> {
        return await this.feedbackModel.find({ userId }).exec();
    }
}