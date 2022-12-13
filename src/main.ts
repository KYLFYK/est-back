import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';

async function bootstrap(): Promise<void> {

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true
  });

  app.setGlobalPrefix('api');
  app.useStaticAssets(path.join(__dirname, '../', 'public'), {prefix: '/public'});

  const config = new DocumentBuilder()
    .setTitle('Marketplace')
    .setDescription('Marketplace back')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors({
    credentials: true,
    allowedHeaders: '*',
    origin: ['http://localhost:3000', 'http://localhost:3001','http://185.98.83.46:443', 'http://marketplace-front:8008','http://marketplace-front:3000','https://proxy', 'https://estatum.f-case.ru'],
  });

  await app.listen(process.env.APP_PORT);
};

void bootstrap();
