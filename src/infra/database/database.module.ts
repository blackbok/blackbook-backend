import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from 'src/config/database.config';

@Module({
    imports: [
        MongooseModule.forRoot(databaseConfig.database.monogodb.uri as string),
    ],
    exports: [MongooseModule],
})


export class DatabaseModule implements OnModuleInit {
    private readonly logger = new Logger(DatabaseModule.name);

    onModuleInit() {
        this.logger.log('Database connected successfully!');
    }
}
