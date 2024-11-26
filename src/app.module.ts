import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DonationCentersModule } from './donation-centers/donation-centers.module';
import { PrismaModule } from './prisma/prisma.module'; // Assuming Prisma is used for database interactions
import { ConfigModule } from '@nestjs/config'; // For managing environment variables
import * as cookieParser from 'cookie-parser'; // To parse cookies
import { JwtCookieMiddleware } from './middleware/jwt-cookie.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes environment variables globally available
    }),
    PrismaModule, // Custom Prisma Module for database interactions
    UsersModule, // User-related functionality
    DonationCentersModule, // Donation center management
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(), JwtCookieMiddleware) // Use cookie-parser and the middleware
      .forRoutes('*'); // Apply globally to all routes
  }
}
