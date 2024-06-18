import { Module, Global } from '@nestjs/common';
import { RedisProvider } from './redis';

@Global()
@Module({
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {}
