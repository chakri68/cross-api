import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto, SignInUserDto } from './users.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('users') // Group this controller's endpoints under the 'users' tag in Swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Post('signin')
  @ApiOperation({ summary: 'Authenticate a user and generate a token' })
  @ApiResponse({ status: 200, description: 'User successfully authenticated' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signin(@Body() signInDto: SignInUserDto, @Res() res: Response) {
    const { access_token, user } = await this.usersService.signIn(signInDto);
    res
      .cookie('jwt', access_token, {
        httpOnly: true, // Prevents JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Helps prevent CSRF attacks
      })
      .json({ message: 'Sign-in successful', user });
  }

  @Post(':userId/assign-center/:centerId')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth() // Indicates this endpoint requires JWT authentication
  @ApiOperation({
    summary: 'Assign a user as a manager to a donation center',
  })
  @ApiResponse({
    status: 200,
    description: 'Center manager successfully assigned',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'User or center not found' })
  async assignCenterManager(
    @Param('userId') userId: string,
    @Param('centerId') centerId: string,
  ) {
    return this.usersService.assignCenterManager(userId, centerId);
  }

  @Patch(':userId/promote-to-admin')
  @UseGuards(RolesGuard)
  @ApiBearerAuth() // Requires JWT authentication
  @ApiOperation({ summary: 'Promote a user to admin role' })
  @ApiResponse({
    status: 200,
    description: 'User successfully promoted to admin',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async promoteToAdmin(@Param('userId') userId: string) {
    return this.usersService.updateUserRole(userId, UserRole.ADMIN);
  }
}
