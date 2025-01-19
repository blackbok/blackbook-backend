import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Project, ProjectDocument } from "src/model/project/project.model";
import { CreateProjectDto } from "./dto/create-project.dto";
import { IProjectResponseProps } from "./interfaces/Iproject.response.types";
import { ProjectStatusRole } from "src/common/utils/enum/Role";
import { IProjectCardProps } from "./interfaces/Iproject.card.types";
import { FileUploadService } from "../file-upload/file-upload.service";

@Injectable()
export class ProjectService {
    private logger = new Logger('ProjectService');
    constructor(
        private readonly fileUploadService: FileUploadService,
        @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>

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

    private transformToProjectCardDto(project: any): IProjectCardProps {
        const { id, metadata, userId } = project;

        const projectCard = {
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
        }
        return projectCard;
    }



    async create(createProjectDto: CreateProjectDto): Promise<IProjectCardProps> {
        const { files } = createProjectDto;

        // Convert flat metadata fields into a nested object
        const metadata: any = {};
        Object.keys(createProjectDto).forEach((key) => {
            if (key.startsWith('metadata.')) {
                const field = key.replace('metadata.', ''); // Remove metadata. prefix
                metadata[field] = (createProjectDto as any)[key];
            }
        });


        let imagesUrl: string[] = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const uploadResult = await this.fileUploadService.uploadImageToCloudinary(file);
                imagesUrl.push(uploadResult);
            }
        }

        this.logger.log("imagesUrl", imagesUrl);

        if (imagesUrl.length === 0) {
            throw new NotFoundException("Atleast one image is required");
        }

        if (imagesUrl.length > 0) {
            metadata.imagesUrl = imagesUrl;
        }

        this.logger.log("metadata", metadata);

        const project = new this.projectModel({ ...createProjectDto, metadata });
        const savedProject = await project.save()
        const populatedProject = await savedProject.populate('userId', 'username metadata.profilePicUrl metadata.followers createdAt');

        if (!populatedProject) {
            this.logger.log("Failed to create a project");
            throw new NotFoundException("Failed to create project");
        }

        this.logger.log("saved project", populatedProject);

        return this.transformToProjectCardDto(populatedProject);
    }

    async findById(_id: string): Promise<IProjectResponseProps> {
        this.logger.log("id", _id);
        const project = await this.projectModel.findById(_id).exec();
        if (!project) {
            throw new NotFoundException('Project not found');
        }
        return this.transformToResponseDto(project);
    }

    async findByUserId(userId: string): Promise<IProjectCardProps[]> {
        const projects = await this.projectModel.find({ userId }).populate('userId', 'username metadata.profilePicUrl metadata.followers createdAt').exec();
        return projects.map(this.transformToProjectCardDto);
    }



    // This method is used to get all the project cards
    async findAllProjectCards(): Promise<IProjectCardProps[]> {
        this.logger.debug("fetching all projects");
        const projects = await this.projectModel.find().populate('userId', 'username metadata.profilePicUrl metadata.followers createdAt').exec();
        return projects.map(this.transformToProjectCardDto);
    }

    // fetch latest projects based on created date and limit 5
    async fetchLatestProjects(): Promise<IProjectCardProps[]> {
        const logger = new Logger('latestProjects');
        logger.log("fetching latest projects");
        const projects = await this.projectModel.find().populate('userId', 'username metadata.profilePicUrl metadata.followers createdAt').sort({ createdAt: -1 }).limit(6).exec();
        return projects.map(this.transformToProjectCardDto);
    }

    // use mongoose transaction to update upvote and downvote
    async updateVotes(projectId: string, isUpvote: boolean): Promise<IProjectCardProps> {
        try {
            // Find and update the project atomically
            const update = isUpvote
                ? { $inc: { "metadata.upVotes": 1 } } // Increment upVotes by 1
                : { $inc: { "metadata.downVotes": 1 } }; // Increment downVotes by 1

            const updatedProject = await this.projectModel
                .findByIdAndUpdate(projectId, update, {
                    new: true, // Return the updated document
                    lean: false, // Required for populate
                })
                .populate("userId", "username metadata.profilePicUrl metadata.followers createdAt");

            if (!updatedProject) {
                throw new NotFoundException("Project not found");
            }

            return this.transformToProjectCardDto(updatedProject);
        } catch (error) {
            this.logger.error("Error updating project votes", error);
            throw error;
        }
    }



    //  update view count
    async updateViewCount(projectId: string): Promise<IProjectCardProps> {

        try {
            const project = await this.projectModel.findById(projectId).populate('userId', 'username metadata.profilePicUrl metadata.followers createdAt').exec();
            if (!project) {
                throw new NotFoundException("Project not found");
            }

            this.logger.debug("updating view count");
            project.metadata.viewCount = (project.metadata.viewCount || 0) + 1;

            const updatedproject = await project.save();

            if (!updatedproject) {
                throw new NotFoundException("Project not found");
            }
            return this.transformToProjectCardDto(updatedproject);
        } catch (error) {
            throw error;
        }
    }
}
