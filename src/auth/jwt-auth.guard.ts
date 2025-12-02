import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader =
      request.headers['authorization'] || request.headers['Authorization'];

    if (!authHeader || Array.isArray(authHeader)) {
      throw new UnauthorizedException('Token tidak ditemukan');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Format token tidak valid');
    }

    try {
      // ❗ tidak perlu pass secret lagi di sini
      const payload = await this.jwtService.verifyAsync(token);

      // simpan ke request.user
      request.user = payload;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Token tidak valid atau kadaluarsa');
    }
  }
}
