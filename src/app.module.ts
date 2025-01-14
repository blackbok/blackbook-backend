import { Module } from '@nestjs/common';
import { ProjectModule } from './modules/project/project.module';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './infra/database/database.module';
import { TestModule } from './modules/test/test.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FeedbackModule } from './modules/project/feedback/feedback.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    TestModule,
    UserModule,
    ProjectModule,
    FeedbackModule,
  ],
})
export class AppModule { }
