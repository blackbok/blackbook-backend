import { Body, Controller, Get, Post, NotFoundException, BadRequestException, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { IProjectResponseProps } from "./interfaces/Iproject.response.types";
import { IProjectCardProps } from "./interfaces/Iproject.card.types";

@Controller({ path: 'project', version: '1' })
export class ProjectController {
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
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async create(@Body() createProjectDto: CreateProjectDto): Promise<IProjectResponseProps> {
        return this.projectService.create(createProjectDto);
    }

    @Get('id')
    async getProjectById(id: string): Promise<IProjectResponseProps> {
        const project = await this.projectService.findById("677ac6315b4e54678c57aeaf");
        return project;
    }
}
