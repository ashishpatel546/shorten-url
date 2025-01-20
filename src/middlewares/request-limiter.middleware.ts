import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user/user.service';
import { REDIS_CLIENT } from '../redis/redis';
import Redis from 'ioredis';

@Injectable()
export class RequestLimiterMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private async getIpRequestCount(ip: string): Promise<number> {
    const key = `rate_limit:ip:${ip}`;
    const count = await this.redis.get(key);
    return count ? parseInt(count, 10) : 0;
  }

  private async incrementIpRequestCount(ip: string): Promise<void> {
    const key = `rate_limit:ip:${ip}`;
    const currentCount = await this.getIpRequestCount(ip);
    
    if (currentCount === 0) {
      await this.redis.set(key, '1', 'EX', 3600);
    } else {
      await this.redis.incr(key);
    }
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const user = req.user as any;

    // Check for anonymous user limits
    if (!user) {
      const ipRequests = await this.getIpRequestCount(ip);
      if (ipRequests >= 5) {
        return res.status(429).json({
          message: 'Anonymous request limit exceeded (5 requests per IP per hour)',
        });
      }
      await this.incrementIpRequestCount(ip);
      return next();
    }

    // Check for authenticated user limits
    const now = new Date();
    const lastReset = user.lastRequestReset || now;
    
    // Reset counters if it's a new day
    if (now.getDate() !== lastReset.getDate()) {
      await this.userService.resetRequestCount(user.id);
    }

    const userData = await this.userService.findOne({ where: { id: user.id } });
    if (!userData) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (userData.requestsUsed >= userData.requestLimit) {
      return res.status(429).json({
        message: 'Request limit exceeded',
        limit: userData.requestLimit,
        plan: userData.plan,
        remaining: 0,
      });
    }

    // Increment request count
    await this.userService.incrementRequestCount(user.id);
    
    // Set remaining requests in response headers
    res.set('X-RateLimit-Limit', userData.requestLimit.toString());
    res.set('X-RateLimit-Remaining', (userData.requestLimit - userData.requestsUsed - 1).toString());

    next();
  }
}
