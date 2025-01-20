import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user/user.service';
import { Inject } from '@nestjs/common';
import { REDIS_CLIENT, Redis } from '../redis/redis';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const authHeader = req.headers.authorization;
    
    // Check if user is authenticated
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const userId = await this.redis.get(`auth:${token}`);
      
      if (userId) {
        const user = await this.userService.findOne({ where: { id: Number(userId) } });
        if (user) {
          // Apply plan-based rate limits
          const plan = user.plan.toLowerCase();
          const limit = this.getPlanLimit(plan);
          const key = `rate_limit:user:${user.id}`;
          
          const current = await this.redis.incr(key);
          if (current === 1) {
            await this.redis.expire(key, 86400); // 24 hours
          }
          
          if (current > limit) {
            return res.status(429).json({
              message: `Rate limit exceeded. Your ${plan} plan allows ${limit} requests per day.`
            });
          }
          
          return next();
        }
      }
    }

    // Apply IP-based rate limits for unauthenticated users
    const ipKey = `rate_limit:ip:${ip}`;
    const ipCurrent = await this.redis.incr(ipKey);
    if (ipCurrent === 1) {
      await this.redis.expire(ipKey, 7200); // 2 hours
    }
    
    if (ipCurrent > 5) {
      return res.status(429).json({
        message: 'Rate limit exceeded. Unauthenticated users are limited to 5 requests per hour.'
      });
    }
    
    next();
  }

  private getPlanLimit(plan: string): number {
    switch (plan) {
      case 'free':
        return 20;
      case 'gold':
        return 100;
      case 'platinum':
        return 1000;
      case 'titanium':
        return Infinity;
      default:
        return 5;
    }
  }
}
