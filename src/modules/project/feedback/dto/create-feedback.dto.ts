import {  IsString } from "class-validator";

export class CreateProjectFeedbackDto {
    @IsString()
    projectId: string;

    @IsString()
    userId: string;

    @IsString()
    authorName: string;

    @IsString()
    email: string;

    @IsString()
    comment: string;
}
