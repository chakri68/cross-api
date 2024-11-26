import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  DefaultValuePipe,
  ParseFloatPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, DonationType } from '@prisma/client';
import { DonationCentersService } from './donation-centers.service';
import {
  CreateDonationCenterDto,
  CreateDonationSlotDto,
  UpdateDonationCenterDto,
} from './donation-centers.dto';

@ApiTags('donation-centers') // Tag for grouping endpoints
@Controller('donation-centers')
export class DonationCentersController {
  constructor(
    private readonly donationCentersService: DonationCentersService,
  ) {}

  /**
   * Create a new donation center.
   *
   * Requires admin or center manager role.
   *
   * @param req - The request object containing the user's information.
   * @param createCenterDto - Data transfer object containing the center details.
   * @returns The created donation center.
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CENTER_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new donation center' })
  @ApiResponse({ status: 201, description: 'Center created successfully' })
  async createCenter(
    @Req() req,
    @Body() createCenterDto: CreateDonationCenterDto,
  ) {
    return this.donationCentersService.createCenter(
      req.user.id,
      createCenterDto,
    );
  }

  /**
   * Retrieve all donation centers with optional pagination and filtering.
   *
   * @param page - The page number for pagination (default: 1).
   * @param limit - The number of records per page (default: 10).
   * @param donationType - Optional filter by donation type.
   * @returns A paginated list of donation centers.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve donation centers' })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10 })
  @ApiQuery({ name: 'donationType', required: false, enum: DonationType })
  async findAllCenters(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('donationType') donationType?: DonationType,
  ) {
    return this.donationCentersService.findAllCenters(
      page,
      limit,
      donationType,
    );
  }

  /**
   * Find nearby donation centers based on user's location and radius.
   *
   * @param req - The request object containing the user's ID.
   * @param latitude - Latitude of the user's location.
   * @param longitude - Longitude of the user's location.
   * @param radius - Radius to search within (default: 50 km).
   * @returns A list of nearby donation centers.
   */
  @Get('/nearby')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find nearby donation centers' })
  @ApiQuery({ name: 'radius', required: false, type: Number })
  async findNearbyCenters(
    @Req() req,
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('radius', new DefaultValuePipe(50)) radius: number,
  ) {
    return this.donationCentersService.findNearbyCenters(
      req.user.id,
      latitude,
      longitude,
      radius,
    );
  }

  /**
   * Retrieve details of a specific donation center by its ID.
   *
   * @param centerId - The ID of the donation center.
   * @returns The details of the donation center.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get donation center details' })
  async getCenterById(@Param('id') centerId: string) {
    return this.donationCentersService.getCenterById(centerId);
  }

  /**
   * Update the details of a donation center.
   *
   * Requires admin or center manager role.
   *
   * @param req - The request object containing the user's information.
   * @param centerId - The ID of the donation center to update.
   * @param updateCenterDto - Data transfer object containing updated center details.
   * @returns The updated donation center details.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CENTER_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update donation center details' })
  async updateCenter(
    @Req() req,
    @Param('id') centerId: string,
    @Body() updateCenterDto: UpdateDonationCenterDto,
  ) {
    return this.donationCentersService.updateCenter(
      req.user.id,
      centerId,
      updateCenterDto,
    );
  }

  /**
   * Delete a donation center.
   *
   * Requires admin role.
   *
   * @param req - The request object containing the user's information.
   * @param centerId - The ID of the donation center to delete.
   * @returns A success message on deletion.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a donation center' })
  async deleteCenter(@Req() req, @Param('id') centerId: string) {
    return this.donationCentersService.deleteCenter(req.user.id, centerId);
  }

  /**
   * Create a new donation slot for a specific donation center.
   *
   * Requires admin or center manager role.
   *
   * @param req - The request object containing the user's information.
   * @param centerId - The ID of the donation center.
   * @param createSlotDto - Data transfer object for the slot details.
   * @returns The created donation slot.
   */
  @Post(':id/slots')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CENTER_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a donation slot for a center' })
  async createDonationSlot(
    @Req() req,
    @Param('id') centerId: string,
    @Body() createSlotDto: CreateDonationSlotDto,
  ) {
    return this.donationCentersService.createDonationSlot(
      req.user.id,
      centerId,
      createSlotDto,
    );
  }

  /**
   * Get all donation slots for a specific center with optional pagination and filtering.
   *
   * @param centerId - The ID of the donation center.
   * @param page - The page number for pagination (default: 1).
   * @param limit - The number of records per page (default: 10).
   * @param donationType - Optional filter by donation type.
   * @returns A paginated list of donation slots.
   */
  @Get(':id/slots')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all slots for a donation center' })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10 })
  @ApiQuery({ name: 'donationType', required: false, enum: DonationType })
  async getCenterSlots(
    @Param('id') centerId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('donationType') donationType?: DonationType,
  ) {
    return this.donationCentersService.getCenterSlots(
      centerId,
      page,
      limit,
      donationType,
    );
  }
}
