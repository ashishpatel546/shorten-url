import { Test, TestingModule } from '@nestjs/testing';
import { URLShortenService } from './url-shorten.service';
import { BadRequestException } from '@nestjs/common';
import Redis from 'ioredis';
import { GlobalConfigService } from '../shared/config/globalConfig.service';
import ShortUniqueId from 'short-unique-id';

// Mock ShortUniqueId
jest.mock('short-unique-id', () => {
  return jest.fn().mockImplementation(() => ({
    rnd: () => 'abc123'
  }));
});

describe('URLShortenService', () => {
  let service: URLShortenService;
  let redis: Redis;

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    expire: jest.fn(),
  };

  const mockConfigService = {
    env: {
      NODE_ENV: 'test',
      SERVICE_PORT: 3000,
      API_VERSION: 'v1',
      POSTMAN_CONFIG_ENABLED: true,
      ENABLE_DOCUMENTATION: true,
      REDIS_HOST: 'localhost',
      REDIS_PORT: 6379,
      REDIS_DB_INDEX: 0,
      REDIS_TTL: 172800,
      SHORTEN_URL_KEY_PATTERN: 'smlink:',
      BASE_URL: 'http://localhost:3000',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        URLShortenService,
        {
          provide: 'REDIS_CLIENT',
          useValue: mockRedis,
        },
        {
          provide: GlobalConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<URLShortenService>(URLShortenService);
    redis = module.get('REDIS_CLIENT');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateSmlink', () => {
    const baseUrl = 'http://localhost:8080';

    it('should generate a short URL for valid URL', async () => {
      const originalUrl = 'https://example.com';
      mockRedis.get.mockResolvedValue(null);
      mockRedis.set.mockResolvedValue('OK');
      mockRedis.expire.mockResolvedValue(1);

      const result = await service.generateSmlink(originalUrl, 3600, baseUrl);
      
      expect(result).toBe(`${baseUrl}/abc123`);
      expect(mockRedis.set).toHaveBeenCalledWith('smlink:abc123', originalUrl);
      expect(mockRedis.expire).toHaveBeenCalledWith('smlink:abc123', 3600);
    });

    it('should throw BadRequestException for invalid URL', async () => {
      const invalidUrl = 'invalid-url';
      await expect(service.generateSmlink(invalidUrl, 3600, baseUrl))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('getOriginalUrlFromKey', () => {
    it('should return original URL for valid tiny URL key', async () => {
      const originalUrl = 'https://example.com';
      mockRedis.get.mockResolvedValue(originalUrl);

      const result = await service.getOriginalUrlFromKey('validKey');
      expect(result).toBe(originalUrl);
    });

    it('should throw BadRequestException for non-existent key', async () => {
      mockRedis.get.mockResolvedValue(null);

      await expect(service.getOriginalUrlFromKey('nonexistent'))
        .rejects
        .toThrow(BadRequestException);
    });
  });
});
