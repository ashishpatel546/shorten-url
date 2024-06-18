import { Module, Global } from '@nestjs/common';
// import { AppConfigService } from './config/config.service';
// import { DbConfig } from './config/dbConfig';
import { GlobalConfigService } from './config/globalConfig.service';

@Global()
@Module({
  providers: [GlobalConfigService],
  exports: [GlobalConfigService],
})
export class SharedModule {}
