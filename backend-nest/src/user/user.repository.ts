import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class UserRepository {
  private readonly users = [
    { username: 'user1', password: 'user1' },
    { username: 'user2', password: 'user2' },
  ];

  async validateUser(loginUserDto: LoginUserDto): Promise<boolean> {
    const user = this.users.find(
      (user) =>
        user.username === loginUserDto.username &&
        user.password === loginUserDto.password,
    );
    return !!user;
  }
}
