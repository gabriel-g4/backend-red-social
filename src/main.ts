import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  // Servir archivo estático (imagen de perfil)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/'
  });

  // Habilitar CORS

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API Red Social') // Título de la documentación
    .setDescription('API para una red social con usuarios, posts y comentarios.') // Descripción opcional
    .setVersion('1.0') // Versión de la API
    .addBearerAuth() // Si usas autenticación JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Accede a la documentación en /api
  
  let puerto = process.env.PORT ?? 3000
  await app.listen(puerto);
  console.log('Servidor corriendo en puerto ' + puerto)
}
bootstrap();
