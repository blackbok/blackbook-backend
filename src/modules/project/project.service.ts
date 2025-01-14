import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Project, ProjectDocument } from "src/model/project/project.model";
import { CreateProjectDto } from "./dto/create-project.dto";
import { IProjectResponseProps } from "./interfaces/Iproject.response.types";
import { ProjectStatusRole } from "src/common/utils/enum/Role";
import { IProjectCardProps } from "./interfaces/Iproject.card.types";

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
    ) { }

    private transformToResponseDto(project: ProjectDocument): IProjectResponseProps {
        const { id, metadata, createdAt, updatedAt } = project;
        return {
            id: id as string,
            metadata: {
                authorName: metadata.authorName,
                email: metadata.email,
                college: metadata.college,
                title: metadata.title,
                description: metadata.description,
                stream: metadata.stream,
                category: metadata.category,
                tags: metadata.tags,
                components: metadata.components,
                projectType: metadata.projectType,
                projectStatus: metadata.projectStatus as ProjectStatusRole,
                appAndPlatforms: metadata.appAndPlatforms,
                isFinalYearProject: metadata.isFinalYearProject,
                imagesUrl: metadata.imagesUrl,
                projectPdfUrl: metadata.projectPdfUrl,
                blackbookPdfUrl: metadata.blackbookPdfUrl,
                viewCount: metadata.viewCount,
                collaborators: metadata.collaborators,
                upVotes: metadata.upVotes,
                downVotes: metadata.downVotes,
                createdAt: createdAt,
                updatedAt: updatedAt,
            },
        };
    }

    private transformToProjectCardDto(project: ProjectDocument): IProjectCardProps {
        const { id, metadata, userId } = project;
        return {
            id: id as string,
            userId: userId,
            authorName: metadata.authorName,
            title: metadata.title,
            description: metadata.description,
            stream: metadata.stream,
            category: metadata.category,
            tags: metadata.tags,
            projectType: metadata.projectType,
            projectStatus: metadata.projectStatus,
            isFinalYearProject: metadata.isFinalYearProject,
            imagesUrl: metadata.imagesUrl,
            viewCount: metadata.viewCount,
            projectUrl: metadata.projectPdfUrl,
            college: metadata.college,
            upVotes: metadata.upVotes,
            downVotes: metadata.downVotes,
        };
    }



    async create(createProjectDto: CreateProjectDto): Promise<IProjectResponseProps> {
        const createdProject = new this.projectModel(createProjectDto);
        const project = await createdProject.save();

        if (!project) {
            throw new NotFoundException('Project not created');
        }

        return this.transformToResponseDto(project);
    }

    async findById(id: string): Promise<IProjectResponseProps> {
        const project = await this.projectModel.findById(id as string).exec();
        if (!project) {
            throw new NotFoundException('Project not found');
        }
        return this.transformToResponseDto(project);
    }

    async findByUserId(userId: string): Promise<IProjectResponseProps[]> {
        const projects = await this.projectModel.find({ userId }).exec();
        return projects.map(this.transformToResponseDto);
    }



    // This method is used to get all the project cards
    async findAllProjectCards(): Promise<IProjectCardProps[]> {
        const projects = await this.projectModel.find().exec();
        return projects.map(this.transformToProjectCardDto);
    }
}
