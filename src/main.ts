import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // Initialize the NestJS application
  const app = await NestFactory.create(AppModule);

  // Configure Swagger for API documentation
  const config = new DocumentBuilder()
    .setTitle('Blood Donation Center API') // Title of the API
    .setDescription(
      'Comprehensive API for managing blood donation centers, users, and bookings',
    ) // Description
    .setVersion('1.0') // API version
    .addTag('users', 'Endpoints related to user management') // Tag for user-related operations
    .addTag('donation-centers', 'Endpoints for managing donation centers') // Tag for donation-center operations
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth', // Name the bearer auth for referencing in guards
    ) // Configure JWT authentication
    .build();

  // Generate Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI at the endpoint `/api-docs`
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { persistAuthorization: true }, // Keep JWT token persistent across UI reloads
  });

  // Enable CORS for cross-origin requests (if needed)
  app.enableCors();

  // Start the application on port 3000
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log(
    'Swagger documentation available at: http://localhost:3000/api-docs',
  );
}

bootstrap();
