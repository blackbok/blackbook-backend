import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';

@Controller('upload')
export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) { }

    @Post('image')
    @UseInterceptors(FileInterceptor('file')) // 'file' is the field name
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File must be provided');
        }

        const imageUrl = await this.fileUploadService.uploadImageToCloudinary(file);
        return {
            message: 'File uploaded successfully',
            imageUrl,
        };
    }
}
