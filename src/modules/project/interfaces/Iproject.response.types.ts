import { ProjectStatusRole } from 'src/common/utils/enum/Role';

export interface IProjectResponseProps {
    id: string;
    metadata: {
        authorName: string;
        email: string;
        college: string;
        title: string;
        description: string;
        stream: string;
        category: string;
        tags: string[];
        components: string[];
        projectType: string;
        projectStatus: ProjectStatusRole;
        appAndPlatforms: string[];
        isFinalYearProject: boolean;
        imagesUrl: string[];
        projectPdfUrl: string;
        blackbookPdfUrl: string;
        viewCount: number;
        collaborators: string[];
        upVotes: number;
        downVotes: number;
        createdAt: Date;
        updatedAt: Date;
    };
}
