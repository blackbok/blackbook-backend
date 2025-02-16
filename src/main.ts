import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './infra/swagger/swagger.config';
import * as session from 'express-session';
import MongoStore = require('connect-mongo');
import { databaseConfig } from './config/database.config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: configService.get('app.corsOrigin'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(
    session({
      secret: configService.get<string>('app.sessionSecret') || 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: configService.get<string>('app.env') === 'production',
        sameSite:
          configService.get<string>('app.env') === 'production'
            ? 'none'
            : 'lax',
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
      },
      store: MongoStore.create({
        mongoUrl: `${databaseConfig.database.monogodb.uri}`,
        collectionName: 'sessions',
      }),
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
  });

  if (configService.get<string>('app.env') === 'development') {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port, () => {
    logger.debug(`Server running on http://localhost:${port}/api/v1/test`);
    logger.debug(`Swagger running on http://localhost:${port}/api/docs`);
  });
}
bootstrap();
