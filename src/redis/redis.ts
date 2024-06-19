import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { GlobalConfigService } from 'src/shared/config/globalConfig.service';

export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT', // Token for the Redis client
  inject: [GlobalConfigService],
  useFactory: (config: GlobalConfigService) => {
    return new Redis({
      host: config.env.REDIS_HOST,
      port: config.env.REDIS_PORT,
      db: config.env.REDIS_DB_INDEX,
    }); // Instantiate the Redis client with default options
  },
};
