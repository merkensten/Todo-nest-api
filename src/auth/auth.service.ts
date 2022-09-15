import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { ExistingUserDto } from 'src/user/dtos/existing-user.dto';
import { NewUserDto } from 'src/user/dtos/new-user.dto';
import { UserDetails } from 'src/user/interface/user-details.interface';

import { UserService } from 'src/user/user.service';
import { LoginUserType } from './types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(user: Readonly<NewUserDto>): Promise<UserDetails> {
    const { password, username } = user;

    const existingUser = await this.userService.findByUsername(username);

    if (existingUser) {
      throw new HttpException('Username Taken', HttpStatus.BAD_REQUEST);
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

  async validateUser(username: string, password: string): Promise<UserDetails> {
    const user = await this.userService.findByUsername(username);
    const doesUserExist = !!user;

    if (!doesUserExist) {
      throw new HttpException(
        'Incorrect username or Password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordMatch = await this.doesPasswordMatch(password, user.password);

    if (!passwordMatch) {
      throw new HttpException(
        'Incorrect username or Password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userService._getUserDetails(user);
  }

  async login(
    existingUser: ExistingUserDto,
  ): Promise<{ token: string; id: string }> {
    const { username, password } = existingUser;
    const user: LoginUserType = await this.validateUser(username, password);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt, id: user.id };
  }
}
