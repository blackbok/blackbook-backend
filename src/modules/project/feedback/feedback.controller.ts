import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateProjectFeedbackDto } from './dto/create-feedback.dto';
import { ProjectFeedback } from 'src/model/project-feedback/project-feedback.model';

@ApiTags('Feedback') // Groups all feedback-related APIs in Swagger
@Controller({ path: 'feedback', version: '1' })
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('create')
  @ApiBody({ type: CreateProjectFeedbackDto }) // Documents request body
  @ApiResponse({
    status: 201,
    description: 'Feedback successfully created.',
    type: ProjectFeedback,
  })
  @ApiResponse({ status: 400, description: 'Invalid feedback data provided.' })
  async createFeedback(
    @Body() createFeedbackDto: CreateProjectFeedbackDto,
  ): Promise<ProjectFeedback> {
    if (!createFeedbackDto) {
      throw new HttpException('Feedback not created', HttpStatus.BAD_REQUEST);
    }
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retrieved all feedbacks successfully.',
    type: [ProjectFeedback],
  })
  @ApiNotFoundResponse({ description: 'No feedbacks found.' })
  async findAllFeedbacks(): Promise<ProjectFeedback[]> {
    const feedbacks = await this.feedbackService.findAll();
    if (this.shouldThrowNotFound(feedbacks)) {
      throw new NotFoundException('Feedbacks not found');
    }
    return feedbacks;
  }

  @Get('project/:projectId')
  @ApiParam({
    name: 'projectId',
    required: true,
    example: '660d1f2e5f5b2c6d88f1b22a',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieved project-specific feedback.',
    type: [ProjectFeedback],
  })
  @ApiNotFoundResponse({ description: 'Feedbacks for this project not found.' })
  async findFeedbacksByProjectId(
    @Param('projectId') projectId: string,
  ): Promise<ProjectFeedback[]> {
    const feedbacks = await this.feedbackService.findByProjectId(projectId);
    if (this.shouldThrowNotFound(feedbacks)) {
      throw new NotFoundException('Feedbacks not found');
    }
    return feedbacks;
  }

  @Get('user/:userId')
  @ApiParam({
    name: 'userId',
    required: true,
    example: '661a7b3c8e4f1c2d33e7d6a1',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieved user-specific feedback.',
    type: [ProjectFeedback],
  })
  @ApiNotFoundResponse({ description: 'Feedbacks for this user not found.' })
  async findFeedbacksByUserId(
    @Param('userId') userId: string,
  ): Promise<ProjectFeedback[]> {
    const feedbacks = await this.feedbackService.findByUserId(userId);
    if (this.shouldThrowNotFound(feedbacks)) {
      throw new NotFoundException('Feedbacks not found');
    }
    return feedbacks;
  }

  private shouldThrowNotFound(feedbacks: ProjectFeedback[] | null): boolean {
    return !feedbacks || feedbacks.length === 0;
  }
}
