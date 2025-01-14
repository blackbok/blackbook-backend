import { Controller, Get, Inject } from '@nestjs/common';
import { TestService } from './test.service';

@Controller({ path: 'test', version: '1' }) // Version 1 of the 'test' route
export class TestController {
    constructor(
        private readonly testService: TestService,
    ) { }
    @Get()
    getTest() {
        return 'This is version 1';
    }


    @Get('env')
    getEnv() {
        return this.testService.getenvironment();
    }
}

@Controller({ path: 'test', version: '2' }) // Version 2 of the 'test' route
export class TestV2Controller {
    @Get()
    getTest() {
        return 'This is version 2';
    }
}
