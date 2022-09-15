import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ExistingUserDto } from 'src/user/dtos/existing-user.dto';
import { NewUserDto } from 'src/user/dtos/new-user.dto';
import { UserDetails } from 'src/user/interface/user-details.interface';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(
    user: Readonly<NewUserDto>,
  ): Promise<UserDetails | null | string> {
    const { password, username } = user;

    const existingUser = await this.userService.findByUsername(username);

    if (existingUser) {
      return 'Username taken';
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.create(username, hashedPassword);
    return this.userService._getUserDetails(newUser);
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findByUsername(username);
    const doesUserExist = !!user;

    if (!doesUserExist) {
      return null;
    }

    const passwordMatch = await this.doesPasswordMatch(password, user.password);

    if (!passwordMatch) {
      return null;
    }

    return this.userService._getUserDetails(user);
  }

  async login(
    existingUser: ExistingUserDto,
  ): Promise<{ token: string; username: string } | null> {
    const { username, password } = existingUser;
    const user = await this.validateUser(username, password);

    if (!user) return null;

    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt, username };
  }
}
