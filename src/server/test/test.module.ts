import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NodeSchema, Node } from './schemas/node.schema';
import { TestGateway } from './test.gateway';

@Module({
  imports: [
    PuppeteerModule.forRoot({ pipe: true }, 'BrowserInstanceName'),
    MongooseModule.forFeature([{ name: Node.name, schema: NodeSchema }]),
  ],
  controllers: [TestController],
  providers: [TestService, ConfigService, TestGateway],
})
export class TestModule {}
