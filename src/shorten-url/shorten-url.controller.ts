import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import { ShortenUrlService } from './shorten-url.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ShortenUrlDto } from './dto/shorten-url-req.dto';
import { GlobalConfigService } from 'src/shared/config/globalConfig.service';

@ApiTags('Shorten URL')
@Controller()
export class ShortenUrlController {
  constructor(
    private readonly service: ShortenUrlService,
    private readonly config: GlobalConfigService,
  ) {}

  @Post('/generate-tiny-url')
  @ApiBody({ type: ShortenUrlDto })
  generateTinyUrl(@Body() reqBody: ShortenUrlDto): Promise<string> {
    const original_url = reqBody.original_url;
    const expires_in =
      reqBody.expires_in ?? this.config.env.REDIS_TTL ?? 48 * 60 * 60;
    return this.service.generateTinyUrl(original_url, expires_in);
  }

  //Get original Url
  @Get('/get-original-url/:tiny_url_key')
  getOriginalUrl(@Param('tiny_url_key') tiny_url_key: string): Promise<string> {
    return this.service.getOriginalUrlFromKey(tiny_url_key);
  }

  //Resolve tiny url to original end points
  @Get('/:tinyurl')
  @Redirect()
  async resolveTinyUrl(
    @Param('tinyurl') tinyurl: string,
  ) {
    const redisKey = this.service.generateKey(tinyurl); //`shorten-url-${tinyurl}`
    const originalUrl = await this.service.getCachedUrl(redisKey);
    return {
      url: originalUrl,
    };
  }
}
