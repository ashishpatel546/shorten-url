import { Plan } from '../entities/plan.enum';
import { IsEnum } from 'class-validator';

export class UpdatePlanDto {
  @IsEnum(Plan)
  plan: Plan;
}
