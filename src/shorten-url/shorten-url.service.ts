// import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  Scope,
} from '@nestjs/common';
// import { Cache } from 'cache-manager';
import ShortUniqueId from 'short-unique-id';
import Redis from 'ioredis';
import { GlobalConfigService } from 'src/shared/config/globalConfig.service';

@Injectable({ scope: Scope.REQUEST })
export class ShortenUrlService {
  private logger = new Logger(ShortenUrlService.name);

  constructor(
    // @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly config: GlobalConfigService,
  ) {}

  async generateTinyUrl(originalUrl: string, expiresIn: number) {
    if (!originalUrl) {
      this.logger.error('No original url found to get tiny url');
      throw new InternalServerErrorException('Something Went wrong!');
    }
    // We can use a more sophisticated encoding algorithm here but for now its fine
    try {
      const uid = new ShortUniqueId({ length: 10 });
      const tinyString = uid.rnd();
      const tinyUrl = `${this.config.env.BASE_URL}/${tinyString}`;

      //create redis key with some pattern
      const redisKey = this.generateKey(tinyString);

      //set the key and value to redis
      await this.redis.set(redisKey, originalUrl);
      //set expiry time for the key
      await this.redis.expire(redisKey, expiresIn);
      return tinyUrl;
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error('Unable to get original url from cache');
      throw new InternalServerErrorException('Something Went wrong!');
    }
  }

  async getOriginalUrlFromKey(tinyUrlKey: string) {
    if (!tinyUrlKey) {
      this.logger.error('No tiny url found');
      throw new BadRequestException('Invalid URL');
    }
    try {
      const redisKey = this.generateKey(tinyUrlKey);
      const cachedUrl: string = await this.redis.get(redisKey);
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

  async getCachedUrl(tinyUrl: string) {
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

  generateKey(tinyurl: string) {
    if (!tinyurl) throw new BadRequestException('tiny url can not be empty');
    return `${this.config.env.SHORTEN_URL_KEY_PATTERN}${tinyurl}`;
  }
}
