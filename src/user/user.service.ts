import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan, PlanPrices } from './entities/plan.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      plan: Plan.FREE
    });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOne(options: any): Promise<User | undefined> {
    return this.userRepository.findOne(options);
  }

  async updatePlan(userId: string, updatePlanDto: UpdatePlanDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.plan = updatePlanDto.plan;
    user.requestsUsed = 0; // Reset request count when changing plan
    return this.userRepository.save(user);
  }

  async getPlanPrice(plan: Plan): Promise<number> {
    return PlanPrices[plan];
  }

  async resetDailyLimits(): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ 
        requestsUsed: 0,
        lastRequestReset: new Date() 
      })
      .where('lastRequestReset < :date', { date: new Date(new Date().setHours(0, 0, 0, 0)) })
      .execute();
  }

  async getUsageStats() {
    return this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.plan AS plan',
        'COUNT(user.id) AS user_count',
        'SUM(user.requestsUsed) AS total_requests',
        'AVG(user.requestsUsed) AS avg_requests'
      ])
      .groupBy('user.plan')
      .getRawMany();
  }

  async resetRequestCount(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      requestsUsed: 0,
      lastRequestReset: new Date()
    });
  }

  async incrementRequestCount(userId: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ requestsUsed: () => 'requestsUsed + 1' })
      .where('id = :userId', { userId })
      .execute();
  }
}
