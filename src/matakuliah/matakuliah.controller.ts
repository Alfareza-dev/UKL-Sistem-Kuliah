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
import { MatakuliahService } from './matakuliah.service';
import { CreateMatakuliahDto } from './dto/create-matakuliah.dto';
import { UpdateMatakuliahDto } from './dto/update-matakuliah.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('matakuliah')
export class MatakuliahController {
  constructor(private readonly matakuliahService: MatakuliahService) {}

  @Post()
  async create(@Body() dto: CreateMatakuliahDto) {
    const mk = await this.matakuliahService.create(dto);

    return {
      status: 'success',
      message: 'Matakuliah added successfully',
      data: {
        id_matakuliah: mk.id_matakuliah,
        nama_matakuliah: mk.nama_matakuliah,
        id_dosen: mk.dosen_nidn,
        sks: mk.sks,
      },
    };
  }

  @Get()
  async findAll() {
    const list = await this.matakuliahService.findAll();

    return {
      status: 'success',
      message: 'Data matakuliah retrieved successfully',
      data: list.map((mk) => ({
        id_matakuliah: mk.id_matakuliah,
        nama_matakuliah: mk.nama_matakuliah,
        id_dosen: mk.dosen_nidn,
        sks: mk.sks,
      })),
    };
  }

  @Get(':id_matakuliah')
  async findOne(@Param('id_matakuliah') idParam: string) {
    const id = parseInt(idParam, 10);
    const mk = await this.matakuliahService.findOneById(id);

    if (!mk) {
      throw new NotFoundException({
        status: 'error',
        message: 'Matakuliah not found',
      });
    }

    return {
      status: 'success',
      message: 'Matakuliah retrieved successfully',
      data: {
        id_matakuliah: mk.id_matakuliah,
        nama_matakuliah: mk.nama_matakuliah,
        id_dosen: mk.dosen_nidn,
        sks: mk.sks,
      },
    };
  }

  @Put(':id_matakuliah')
  async update(
    @Param('id_matakuliah') idParam: string,
    @Body() dto: UpdateMatakuliahDto,
  ) {
    const id = parseInt(idParam, 10);
    const mk = await this.matakuliahService.updateById(id, dto);

    return {
      status: 'success',
      message: 'Matakuliah updated successfully',
      data: {
        id_matakuliah: mk.id_matakuliah,
        nama_matakuliah: mk.nama_matakuliah,
        id_dosen: mk.dosen_nidn,
        sks: mk.sks,
      },
    };
  }

  @Delete(':id_matakuliah')
  async remove(@Param('id_matakuliah') idParam: string) {
    const id = parseInt(idParam, 10);
    await this.matakuliahService.removeById(id);

    return {
      status: 'success',
      message: 'Matakuliah deleted successfully',
    };
  }
}
