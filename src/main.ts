import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from "path";
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true
  });
  app.useStaticAssets(join(__dirname, '..', 'static'));
  const configService: ConfigService = app.get(ConfigService);

  /* pipes */
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false, // shows errors if some properties were not filled correctly in DTO
      whitelist: true, // sorts the extra data that comes into the DTO
      forbidNonWhitelisted: true, // shows errors if there are extra inputs in the DTO
      transform: true // converts the type being sent to the specified type in the DTO
    }),
  );

  /* filters */
  // app.useGlobalFilters(new HttpExceptionFilter());

  /* api routes prefix */
  app.setGlobalPrefix('api');

  /* swagger */
  const config = new DocumentBuilder()
    .setTitle('Backend')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {});

  /* starting app */
  const PORT = Number(process.env.PORT || 3002);
  await app.listen(PORT, () => logger.log(`Server started at ${PORT}`));
}
bootstrap();
