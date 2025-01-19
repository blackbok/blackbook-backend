import { Body, Controller, Get, Post, NotFoundException, BadRequestException, UsePipes, ValidationPipe, UseInterceptors, UploadedFiles, Logger, Param, Patch } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { IProjectResponseProps } from "./interfaces/Iproject.response.types";
import { IProjectCardProps } from "./interfaces/Iproject.card.types";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UpdateVoteDto } from "./dto/update-vote.sto";

@Controller({ path: 'project', version: '1' })
export class ProjectController {
    private logger = new Logger('ProjectController');
    constructor(private readonly projectService: ProjectService) { }

    @Get()
    async getProjectsCards(): Promise<IProjectCardProps[]> {
        const projects = await this.projectService.findAllProjectCards();

        if (!projects || projects.length === 0) {
            throw new NotFoundException("No projects found.");
        }
        return projects;
    }

    @Post('create')
    // @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    @UseInterceptors(FilesInterceptor('files', 5))
    async create(@Body() createProjectDto: CreateProjectDto, @UploadedFiles() files: Express.Multer.File[]): Promise<IProjectCardProps> {
        createProjectDto.files = files;
        // console.log("createProjectDto", createProjectDto);

        return this.projectService.create(createProjectDto);
    }

    @Get('latest')
    async getLatestProjects(): Promise<IProjectCardProps[]> {
        const projects = await this.projectService.fetchLatestProjects();
        return projects;
    }

    @Get(':id')
    async getProjectById(@Param('id') id: string): Promise<IProjectResponseProps> {
        const project = await this.projectService.findById(id);
        return project;
    }

    @Patch(':id/vote')
    async voteProject(@Param('id') projectId: string, @Body() updateVoteDto: UpdateVoteDto): Promise<IProjectCardProps> {
        this.logger.log(updateVoteDto)
        const { upvote } = updateVoteDto;

        const project = await this.projectService.updateVotes(projectId, upvote);
        return project;
    }

    @Patch(':id/viewcount')
    async updateViewCount(@Param('id') projectId: string): Promise<IProjectCardProps> {
        const project = await this.projectService.updateViewCount(projectId);
        return project;
    }

    @Get('user/:userId')
    async getProjectsByUserId(@Param('userId') userId: string): Promise<IProjectCardProps[]> {
        this.logger.debug("userId", userId);
        const projects = await this.projectService.findByUserId(userId);
        return projects;
    }
}
