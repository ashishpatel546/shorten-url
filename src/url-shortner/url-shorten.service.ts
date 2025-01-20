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
import { GlobalConfigService } from '../shared/config/globalConfig.service';

@Injectable()
export class URLShortenService {
  private logger = new Logger(URLShortenService.name);

  constructor(
    // @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly config: GlobalConfigService,
  ) {}

  private isValidUrl(url: string): boolean {
    try {
      const urlObject = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObject.hostname.includes('.') && urlObject.hostname.length > 3;
    } catch {
      return false;
    }
  }

  async generateSmlink(
    originalUrl: string,
    expiresIn: number,
    baseUrl: string
  ): Promise<string> {
    if (!originalUrl || !this.isValidUrl(originalUrl)) {
      throw new BadRequestException('Invalid URL provided');
    }

    try {
      const uid = new ShortUniqueId({ length: 10 });
      const tinyString = uid.rnd();
      const redisKey = this.generateKey(tinyString);
      
      // Check for collisions
      const existing = await this.redis.get(redisKey);
      if (existing) {
        return this.generateSmlink(originalUrl, expiresIn, baseUrl); // Retry with new key
      }

      const tinyUrl = `${baseUrl}/${tinyString}`;
      await this.redis.set(redisKey, originalUrl);
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

  generateKey(tinyurl: string) {
    if (!tinyurl) throw new BadRequestException('tiny url can not be empty');
    return `${this.config.env.SHORTEN_URL_KEY_PATTERN}${tinyurl}`;
  }
}
