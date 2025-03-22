import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from '../dtos/sign-up.dto';
import { UsersRepository } from '../repositories/users.repository';
import { RoleEnum, UserDto } from '../repositories/dtos/users.dto';
import { SignInDto } from '../dtos/sign-in.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  @Inject()
  private usersRepo: UsersRepository;

  public signUp(body: SignUpDto) {
    const user = new UserDto(body.email, body.password, RoleEnum.DELIVERY);
    this.usersRepo.create(user);

    return { message: 'User created successfully: ' + JSON.stringify(user) };
  }

  public signIn(body: SignInDto): string {
    const user = this.usersRepo.findByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    } else if (user.email !== body.email || user.password !== body.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const secret = process.env.JWT_SECRET ?? 'secret';
    const expiresIn = Number.parseInt(process.env.JWT_EXPIRES_IN ?? '3600');

    const token = jwt.sign({ sub: user.id, role: user.role }, secret, {
      expiresIn,
    });
    return token;
  }
}
