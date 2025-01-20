import { Module, forwardRef } from '@nestjs/common';
import { RequestLimiterMiddleware } from './request-limiter.middleware';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => RedisModule),
    forwardRef(() => UserModule)
  ],
  providers: [RequestLimiterMiddleware],
  exports: [RequestLimiterMiddleware],
})
export class MiddlewaresModule {}
