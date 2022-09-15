import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { NewUserDto } from 'src/user/dtos/new-user.dto';
import { ExistingUserDto } from 'src/user/dtos/existing-user.dto';
import { UserDetails } from 'src/user/interface/user-details.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  getHello(): string {
    return 'Hello';
  }

  @Post('register')
  register(@Body() user: NewUserDto): Promise<UserDetails | null | string> {
    return this.authService.register(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: ExistingUserDto): Promise<{ token: string }> {
    return this.authService.login(user);
  }
}
