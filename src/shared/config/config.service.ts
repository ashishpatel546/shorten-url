// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { isNil } from 'lodash';
// import { GlobalConfigService } from './globalConfig.service';

// @Injectable()
// export class AppConfigService {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly globalConfig: GlobalConfigService,
//   ) {}

//   private get(key: string): string {
//     const value = this.globalConfig.env[key];

//     if (isNil(value)) {
//       throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
//     }
//     return value;
//   }

//   private getString(key: string): string {
//     return this.get(key).trim();
//   }

//   private getNumber(key: string): number {
//     const value = this.get(key);

//     try {
//       return parseInt(value);
//     } catch {
//       throw new Error(key + ' environment variable is not a number');
//     }
//   }

//   private getBoolean(key: string): boolean {
//     const value = this.get(key);

//     try {
//       return Boolean(JSON.parse(value));
//     } catch {
//       throw new Error(key + ' env var is not a boolean');
//     }
//   }

//   get nodeEnv(): string {
//     return this.getString('NODE_ENV');
//   }

//   get apiVersion(): string {
//     return this.getString('API_VERSION');
//   }

//   get isDevelopment(): boolean {
//     return this.nodeEnv === 'development';
//   }

//   get isProduction(): boolean {
//     return this.nodeEnv === 'production';
//   }

//   get isTest(): boolean {
//     return this.nodeEnv === 'test';
//   }

//   get documentationEnabled(): boolean {
//     return this.getBoolean('ENABLE_DOCUMENTATION');
//   }

//   get isCronEnabled(): boolean {
//     return this.getBoolean('CRON_ENABLED');
//   }

//   get appConfig(): { port: number } {
//     return {
//       port: this.getNumber('SERVICE_PORT'),
//     };
//   }
// }
