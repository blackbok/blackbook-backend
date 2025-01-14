import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TestService {
    private tests = [
        { id: 1, name: 'Test 1' },
        { id: 2, name: 'Test 2' },
        { id: 3, name: 'Test 3' },
    ];
    constructor(
        private readonly configService: ConfigService,
    ) {
    }

    getAllTests() {
        return { message: 'All tests', data: this.tests };
    }
    getenvironment() {
        const env = this.configService.get('app');
        return { message: 'Environment variables', data: env };
    }
}
