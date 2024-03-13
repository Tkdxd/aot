import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PuppeteerModule } from 'nest-puppeteer';

@Module({
  imports: [PuppeteerModule.forFeature()],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
