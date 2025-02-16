import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from 'src/model/project/project.model';
import { CreateProjectDto } from './dto/create-project.dto';
import { IProjectResponseProps } from './interfaces/Iproject.response.types';
import { ProjectStatusRole } from 'src/common/utils/enum/Role';
import { IProjectCardProps } from './interfaces/Iproject.card.types';
import { FileUploadService } from '../file-upload/file-upload.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectService {
  private logger = new Logger('ProjectService');
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly userService: UserService,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  private transformToResponseDto(
    project: ProjectDocument,
  ): IProjectResponseProps {
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
    };
    return projectCard;
  }

  async create(createProjectDto: CreateProjectDto): Promise<IProjectCardProps> {
    console.log('createProjectDto', createProjectDto);
    const { projectImages, projectPdf } = createProjectDto;

    const metadata: any = {};
    Object.keys(createProjectDto).forEach((key) => {
      if (key.startsWith('metadata.')) {
        const field = key.replace('metadata.', '');
        metadata[field] = (createProjectDto as any)[key];
      }
    });

    const imagesUrl: string[] = [];
    if (projectImages && projectImages.length > 0) {
      for (const image of projectImages) {
        const uploadResult =
          await this.fileUploadService.uploadImageToCloudinary(image);
        imagesUrl.push(uploadResult);
      }
    }

    if (projectPdf && projectPdf.length > 0) {
      const pdf = projectPdf[0];
      const uploadResult =
        await this.fileUploadService.uploadPdfToCloudinary(pdf);
      metadata.projectPdfUrl = uploadResult;
    }

    if (imagesUrl.length === 0) {
      throw new NotFoundException('Atleast one image is required');
    }

    if (imagesUrl.length > 0) {
      metadata.imagesUrl = imagesUrl;
    }

    const project = new this.projectModel({ ...createProjectDto, metadata });
    const savedProject = await project.save();
    const populatedProject = await savedProject.populate(
      'userId',
      'username metadata.profilePicUrl metadata.followers createdAt',
    );

    if (!populatedProject) {
      this.logger.log('Failed to create a project');
      throw new NotFoundException('Failed to create project');
    }

    return this.transformToProjectCardDto(populatedProject);
  }

  async findById(_id: string): Promise<IProjectResponseProps> {
    const project = await this.projectModel.findById(_id).exec();
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return this.transformToResponseDto(project);
  }

  async findByUserId(userId: string): Promise<IProjectCardProps[]> {
    const projects = await this.projectModel
      .find({ userId })
      .populate(
        'userId',
        'username metadata.profilePicUrl metadata.followers createdAt',
      )
      .exec();
    return projects.map(this.transformToProjectCardDto);
  }

  async findAllProjectCards(): Promise<IProjectCardProps[]> {
    const projects = await this.projectModel
      .find()
      .populate(
        'userId',
        'username metadata.profilePicUrl metadata.followers createdAt',
      )
      .exec();
    return projects.map(this.transformToProjectCardDto);
  }

  async fetchLatestProjects(): Promise<IProjectCardProps[]> {
    const logger = new Logger('latestProjects');
    logger.log('fetching latest projects');
    const projects = await this.projectModel
      .find()
      .populate(
        'userId',
        'username metadata.profilePicUrl metadata.followers createdAt',
      )
      .sort({ createdAt: -1 })
      .limit(6)
      .exec();
    return projects.map(this.transformToProjectCardDto);
  }

  async updateVotes(
    projectId: string,
    isUpvote: boolean,
  ): Promise<IProjectCardProps> {
    try {
      const update = isUpvote
        ? { $inc: { 'metadata.upVotes': 1 } }
        : { $inc: { 'metadata.downVotes': 1 } };

      const updatedProject = await this.projectModel
        .findByIdAndUpdate(projectId, update, {
          new: true,
          lean: false,
        })
        .populate(
          'userId',
          'username metadata.profilePicUrl metadata.followers createdAt',
        );

      if (!updatedProject) {
        throw new NotFoundException('Project not found');
      }

      return this.transformToProjectCardDto(updatedProject);
    } catch (error) {
      this.logger.error('Error updating project votes', error);
      throw error;
    }
  }

  async updateViewCount(projectId: string): Promise<IProjectCardProps> {
    try {
      const project = await this.projectModel
        .findById(projectId)
        .populate(
          'userId',
          'username metadata.profilePicUrl metadata.followers createdAt',
        )
        .exec();
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      this.logger.debug('updating view count');
      project.metadata.viewCount = (project.metadata.viewCount || 0) + 1;

      const updatedproject = await project.save();

      if (!updatedproject) {
        throw new NotFoundException('Project not found');
      }
      return this.transformToProjectCardDto(updatedproject);
    } catch (error) {
      throw error;
    }
  }

  async addProjectToFavorites(
    projectId: string,
    userId: string,
  ): Promise<IProjectCardProps[]> {
    try {
      const project = await this.projectModel.findById(projectId).exec();
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const userFavouriteProject = await this.userService.toggleProjectFavorite(
        projectId,
        userId,
      );
      if (!userFavouriteProject) {
        throw new NotFoundException('User not found');
      }

      const favouriteProjects = await this.projectModel
        .find({ _id: { $in: userFavouriteProject } })
        .populate(
          'userId',
          'username metadata.profilePicUrl metadata.followers createdAt',
        )
        .exec();

      return favouriteProjects.map(this.transformToProjectCardDto);
    } catch (error) {
      throw error;
    }
  }

  async fetchFavouriteProjects(userId: string): Promise<IProjectCardProps[]> {
    try {
      const userFavouriteProjectIDs =
        await this.userService.fetchFavoriteProjectsIDs(userId);
      if (!userFavouriteProjectIDs) {
        throw new NotFoundException('User not found');
      }

      const favouriteProjects = await this.projectModel
        .find({ _id: { $in: userFavouriteProjectIDs } })
        .populate(
          'userId',
          'username metadata.profilePicUrl metadata.followers createdAt',
        )
        .exec();
      return favouriteProjects.map(this.transformToProjectCardDto);
    } catch (error) {
      throw error;
    }
  }

  async checkIfProjectIsFavourite({
    projectId,
    userId,
  }: {
    projectId: string;
    userId: string;
  }): Promise<boolean> {
    try {
      const isFavourite = await this.userService.checkProjectFavoriteStatus({
        userId: userId,
        projectId: projectId,
      });
      return isFavourite;
    } catch (error) {
      throw error;
    }
  }
}
