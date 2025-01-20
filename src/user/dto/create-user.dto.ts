import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { Plan } from '../entities/plan.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(Plan)
  plan: Plan;
}
