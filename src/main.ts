import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 정적 파일을 제공
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // views를 serving할 떄의 위치
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // 어떤 템플릿 엔진을 사용할 것인지
  app.setViewEngine('hbs');
  const PORT = process.env.PORT;
  await app.listen(PORT);
}

bootstrap();
