import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ // Gloabl Pipe
    whitelist: true, // 우리가 프로퍼티로 정의하지 않은 값들을 요청하면 여기서 필터링 됨. 
    forbidNonWhitelisted: true, // 이건 이제 아예 에러를 발생함. 있으면 안되는 프로퍼티가 존재할때.좀더 타이트하게 하고 싶을때 사용 

  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
