import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ShortenUrlService } from './shorten-url/shorten-url.service';

@ApiTags('BASE URL')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly shortenService: ShortenUrlService
  ) {}


  @Get('/health-check')
  getHello(): string {
    return this.appService.hello();
  }

  
}
