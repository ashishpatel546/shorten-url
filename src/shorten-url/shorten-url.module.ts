import { Global, Module } from '@nestjs/common';
import { ShortenUrlService } from './shorten-url.service';
// import { CacheModule } from '@nestjs/cache-manager';
// import { GlobalConfigService } from 'src/shared/config/globalConfig.service';
import { RedisModule } from 'src/redis/redis.module';
import { ShortenUrlController } from './shorten-url.controller';

@Global()
@Module({
  imports: [
    // CacheModule.registerAsync({
    //   inject: [GlobalConfigService],
    //   useFactory: (config: GlobalConfigService) => {
    //     return {
    //       ttl: config.env.REDIS_TTL,
    //     };
    //   },
    // }),
    RedisModule,
  ],
  controllers: [ShortenUrlController],
  providers: [ShortenUrlService],
  exports: [ShortenUrlService],
})
export class ShortenUrlModule {}
