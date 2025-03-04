import { plainToInstance } from "class-transformer";
import {
  IsEnum,
  IsLocale,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from "class-validator";

enum Environment {
  Development = "development",
  Production = "production",
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  APP_PORT: number;

  @IsString()
  @MinLength(10)
  YOUTUBE_API_KEY: string;

  @IsLocale()
  FALLBACK_LANGUAGE: string;
}

export const validateEnv = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors.map(
      (error) =>
        `Property ${error.property}: ${Object.values(error.constraints).join(
          ", "
        )}`
    );

    throw new Error(`Validation failed:\n${errorMessages.join("\n")}`);
  }

  return validatedConfig;
};
