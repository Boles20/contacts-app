import {
  Injectable,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  private users = [
    { username: 'user1', password: 'user1' },
    { username: 'user2', password: 'user2' },
  ];

  constructor(private readonly jwtService: JwtService) {}

  async onModuleInit() {
    this.users = await Promise.all(
      this.users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.username, 10),
      })),
    );
  }

  async login(loginDto: LoginUserDto): Promise<string> {
    const user = this.users.find((u) => u.username === loginDto.username);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username };
    return this.jwtService.sign(payload);
  }
}
