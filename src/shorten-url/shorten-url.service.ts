// import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
// import { Cache } from 'cache-manager';
import ShortUniqueId from 'short-unique-id';
import Redis from 'ioredis';
import { GlobalConfigService } from 'src/shared/config/globalConfig.service';

@Injectable()
export class ShortenUrlService {
  private logger = new Logger(ShortenUrlService.name);

  constructor(
    // @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly config: GlobalConfigService
  ) {}

  async generateTinyUrl(originalUrl: string) {
    if (!originalUrl) {
      this.logger.error('No original url found to get tiny url');
      throw new InternalServerErrorException('Something Went wrong!');
    }
    // You can use a more sophisticated encoding algorithm here
    try {
      const uid = new ShortUniqueId({ length: 10 });
      const tinyString = uid.rnd();
      const tinyUrl = `${this.config.env.BASE_TINY_URL}/${tinyString}`;
      const redisResponse = await this.redis.set(tinyString, originalUrl);
      await this.redis.expire(tinyString, this.config.env.REDIS_TTL)
      return tinyUrl;
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error('Unable to get original url from cache');
      throw new InternalServerErrorException('Something Went wrong!');
    }
  }

  async getOriginalUrl(tinyUrl: string) {
    if (!tinyUrl) {
      this.logger.error('No tiny url found');
      throw new BadRequestException('Invalid URL');
    }
    try {
      const cachedUrl: string = await this.redis.get(tinyUrl);
      if (!cachedUrl) {
        this.logger.error('No original URL found against tiny URL');
        throw new BadRequestException('Invalid or expired URL');
      }
      return cachedUrl;
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error('Unable to get original url from tiny url');
      throw new BadRequestException('Invalid or expired URL');
    }
  }
}
