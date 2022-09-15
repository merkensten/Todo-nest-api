import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserDetails } from './interface/user-details.interface';
import { UserService } from './user.service';

// Om Jag vill, utveckla denna så att en admin kan hantera användare

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get()
  getHello(): string {
    return 'Hello';
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserDetails | null> {
    return this.userService.findById(id);
  }
}
