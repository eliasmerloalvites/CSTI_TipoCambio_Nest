import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

const logger = new Logger('Api Gateway');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');  
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true
    })
  )

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle("Calcular Tipo de Cambio")
    .setDescription(`Tipo de Cambio API descripcion \n para obtener el Token loguearse con las siguientes Credenciales \n email: elias@gmail.com y password: 123456`)
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.GATEWAY_PORT||3000);
  logger.log('¡Api Gateway Service listening!');
  console.log('listening on port:', process.env.GATEWAY_PORT||3000);
  //await app.listen(3000);
}
bootstrap();
