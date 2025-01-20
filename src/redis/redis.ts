import { Provider } from '@nestjs/common';
import { Redis as IORedis } from 'ioredis';
import { GlobalConfigService } from '../shared/config/globalConfig.service';

import { Redis as RedisClient } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';
export type Redis = RedisClient;

export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT', // Token for the Redis client
  inject: [GlobalConfigService],
  useFactory: (config: GlobalConfigService) => {
    return new IORedis({
      host: config.env.REDIS_HOST,
      port: config.env.REDIS_PORT,
      db: config.env.REDIS_DB_INDEX,
    }); // Instantiate the Redis client with default options
  },
};
