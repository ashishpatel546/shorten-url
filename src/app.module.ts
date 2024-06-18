import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { ShortenUrlModule } from './shorten-url/shorten-url.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: false,
      cache: true,
    }),
    SharedModule,
    ShortenUrlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
