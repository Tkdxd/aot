import { Module } from '@nestjs/common';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { ViewModule } from './view/view.module';
import { TestModule } from './test/test.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppGateway } from './app.gateway';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    RenderModule.forRootAsync(Next({ dev: true })),
    ViewModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'),
      serveRoot: '/public/',
    }),
    TestModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/test'),
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
