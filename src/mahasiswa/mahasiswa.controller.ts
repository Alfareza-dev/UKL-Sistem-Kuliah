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
import { MahasiswaService } from './mahasiswa.service';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import { UpdateMahasiswaDto } from './dto/update-mahasiswa.dto';
import { PilihMatakuliahDto } from './dto/pilih-matakuliah.dto';
import { LihatJadwalDto } from './dto/lihat-jadwal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('mahasiswa')
export class MahasiswaController {
  constructor(private readonly mahasiswaService: MahasiswaService) {}

  @Post()
  @Roles('ADMIN')
  async create(@Body() dto: CreateMahasiswaDto) {
    const mhs = await this.mahasiswaService.create(dto);

    return {
      status: 'success',
      message: 'Mahasiswa added successfully',
      nim: mhs.nim,
      data: {
        nama_mahasiswa: mhs.nama_mahasiswa,
        jenis_kelamin: mhs.jenis_kelamin,
        jurusan: mhs.jurusan,
      },
    };
  }

  @Get()
  @Roles('ADMIN')
  async findAll() {
    const list = await this.mahasiswaService.findAll();

    return {
      status: 'success',
      message: 'Data mahasiswa retrieved successfully',
      data: list.map((mhs) => ({
        nim: mhs.nim,
        nama_mahasiswa: mhs.nama_mahasiswa,
        jenis_kelamin: mhs.jenis_kelamin,
        jurusan: mhs.jurusan,
      })),
    };
  }

  @Get(':nim')
  @Roles('ADMIN')
  async findOne(@Param('nim') nim: string) {
    const mhs = await this.mahasiswaService.findOneByNim(nim);

    if (!mhs) {
      throw new NotFoundException({
        status: 'error',
        message: 'Mahasiswa not found',
      });
    }

    return {
      status: 'success',
      message: 'Mahasiswa retrieved successfully',
      nim: mhs.nim,
      data: {
        nama_mahasiswa: mhs.nama_mahasiswa,
        jenis_kelamin: mhs.jenis_kelamin,
        jurusan: mhs.jurusan,
      },
    };
  }

  @Put(':nim')
  @Roles('ADMIN')
  async update(@Param('nim') nim: string, @Body() dto: UpdateMahasiswaDto) {
    const mhs = await this.mahasiswaService.updateByNim(nim, dto);

    return {
      status: 'success',
      message: 'Mahasiswa updated successfully',
      nim: mhs.nim,
      data: {
        nama_mahasiswa: mhs.nama_mahasiswa,
        jenis_kelamin: mhs.jenis_kelamin,
        jurusan: mhs.jurusan,
      },
    };
  }

  @Delete(':nim')
  @Roles('ADMIN')
  async remove(@Param('nim') nim: string) {
    await this.mahasiswaService.removeByNim(nim);

    return {
      status: 'success',
      message: 'Mahasiswa deleted successfully',
    };
  }

  @Post('pilih-matakuliah')
  @Roles('MAHASISWA')
  async pilihMatakuliah(@Body() dto: PilihMatakuliahDto) {
    return this.mahasiswaService.pilihMatakuliah(dto);
  }

  @Post('jadwal')
  @Roles('MAHASISWA')
  async lihatJadwal(@Body() dto: LihatJadwalDto) {
    return this.mahasiswaService.lihatJadwal(dto);
  }
}
