import { Controller, Get, Param } from '@nestjs/common';
import { ShortenUrlService } from './shorten-url.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Shorten URL')
@Controller()
export class ShortenUrlController {
  constructor(private readonly service: ShortenUrlService) {}

  @Get('/generate-tiny-url/:original_url')
  generateTinyUrl(
    @Param('original_url') original_url: string,
  ): Promise<string> {
    return this.service.generateTinyUrl(original_url);
  }
  @Get('/get-original-url/:tiny_url')
  getOriginalUrl(@Param('tiny_url') tiny_url: string): Promise<string> {
    return this.service.getOriginalUrl(tiny_url);
  }
}
