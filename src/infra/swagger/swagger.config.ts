import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Blackbook API')
  .setDescription('API for Blackbook')
  .setVersion('1.0')
  .build();
