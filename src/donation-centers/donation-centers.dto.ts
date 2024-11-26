import { DonationType } from '@prisma/client';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsEnum,
  IsDate,
  IsInt,
  MinLength,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDonationCenterDto {
  @ApiProperty({
    description: 'The name of the donation center',
    example: 'Central Blood Donation Center',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'The physical address of the donation center',
    example: '123 Donation St, Springfield, IL',
  })
  @IsString()
  @MinLength(5)
  address: string;

  @ApiProperty({
    description: 'The contact number for the donation center',
    example: '123-456-7890',
  })
  @IsString()
  @MinLength(10)
  contactNumber: string;

  @ApiProperty({
    description: 'The email of the donation center (optional)',
    example: 'contact@donationcenter.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The latitude of the donation center location',
    example: 40.7128,
  })
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    description: 'The longitude of the donation center location',
    example: -74.006,
  })
  @IsLongitude()
  longitude: number;

  @ApiProperty({
    description: 'A short description of the donation center (optional)',
    example: 'This center specializes in blood and organ donations.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The operating hours of the donation center (optional)',
    example: 'Mon-Fri: 9 AM - 5 PM',
    required: false,
  })
  @IsString()
  @IsOptional()
  operatingHours?: string;

  @ApiProperty({
    description: 'The types of donation the center specializes in (optional)',
    example: ['BLOOD', 'PLASMA'],
    enum: DonationType,
    required: false,
  })
  @IsEnum(DonationType, { each: true })
  @IsOptional()
  specializedIn?: DonationType[];
}

export class UpdateDonationCenterDto {
  @ApiProperty({
    description: 'The name of the donation center (optional)',
    example: 'Central Blood Donation Center',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The physical address of the donation center (optional)',
    example: '123 Donation St, Springfield, IL',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'The contact number for the donation center (optional)',
    example: '123-456-7890',
    required: false,
  })
  @IsString()
  @IsOptional()
  contactNumber?: string;

  @ApiProperty({
    description: 'The email of the donation center (optional)',
    example: 'contact@donationcenter.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The latitude of the donation center location (optional)',
    example: 40.7128,
    required: false,
  })
  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'The longitude of the donation center location (optional)',
    example: -74.006,
    required: false,
  })
  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'A short description of the donation center (optional)',
    example: 'This center specializes in blood and organ donations.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The operating hours of the donation center (optional)',
    example: 'Mon-Fri: 9 AM - 5 PM',
    required: false,
  })
  @IsString()
  @IsOptional()
  operatingHours?: string;

  @ApiProperty({
    description: 'The types of donation the center specializes in (optional)',
    example: ['BLOOD', 'PLASMA'],
    enum: DonationType,
    required: false,
  })
  @IsEnum(DonationType, { each: true })
  @IsOptional()
  specializedIn?: DonationType[];
}

export class CreateDonationSlotDto {
  @ApiProperty({
    description: 'The start time of the donation slot',
    example: '2024-11-26T09:00:00Z',
  })
  @IsDate()
  startTime: Date;

  @ApiProperty({
    description: 'The end time of the donation slot',
    example: '2024-11-26T12:00:00Z',
  })
  @IsDate()
  endTime: Date;

  @ApiProperty({
    description: 'The types of donations available in this slot',
    example: ['BLOOD', 'PLASMA'],
    enum: DonationType,
  })
  @IsEnum(DonationType, { each: true })
  donationType: DonationType[];

  @ApiProperty({
    description: 'The total number of available donation slots',
    example: 10,
  })
  @IsInt()
  totalSlots: number;
}
