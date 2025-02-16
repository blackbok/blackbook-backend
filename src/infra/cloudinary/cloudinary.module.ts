import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cloudinaryConfig } from 'src/config/cloudinary.config';

@Module({
  imports: [],
})
export class CloudinaryModule implements OnModuleInit {
  private readonly logger = new Logger(CloudinaryModule.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await cloudinaryConfig(this.configService);
    this.logger.log('Cloudinary connected successfully!');
  }
}
