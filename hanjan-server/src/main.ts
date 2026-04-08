import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(helmet());
    app.use(compression());

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
    }));

    app.enableCors();

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`HANJAN Server is running on: http://localhost:${port}/api`);
}
bootstrap();
