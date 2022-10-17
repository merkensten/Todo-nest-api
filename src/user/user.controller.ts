import { Controller, Get, Param, UseGuards, Put, Delete } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserDetails } from './interface/user-details.interface';
import { UserService } from './user.service';

// Endpoints
// Get: all users
// Get: user by id
// Post: create user
// Put: update user
// Delete: delete user

// Skapa en guard för att kolla att admin har userLevel 1

// Fixa sedan types för allt

@Controller('/user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): Promise<UserDetails> | string {
    return 'Hello';
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserDetails | null> {
    return this.userService.findById(id);
  }

  @Put(':id')
  getPut(@Param('id') id: string): any {
    return 'Hello' + id;
  }

  @Delete(':id')
  getDelete(@Param('id') id: string): any {
    return 'Hello' + id;
  }
}
