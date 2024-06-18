import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
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

  @Get('/:tinyurl')
  async resolveTinyUrl(@Res() res: Response, @Param('tinyurl') tinyurl: string){
    const originalUrl = await this.shortenService.getOriginalUrl(tinyurl)
    res.redirect(originalUrl)
  }

  
}
