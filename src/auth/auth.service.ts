import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return null;
    }

    const payload = {
      sub: user.id,
      role: user.role,
      mahasiswaId: user.mahasiswaId ?? null,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      role: user.role,
    };
  }
}
