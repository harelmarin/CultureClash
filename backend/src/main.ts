import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SeedService } from '../prisma/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Configuration de WebSocket
  app.useWebSocketAdapter(new IoAdapter(app));

  const seedService = app.get(SeedService);

  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('Culture Clash API')
    .setBasePath('api')
    .setDescription("Documentation de l'API pour Culture Clash")
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await seedService.seed();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
