import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProjectModule } from './modules/project/project.module';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './infra/database/database.module';
import { TestModule } from './modules/test/test.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FeedbackModule } from './modules/project/feedback/feedback.module';
import { VerifyAuthMiddleware } from './common/middleware/verify-auth.middleware';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { CloudinaryModule } from './infra/cloudinary/cloudinary.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    CloudinaryModule,
    AuthModule,
    TestModule,
    UserModule,
    ProjectModule,
    FeedbackModule,
    FileUploadModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyAuthMiddleware).forRoutes('auth/verify', 'auth/logout')
    consumer.apply(VerifyAuthMiddleware).forRoutes('project/create', 'project/update', 'project/delete','project/user/:userId')
  }
}
