import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Users');
console.log('*** process.env.MONGO_URL ***', process.env.MONGO_URL);

// Create microservice options
const microserviceOptions = {
  transport: Transport.TCP,
  options: {
    host: String(process.env.USER_HOST||'127.0.0.1'),
    port: Number(process.env.USER_SERVICE_PORT||3001),
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOptions,
  );
  await app.listen().then(() => {
    logger.log('¡Company microservice is listening!');
    console.log('listening on port:', process.env.USER_SERVICE_PORT||3001)
  });
}
bootstrap();
