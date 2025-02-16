import {
  Body,
  Controller,
  Get,
  Post,
  NotFoundException,
  UseInterceptors,
  UploadedFiles,
  Logger,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateVoteDto } from './dto/update-vote.sto';
import { IProjectResponseProps } from './interfaces/Iproject.response.types';
import { IProjectCardProps } from './interfaces/Iproject.card.types';

@ApiTags('Projects')
@Controller({ path: 'project', version: '1' })
export class ProjectController {
  private logger = new Logger('ProjectController');

  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: 'Get all project cards' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved projects' })
  @ApiResponse({ status: 404, description: 'No projects found' })
  @Get()
  async getProjectsCards(): Promise<IProjectCardProps[]> {
    const projects = await this.projectService.findAllProjectCards();

    if (!projects || projects.length === 0) {
      throw new NotFoundException('No projects found.');
    }
    return projects;
  }

  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'projectImages', maxCount: 5 },
      { name: 'projectPdf', maxCount: 1 },
    ]),
  )
  @Post('create')
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles()
    files: {
      projectImages: Express.Multer.File[];
      projectPdf: Express.Multer.File[];
    },
  ): Promise<IProjectCardProps> {
    createProjectDto.projectImages = files.projectImages;
    createProjectDto.projectPdf = files.projectPdf;
    return this.projectService.create(createProjectDto);
  }

  @ApiOperation({ summary: 'Get latest projects' })
  @ApiResponse({
    status: 200,
    description: 'Latest projects retrieved successfully',
  })
  @Get('latest')
  async getLatestProjects(): Promise<IProjectCardProps[]> {
    return this.projectService.fetchLatestProjects();
  }

  @ApiOperation({ summary: 'Get a project desciption by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project found' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @Get(':id')
  async getProjectById(
    @Param('id') id: string,
  ): Promise<IProjectResponseProps> {
    return this.projectService.findById(id);
  }

  @ApiOperation({ summary: 'Vote for a project' })
  @ApiParam({ name: 'id', required: true, description: 'Project ID' })
  @ApiBody({ type: UpdateVoteDto })
  @ApiResponse({ status: 200, description: 'Vote updated successfully' })
  @Patch(':id/vote')
  async voteProject(
    @Param('id') projectId: string,
    @Body() updateVoteDto: UpdateVoteDto,
  ): Promise<IProjectCardProps> {
    return this.projectService.updateVotes(projectId, updateVoteDto.upvote);
  }

  @ApiOperation({ summary: 'Update project view count' })
  @ApiParam({ name: 'id', required: true, description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'View count updated successfully' })
  @Patch(':id/viewcount')
  async updateViewCount(
    @Param('id') projectId: string,
  ): Promise<IProjectCardProps> {
    return this.projectService.updateViewCount(projectId);
  }

  @ApiOperation({ summary: 'Get all projects by a user' })
  @ApiParam({ name: 'userId', required: true, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Projects retrieved successfully',
    type: 'array',
  })
  @ApiResponse({ status: 404, description: 'No projects found for user' })
  @Get('user/:userId')
  async getProjectsByUserId(
    @Param('userId') userId: string,
  ): Promise<IProjectCardProps[]> {
    return this.projectService.findByUserId(userId);
  }

  @ApiOperation({ summary: 'Add a project to favorites' })
  @ApiBody({ schema: { example: { projectId: '12345', userId: '67890' } } })
  @ApiResponse({
    status: 200,
    description: 'Project added to favorites successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid project or user ID' })
  @Patch('/add-to-favorites')
  async addProjectToFavorites(
    @Body() { projectId, userId }: { projectId: string; userId: string },
  ): Promise<IProjectCardProps[]> {
    return this.projectService.addProjectToFavorites(projectId, userId);
  }

  @ApiOperation({ summary: 'Get favorite projects for a user' })
  @ApiParam({ name: 'userId', required: true, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Favorite projects retrieved successfully',
    type: 'array',
  })
  @Get('favorites/:userId')
  async getFavoriteProjects(
    @Param('userId') userId: string,
  ): Promise<IProjectCardProps[]> {
    return this.projectService.fetchFavouriteProjects(userId);
  }

  @ApiOperation({ summary: 'Check if a project is in favorites' })
  @ApiParam({ name: 'projectId', required: true, description: 'Project ID' })
  @ApiParam({ name: 'userId', required: true, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Project is in favorites' })
  @ApiResponse({ status: 404, description: 'Project is not in favorites' })
  @Get('favorites/:userId/:projectId')
  async isProjectInFavorites(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<boolean> {
    return this.projectService.checkIfProjectIsFavourite({
      userId: userId,
      projectId: projectId,
    });
  }
}
