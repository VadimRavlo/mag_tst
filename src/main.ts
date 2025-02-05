import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await createApp();
  await app.listen(process.env.SERVICE_PORT ?? 3000);
}

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { cors: true });
  setupBaseConfigurations(app);

  return app;
}

function setupBaseConfigurations(app: INestApplication): void {
  const validationPipeOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    forbidUnknownValues: false,
  };
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
}

bootstrap();
