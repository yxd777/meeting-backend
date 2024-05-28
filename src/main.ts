import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './custom-exception.filter';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import { UnloginFilter } from './unlogin.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  // npm install --save class-validator class-transformer
  // 检验dto
  app.useGlobalPipes(new ValidationPipe());
  // 格式化请求
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  // 记录请求
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  // app.useGlobalFilters(new UnloginFilter())
  // 格式化异常返回
  app.useGlobalFilters(new CustomExceptionFilter());

  app.enableCors();

  // npm install --save @nestjs/swagger
  const config = new DocumentBuilder()
    .setTitle('会议室预订系统')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的认证',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
