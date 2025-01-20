import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest'); // Changed import syntax
import { AppModule } from '../src/app.module';
import { ShortenUrlDto } from '../src/url-shortner/dto/shorten-url-req.dto';

describe('URLShortenController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/get-smlink (POST)', () => {
    it('should create shortened URL', () => {
      const payload: ShortenUrlDto = {
        original_url: 'https://example.com',
        expires_in: 3600
      };

      return request(app.getHttpServer())
        .post('/get-smlink')
        .send(payload)
        .expect(201)
        .expect(res => {
          expect(res.body.shortUrl).toMatch(/^http:\/\/[^/]+\/[a-zA-Z0-9]+$/);
        });
    });

    // ...existing code...
  });

  // ...existing code...
});
