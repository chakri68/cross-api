import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user (at least 6 characters)',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The role of the user. Defaults to DONOR',
    example: 'DONOR',
    enum: UserRole,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.DONOR;

  @ApiProperty({
    description: 'The phone number of the user (optional)',
    example: '123-456-7890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'The address of the user (optional)',
    example: '123 Main St, Springfield, IL',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'The latitude of the user location (optional)',
    example: 40.7128,
    required: false,
  })
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'The longitude of the user location (optional)',
    example: -74.006,
    required: false,
  })
  @IsOptional()
  longitude?: number;
}

export class SignInUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user (at least 6 characters)',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
