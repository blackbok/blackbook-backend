import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export const cloudinaryConfig = async (configService: ConfigService) => {
    const logger = new Logger('cloudinaryConfig');
    logger.log('Configuring Cloudinary');
    const cloudName = configService.get<string>('app.cloudinary.cloud_name');
    const apiKey = configService.get<string>('app.cloudinary.api_key');
    const apiSecret = configService.get<string>('app.cloudinary.api_secret');

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
};