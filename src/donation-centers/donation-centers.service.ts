import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DonationType, UserRole } from '@prisma/client';
import {
  CreateDonationCenterDto,
  CreateDonationSlotDto,
  UpdateDonationCenterDto,
} from './donation-centers.dto';

@Injectable()
export class DonationCentersService {
  constructor(private prisma: PrismaService) {}

  // Create a new donation center
  async createCenter(userId: string, createCenterDto: CreateDonationCenterDto) {
    // Verify user has permission
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (
      !user ||
      (user.role !== UserRole.ADMIN && user.role !== UserRole.CENTER_MANAGER)
    ) {
      throw new ForbiddenException('Not authorized to create donation centers');
    }

    return this.prisma.donationCenter.create({
      data: {
        ...createCenterDto,
        managers: {
          connect: { id: userId },
        },
      },
    });
  }

  // Find all centers with pagination and filtering
  async findAllCenters(
    page: number,
    limit: number,
    donationType?: DonationType,
  ) {
    const skip = (page - 1) * limit;

    const where = donationType
      ? { specializedIn: { has: donationType } }
      : ({} as any);

    const [total, centers] = await Promise.all([
      this.prisma.donationCenter.count({ where }),
      this.prisma.donationCenter.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: { availableSlots: true },
          },
        },
      }),
    ]);

    return {
      centers,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // Find nearby centers
  async findNearbyCenters(
    userId: string,
    latitude: number,
    longitude: number,
    radius = 50,
  ) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Basic nearby centers logic with some filtering
    return this.prisma.donationCenter.findMany({
      where: {
        latitude: {
          gte: latitude - radius / 111,
          lte: latitude + radius / 111,
        },
        longitude: {
          gte: longitude - radius / 111,
          lte: longitude + radius / 111,
        },
      },
      include: {
        _count: {
          select: { availableSlots: true },
        },
      },
      take: 10,
    });
  }

  // Get center by ID
  async getCenterById(centerId: string) {
    const center = await this.prisma.donationCenter.findUnique({
      where: { id: centerId },
      include: {
        managers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            availableSlots: true,
          },
        },
      },
    });

    if (!center) {
      throw new NotFoundException('Donation center not found');
    }

    return center;
  }

  // Update center details
  async updateCenter(
    userId: string,
    centerId: string,
    updateCenterDto: UpdateDonationCenterDto,
  ) {
    // Check user's permission to update
    const center = await this.prisma.donationCenter.findUnique({
      where: {
        id: centerId,
        managers: {
          some: { id: userId },
        },
      },
    });

    if (!center) {
      throw new ForbiddenException('Not authorized to update this center');
    }

    return this.prisma.donationCenter.update({
      where: { id: centerId },
      data: updateCenterDto,
    });
  }

  // Delete a center
  async deleteCenter(userId: string, centerId: string) {
    // Ensure only admins can delete
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete centers');
    }

    return this.prisma.donationCenter.delete({
      where: { id: centerId },
    });
  }

  // Create a donation slot
  async createDonationSlot(
    userId: string,
    centerId: string,
    createSlotDto: CreateDonationSlotDto,
  ) {
    // Verify user's permission to create slot
    const center = await this.prisma.donationCenter.findUnique({
      where: {
        id: centerId,
        managers: {
          some: { id: userId },
        },
      },
    });

    if (!center) {
      throw new ForbiddenException(
        'Not authorized to create slots for this center',
      );
    }

    return this.prisma.donationSlot.create({
      data: {
        ...createSlotDto,
        donationCenter: {
          connect: { id: centerId },
        },
        bookedSlots: 0,
        status: 'AVAILABLE',
      },
    });
  }

  // Get center slots
  async getCenterSlots(
    centerId: string,
    page: number,
    limit: number,
    donationType?: DonationType,
  ) {
    const skip = (page - 1) * limit;

    const where = {
      centerId,
      donationType: donationType ? { has: donationType } : ({} as any),
    };

    const [total, slots] = await Promise.all([
      this.prisma.donationSlot.count({ where }),
      this.prisma.donationSlot.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startTime: 'asc' },
      }),
    ]);

    return {
      slots,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
