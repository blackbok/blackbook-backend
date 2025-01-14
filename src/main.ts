import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './infra/swagger/swagger.config';
import * as session from 'express-session';
import MongoStore = require('connect-mongo');
import { databaseConfig } from './config/database.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);


  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: MongoStore.create({
      mongoUrl: `${databaseConfig.database.monogodb.uri}`,
      collectionName: 'sessions'
    })
  }))


  app.enableVersioning(
    {
      type: VersioningType.URI,
      prefix: 'api/v',
    }
  );

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/api/v1/test`);
    console.log(`Swagger running on http://localhost:${port}/api/docs`);
  });
}
bootstrap();
