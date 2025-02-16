import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import * as streamifier from 'streamifier';

type FileType = 'image' | 'pdf';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);

  private getUploadConfig(fileType: FileType, fileName: string) {
    const baseConfig = {
      resource_type: 'auto' as const,
      use_filename: true,
      unique_filename: true,
      public_id: fileName,
    };

    return {
      ...baseConfig,
      folder: `blackbook/${fileType}s`, // images or pdfs
    };
  }

  private createFileName(file: Express.Multer.File): string {
    const timestamp = Date.now();
    return `${timestamp}-${file.originalname
      .split(' ')
      .join('-')
      .replace(/\.[^/.]+$/, '')}`;
  }

  private uploadToCloudinary(
    file: Express.Multer.File,
    fileType: FileType,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException(`${fileType} file must be provided`);
    }

    if (!file.buffer) {
      throw new BadRequestException(`Invalid ${fileType} file format`);
    }

    this.logger.debug(`Uploading ${fileType} to cloudinary`);

    return new Promise((resolve, reject) => {
      try {
        const fileName = this.createFileName(file);
        const uploadConfig = this.getUploadConfig(fileType, fileName);
        const stream = streamifier.createReadStream(file.buffer);

        const uploadStream = cloudinary.uploader.upload_stream(
          uploadConfig,
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined,
          ) => {
            if (error) {
              this.logger.error(
                `Error uploading ${fileType} to Cloudinary`,
                error,
              );
              reject(
                new BadRequestException(
                  `Failed to upload ${fileType} to cloudinary: ${error.message}`,
                ),
              );
              return;
            }

            if (!result?.secure_url) {
              reject(
                new BadRequestException(
                  `Failed to get secure URL for uploaded ${fileType}`,
                ),
              );
              return;
            }

            // this.logger.log(`${fileType} upload successful`, {
            //     fileName,
            //     url: result.secure_url
            // });
            resolve(result.secure_url);
          },
        );

        stream.pipe(uploadStream).on('error', (error) => {
          this.logger.error(`Stream error while uploading ${fileType}`, error);
          reject(
            new BadRequestException(`Failed to process ${fileType} stream`),
          );
        });
      } catch (error) {
        this.logger.error(`Unexpected error in ${fileType} upload`, error);
        reject(
          new BadRequestException(
            `Unexpected error during ${fileType} upload: ${error.message}`,
          ),
        );
      }
    });
  }

  async uploadImageToCloudinary(file: Express.Multer.File): Promise<string> {
    return this.uploadToCloudinary(file, 'image');
  }

  async uploadPdfToCloudinary(file: Express.Multer.File): Promise<string> {
    return this.uploadToCloudinary(file, 'pdf');
  }
}
