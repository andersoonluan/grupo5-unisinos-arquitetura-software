import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import throttlerConfig from './../src/throttler.config';
import ormConfig = require('./ormconfig.test');
import 'dotenv/config';

describe('Global E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forRoot(ormConfig)],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Global - Rate Limiting', () => {
    it('Rate limit must be configured', () => {
      expect(throttlerConfig.limit).toBeGreaterThan(0);
      expect(throttlerConfig.ttl).toBeGreaterThan(0);
    });

    it('Should return 429 HTTP status if too many requests', async () => {
      const requests = [];
      for (let i = 0; i < throttlerConfig.limit; i++) {
        requests.push(request(app.getHttpServer()).get('/health'));
      }

      await Promise.all(requests);
      return request(app.getHttpServer()).get('/health').expect(429);
    });
  });
});
