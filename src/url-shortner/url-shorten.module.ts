import { Global, Module } from '@nestjs/common';
import { URLShortenService } from './url-shorten.service';import { RedisModule } from 'src/redis/redis.module';
import { URLShortenController } from './url-shortner.controller';

@Global()
@Module({
  imports: [
    RedisModule,
  ],
  controllers: [URLShortenController],
  providers: [URLShortenService],
  exports: [URLShortenService],
})
export class ShortenUrlModule {}
