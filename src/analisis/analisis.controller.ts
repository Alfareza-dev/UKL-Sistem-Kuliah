import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AnalisisService } from './analisis.service';
import { TopAnalisisDto } from './dto/top-analisis.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analisis')
export class AnalisisController {
  constructor(private readonly analisisService: AnalisisService) {}

  @Post('top-matakuliah-dosen')
  @Roles('ADMIN')
  async topMatakuliahDosen(@Body() dto: TopAnalisisDto) {
    return this.analisisService.topMatakuliahDosen(dto);
  }
}
