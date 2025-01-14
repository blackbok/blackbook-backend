import { IsString, IsArray, IsEmail, IsBoolean, IsOptional, IsEnum, MinLength, IsNotEmpty, IsDateString, IsUrl, IsNumber } from 'class-validator';
import { ProjectStatusRole } from 'src/common/utils/enum/Role';
import { Type } from 'class-transformer';

class ProjectMetadataDto {
    @IsString()
    @IsNotEmpty()
    authorName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    college: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @MinLength(50)
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    stream: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    tags: string[];

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    components: string[];

    @IsString()
    @IsNotEmpty()
    projectType: string;

    @IsEnum(ProjectStatusRole)
    @IsNotEmpty()
    projectStatus: ProjectStatusRole;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    appAndPlatforms?: string[];

    @IsOptional()
    @IsBoolean()
    isFinalYearProject?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imagesUrl?: string[];

    @IsOptional()
    @IsUrl()
    projectPdfUrl?: string;

    @IsOptional()
    @IsUrl()
    blackbookPdfUrl?: string;

    @IsOptional()
    @IsNumber()
    viewCount?: number;

    @IsOptional()
    @IsString()
    projectUrl?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    collaborators?: string[];

    @IsOptional()
    @IsNumber()
    upVotes?: number;

    @IsOptional()
    @IsNumber()
    downVotes?: number;
}

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @Type(() => ProjectMetadataDto)
    @IsNotEmpty()
    metadata: ProjectMetadataDto;

    @IsOptional()
    @IsDateString()
    createdAt?: Date;

    @IsOptional()
    @IsDateString()
    updatedAt?: Date;
}
