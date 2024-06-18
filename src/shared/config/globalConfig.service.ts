import { Injectable } from '@nestjs/common';
import { EnvironmentVariables } from './dto/env.dto';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class GlobalConfigService {
  private readonly envVariables: EnvironmentVariables;

  constructor() {
    const config = plainToClass(EnvironmentVariables, process.env);
    const errors = validateSync(config, { skipMissingProperties: false });
    if (errors.length > 0) {
      throw new Error(
        `Global Configuration validation error: ${errors.toString()}`,
      );
    }
    this.envVariables = config;
  }
  // Expose the entire validated configuration object
  get env(): EnvironmentVariables {
    return this.envVariables;
  }
}
