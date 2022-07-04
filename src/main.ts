// Initialize DD first
import './common/utils/dd-tracer.util';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'body-parser';
import { AppModule } from './app.module';
import { ExceptionHandlerFilter } from './common/filters/exception-handler.filter';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import helmet = require('helmet');
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiPort = +process.env.API_PORT || 3000;
  const apiPrefix = '/api';
  const apiVersion = 'v1';

  app.setGlobalPrefix(apiPrefix + '/' + apiVersion, {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  app.useGlobalFilters(new ExceptionHandlerFilter());
  app.useGlobalInterceptors(new ErrorsInterceptor());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Grupo 5 API Atividade')
    .setDescription('Esta é uma aplicação desenvolvida pelo Grupo 5! Unisinos Pos Graduação de Engenharia de Software 2022')
    .setVersion(apiVersion)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(apiPrefix, app, document);

  await app.listen(apiPort);
}

bootstrap().then();
