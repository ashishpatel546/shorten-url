import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Version,
  VERSION_NEUTRAL,
  Req,
  Header,
} from '@nestjs/common';
import { Request } from 'express';
import { URLShortenService } from './url-shorten.service';
import { ApiBody, ApiTags, ApiResponse } from '@nestjs/swagger';
import { ShortenUrlDto } from './dto/shorten-url-req.dto';
import { GlobalConfigService } from '../shared/config/globalConfig.service';

@ApiTags('URL Shortening Service')
@Controller()
export class URLShortenController {
  constructor(
    private readonly service: URLShortenService,
    private readonly config: GlobalConfigService,
  ) {}

  @Post('/get-smlink')
  @ApiBody({ type: ShortenUrlDto })
  @ApiResponse({ status: 201, description: 'URL shortened successfully' })
  @ApiResponse({ status: 400, description: 'Invalid URL' })
  async generateSmlink(
    @Body() reqBody: ShortenUrlDto,
    @Req() request: Request
  ): Promise<{ shortUrl: string }> {
    const original_url = reqBody.original_url;
    const expires_in =
      reqBody.expires_in ?? this.config.env.REDIS_TTL ?? 48 * 60 * 60;
    
    // Construct the base URL of our service (where shortened URLs will be hosted)
    // You could alternatively set this in environment variables
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    // or: const baseUrl = this.config.env.SERVICE_BASE_URL;
    
    const shortUrl = await this.service.generateSmlink(original_url, expires_in, baseUrl);
    return { shortUrl };
  }

  //Get original Url
  @Get('/get-original-url/:smlink_key')
  getOriginalUrl(@Param('smlink_key') smlink_key: string): Promise<string> {
    return this.service.getOriginalUrlFromKey(smlink_key);
  }

  //Resolve smlink to original end points
  @Version(VERSION_NEUTRAL)
  @Get('/:smlink')
  @Redirect()
  @Redirect()
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  async resolveSmlink(@Param('smlink') smlink: string) {
    const originalUrl = await this.service.getOriginalUrlFromKey(smlink);
    
    // Add protocol if not present
    const urlToRedirect = originalUrl.match(/^(http|https):\/\//)
      ? originalUrl
      : `https://${originalUrl}`;

    return {
      url: urlToRedirect,
      statusCode: 301,
    };
  }
}
