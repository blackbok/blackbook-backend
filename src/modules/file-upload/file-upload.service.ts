import { Injectable, BadRequestException, Logger } from "@nestjs/common";
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()

export class FileUploadService {
    private logger = new Logger('FileUploadService');
    async uploadImageToCloudinary(file: Express.Multer.File): Promise<string> {
        this.logger.debug("uploading image to cloudinary");
        return new Promise(async (resolve, reject) => {
            try {
                if (!file) {
                    throw new BadRequestException('File must be provided');
                }
                // this.logger.log("file", file);
                // console.log("file", file);

                const timestamp = Date.now();
                // const extension = file.originalname.split('.').pop();
                const fileName = `${timestamp}-${file.originalname
                    .split(' ')
                    .join('-')
                    .replace(/\.[^/.]+$/, '')}`;

                const stream = streamifier.createReadStream(file.buffer);
                // Upload the stream to Cloudinary
                const uploadStream = cloudinary.uploader.upload_stream({
                    resource_type: "auto",
                    folder: "blackbook",
                    use_filename: true,
                    unique_filename: true,
                    public_id: fileName,
                }, (error, result) => {
                    if (error) {
                        this.logger.error('Error uploading to Cloudinary', error);
                        reject(new BadRequestException("Failed to upload image to cloudinary"));
                    } else {
                        this.logger.log('Upload successful', result);  // Log the result here
                        if (result?.secure_url) {
                            resolve(result.secure_url);  // Resolve with the secure URL
                        } else {
                            reject(new BadRequestException("Failed to upload image to cloudinary"));
                        }
                    }
                });

                // Pipe the stream to Cloudinary
                stream.pipe(uploadStream);
            } catch (error) {
                this.logger.error(error);
                throw new BadRequestException("Failed to upload image to cloudinary");
            }
        });
    }
}