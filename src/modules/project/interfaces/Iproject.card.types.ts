export interface IProjectCardProps {
    id: string;
    userId: string;
    authorName: string;
    college: string;
    title: string;
    description: string;
    stream: string;
    category: string;
    tags: string[];
    projectType: string;
    projectStatus: string;
    isFinalYearProject: boolean;
    imagesUrl: string[];
    viewCount: number;
    upVotes: number;
    downVotes: number;
    projectUrl: string;
}