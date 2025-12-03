import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { PenjadwalanService } from './penjadwalan.service';
import { CreatePenjadwalanDto } from './dto/create-penjadwalan.dto';
import { UpdatePenjadwalanDto } from './dto/update-penjadwalan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('penjadwalan')
export class PenjadwalanController {
  constructor(private readonly penjadwalanService: PenjadwalanService) {}

  @Post()
  async create(@Body() dto: CreatePenjadwalanDto) {
    const pj = await this.penjadwalanService.create(dto);

    return {
      status: 'success',
      message: 'Penjadwalan added successfully',
      data: {
        id: pj.id,
        id_dosen: pj.dosen_nidn,
        id_matakuliah: pj.matakuliah_id,
        jadwal: pj.jadwal,
      },
    };
  }

  @Get()
  async findAll() {
    const list = await this.penjadwalanService.findAll();

    return {
      status: 'success',
      message: 'Data penjadwalan retrieved successfully',
      data: list.map((pj) => ({
        id: pj.id,
        id_dosen: pj.dosen_nidn,
        id_matakuliah: pj.matakuliah_id,
        jadwal: pj.jadwal,
      })),
    };
  }

  @Get(':id')
  async findOne(@Param('id') idParam: string) {
    const id = parseInt(idParam, 10);
    const pj = await this.penjadwalanService.findOneById(id);

    if (!pj) {
      throw new NotFoundException({
        status: 'error',
        message: 'Penjadwalan not found',
      });
    }

    return {
      status: 'success',
      message: 'Penjadwalan retrieved successfully',
      data: {
        id: pj.id,
        id_dosen: pj.dosen_nidn,
        id_matakuliah: pj.matakuliah_id,
        jadwal: pj.jadwal,
      },
    };
  }

  @Put(':id')
  async update(
    @Param('id') idParam: string,
    @Body() dto: UpdatePenjadwalanDto,
  ) {
    const id = parseInt(idParam, 10);
    const pj = await this.penjadwalanService.updateById(id, dto);

    return {
      status: 'success',
      message: 'Penjadwalan updated successfully',
      data: {
        id: pj.id,
        id_dosen: pj.dosen_nidn,
        id_matakuliah: pj.matakuliah_id,
        jadwal: pj.jadwal,
      },
    };
  }

  @Delete(':id')
  async remove(@Param('id') idParam: string) {
    const id = parseInt(idParam, 10);
    await this.penjadwalanService.removeById(id);

    return {
      status: 'success',
      message: 'Penjadwalan deleted successfully',
    };
  }
}
