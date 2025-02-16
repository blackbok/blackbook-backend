import { Module } from '@nestjs/common';
import { TestController, TestV2Controller } from './test.controller';
import { TestService } from './test.service';

@Module({
  controllers: [TestController, TestV2Controller],
  providers: [TestService],
})
export class TestModule {}
