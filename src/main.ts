import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const logger = new Logger();
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  logger.log(`Application listening on port ${port || 3000}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
