import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SeedService } from '../prisma/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS détaillée
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:19006', 'http://localhost:19000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

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
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
