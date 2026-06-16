import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateProfileDto, SelectUniversityDto } from './dto/update-profile.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('profile')
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Patch('university')
  selectUniversity(@Request() req: any, @Body() dto: SelectUniversityDto) {
    return this.usersService.selectUniversity(req.user.userId, dto.universityId);
  }

  @Delete('account')
  deleteAccount(@Request() req: any) {
    return this.usersService.deleteAccount(req.user.userId);
  }
}