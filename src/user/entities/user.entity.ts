import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Plan } from './plan.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Plan,
    default: Plan.FREE
  })
  plan: Plan;

  @Column({ default: 0 })
  requestsUsed: number;

  @Column({ nullable: true })
  lastRequestReset: Date;

  @Column({ default: false })
  isAdmin: boolean;

  get requestLimit(): number {
    switch (this.plan) {
      case Plan.FREE:
        return 20;
      case Plan.GOLD:
        return 100;
      case Plan.PLATINUM:
        return 1000;
      case Plan.TITANIUM:
        return Infinity;
      default:
        return 0;
    }
  }
}
