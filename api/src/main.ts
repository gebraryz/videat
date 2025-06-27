import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "./utils/env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<EnvironmentVariables>);

  app.enableCors({ origin: configService.get("APP_ORIGIN", { infer: true }) });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  const port = configService.get("APP_PORT", { infer: true }) || 8000;

  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
