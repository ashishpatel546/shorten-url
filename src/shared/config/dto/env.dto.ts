import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  qa = 'qa',
  stage = 'stage',
}

// enum Boolean {
//   true = 'true',
//   false = 'false',
// }

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsNotEmpty()
  NODE_ENV: Environment;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  SERVICE_PORT: number;

  @IsString()
  @IsNotEmpty()
  API_VERSION: string;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => Boolean(value))
  POSTMAN_CONFIG_ENABLED: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => Boolean(value))
  ENABLE_DOCUMENTATION: boolean;

  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  REDIS_PORT: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  REDIS_TTL: number;

  @IsString()
  @IsNotEmpty()
  BASE_TINY_URL: string

}
