import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('BASE URL')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get('/health-check')
  getHello(): string {
    return this.appService.hello();
  }
}
