import { Controller, Get, HttpException, HttpStatus, NotFoundException, Post } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { CreateProjectFeedbackDto } from "./dto/create-feedback.dto";
import { ProjectFeedback } from "src/model/project-feedback/project-feedback.model";

@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) { }

    @Post('create')
    async createFeedback(createFeedbackDto: CreateProjectFeedbackDto): Promise<ProjectFeedback> {
        if (!createFeedbackDto) {
            throw new HttpException('Feedback not created', HttpStatus.BAD_REQUEST);
        }
        return this.feedbackService.create(createFeedbackDto);
    }

    @Get()
    async findAllFeedbacks(): Promise<ProjectFeedback[]> {
        const feedbacks = await this.feedbackService.findAll();
        if (this.shouldThrowNotFound(feedbacks)) {
            throw new NotFoundException('Feedbacks not found');
        }
        return feedbacks;
    }

    @Get('project/:projectId')
    async findFeedbacksByProjectId(projectId: string): Promise<ProjectFeedback[]> {
        const feedbacks = await this.feedbackService.findByProjectId(projectId);
        if (this.shouldThrowNotFound(feedbacks)) {
            throw new NotFoundException('Feedbacks not found');
        }
        return feedbacks;
    }

    @Get('user/:userId')
    async findFeedbacksByUserId(userId: string): Promise<ProjectFeedback[]> {
        const feedbacks = await this.feedbackService.findByUserId(userId);
        if (this.shouldThrowNotFound(feedbacks)) {
            throw new NotFoundException('Feedbacks not found');
        }
        return feedbacks;
    }

    private shouldThrowNotFound(feedbacks: ProjectFeedback[] | null): boolean {
        return !feedbacks || feedbacks.length === 0 || feedbacks === null;
    }
}