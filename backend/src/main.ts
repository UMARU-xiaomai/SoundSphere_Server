import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 全局前缀
  app.setGlobalPrefix('api');
  
  // 启用 CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // 使用 Helmet 安全头
  app.use(helmet());
  
  // 使用cookie解析中间件
  app.use(cookieParser());
  
  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 剔除未在DTO中声明的属性
      transform: true, // 自动类型转换
      forbidNonWhitelisted: true, // 禁止未在DTO中声明的属性
    }),
  );
  
  // Swagger API 文档
  const config = new DocumentBuilder()
    .setTitle('SoundSphere API')
    .setDescription('SoundSphere 音乐创作与分享平台 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // 启动服务器
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`应用程序正在运行，端口：${port}`);
}

bootstrap(); 