import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import compression from 'compression';
import {
  ValidationPipe,
  HttpStatus,
  UnprocessableEntityException,
  Logger,
  VersioningType,
} from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
// import { AppConfigService } from './shared/config/config.service';
import { setupSwagger } from './setupSwagger';
import { loggerMiddleware } from './middlewares/reqeust-logger.middleware';
import { getHeapStatistics } from 'v8';
import { GlobalConfigService } from './shared/config/globalConfig.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(loggerMiddleware);
  app.use(compression());
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.enableCors;
  const configService = app.select(SharedModule).get(GlobalConfigService);
  const apiVersion = configService.env.API_VERSION;
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  if (configService.env.ENABLE_DOCUMENTATION) {
    setupSwagger(app);
  }
  const port = configService.env.SERVICE_PORT;
  await app.listen(port);
  Logger.log(`Server is listening on ${await app.getUrl()}`);

  const totalHeapSize = getHeapStatistics().total_available_size;
  const totalHeapSizaInMB = (totalHeapSize / 1024 / 1024).toFixed(2);
  Logger.log(`Total Memory for the process is set to: ${totalHeapSizaInMB}`);
}
bootstrap();
