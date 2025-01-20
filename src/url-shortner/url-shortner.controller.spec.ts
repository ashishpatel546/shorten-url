import { Test, TestingModule } from '@nestjs/testing';
import { URLShortenController } from './url-shortner.controller';
import { URLShortenService } from './url-shorten.service';
import { GlobalConfigService } from '../shared/config/globalConfig.service';
import { ShortenUrlDto } from './dto/shorten-url-req.dto';

jest.mock('../shared/config/globalConfig.service');

describe('URLShortenController', () => {
  let controller: URLShortenController;
  let service: URLShortenService;

  const mockURLShortenService = {
    generateSmlink: jest.fn(),
    getOriginalUrlFromKey: jest.fn(),
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
    },
  };

  const mockRequest = {
    protocol: 'http',
    get: jest.fn().mockReturnValue('localhost:8080'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [URLShortenController],
      providers: [
        {
          provide: URLShortenService,
          useValue: mockURLShortenService,
        },
        {
          provide: GlobalConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<URLShortenController>(URLShortenController);
    service = module.get<URLShortenService>(URLShortenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateSmlink', () => {
    it('should generate short url', async () => {
      const reqBody: ShortenUrlDto = {
        original_url: 'https://example.com',
        expires_in: 3600 // Adding the required field
      };
      const expectedResponse = { shortUrl: 'http://localhost:8080/abc123' };
      
      jest.spyOn(service, 'generateSmlink').mockResolvedValue(expectedResponse.shortUrl);

      const result = await controller.generateSmlink(reqBody, mockRequest as any);
      
      expect(service.generateSmlink).toHaveBeenCalledWith(
        reqBody.original_url,
        reqBody.expires_in,
        'http://localhost:8080'
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('resolveSmlink', () => {
    it('should redirect to original URL with https if protocol missing', async () => {
      mockURLShortenService.getOriginalUrlFromKey.mockResolvedValue('example.com');

      const result = await controller.resolveSmlink('abc123');

      expect(result).toEqual({
        url: 'https://example.com',
        statusCode: 301,
      });
    });

    it('should redirect to original URL with existing protocol', async () => {
      mockURLShortenService.getOriginalUrlFromKey.mockResolvedValue('https://example.com');

      const result = await controller.resolveSmlink('abc123');

      expect(result).toEqual({
        url: 'https://example.com',
        statusCode: 301,
      });
    });
  });
});
