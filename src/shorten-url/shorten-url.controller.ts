import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { ShortenUrlService } from './shorten-url.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { isURL } from 'class-validator';

@ApiTags('Shorten URL')
@Controller()
export class ShortenUrlController {
  constructor(private readonly service: ShortenUrlService) {}

  //Generate tiny url from original url
  @Get('/generate-tiny-url/:original_url')
  @ApiParam({
    name: 'original_url',
    description: 'provide original url',
    required: true,
  })
  generateTinyUrl(
    @Param('original_url') original_url: string,
  ): Promise<string> {
    if (isURL(original_url)) return this.service.generateTinyUrl(original_url);
    else throw new BadRequestException('Invalid Url');
  }

  //Get original Url
  @Get('/get-original-url/:tiny_url_key')
  getOriginalUrl(@Param('tiny_url_key') tiny_url_key: string): Promise<string> {
    return this.service.getOriginalUrl(tiny_url_key);
  }

  //Resolve tiny url to original end points
  @Get('/:tinyurl')
  async resolveTinyUrl(
    @Res() res: Response,
    @Param('tinyurl') tinyurl: string,
  ) {
    const redisKey = this.service.generateKey(tinyurl); //`shorten-url-${tinyurl}`
    const originalUrl = await this.service.getOriginalUrl(redisKey);
    res.redirect(originalUrl);
  }
}
