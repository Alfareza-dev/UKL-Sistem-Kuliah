import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatakuliahDto } from './dto/create-matakuliah.dto';
import { UpdateMatakuliahDto } from './dto/update-matakuliah.dto';

@Injectable()
export class MatakuliahService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMatakuliahDto) {
    const { nama_matakuliah, id_dosen, sks } = dto;

    if (sks < 1 || sks > 6) {
      throw new BadRequestException({
        status: 'error',
        message: 'SKS harus antara 1 sampai 6',
      });
    }

    try {
      const mk = await this.prisma.matakuliah.create({
        data: {
          nama_matakuliah,
          id_dosen,
          sks,
        },
      });

      return mk;
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException({
          status: 'error',
          message: `Dosen dengan id ${id_dosen} tidak ditemukan`,
        });
      }

      throw new BadRequestException({
        status: 'error',
        message: 'Gagal menambah matakuliah',
      });
    }
  }

  async findAll() {
    try {
      return await this.prisma.matakuliah.findMany();
    } catch {
      throw new BadRequestException({
        status: 'error',
        message: 'Gagal mengambil data matakuliah',
      });
    }
  }

  async findOneById(id_matakuliah: number) {
    try {
      const mk = await this.prisma.matakuliah.findUnique({
        where: { id_matakuliah },
      });
      return mk;
    } catch {
      throw new BadRequestException({
        status: 'error',
        message: 'Gagal mengambil detail matakuliah',
      });
    }
  }

  async updateById(id_matakuliah: number, dto: UpdateMatakuliahDto) {
    if (dto.sks !== undefined && (dto.sks < 1 || dto.sks > 6)) {
      throw new BadRequestException({
        status: 'error',
        message: 'SKS harus antara 1 sampai 6',
      });
    }

    try {
      const mk = await this.prisma.matakuliah.update({
        where: { id_matakuliah },
        data: dto,
      });
      return mk;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException({
          status: 'error',
          message: `Matakuliah dengan id ${id_matakuliah} tidak ditemukan`,
        });
      }

      if (error.code === 'P2003') {
        throw new BadRequestException({
          status: 'error',
          message: `Dosen dengan id ${dto.id_dosen} tidak ditemukan`,
        });
      }

      throw new BadRequestException({
        status: 'error',
        message: 'Gagal mengupdate matakuliah',
      });
    }
  }

  async removeById(id_matakuliah: number) {
    try {
      await this.prisma.matakuliah.delete({
        where: { id_matakuliah },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException({
          status: 'error',
          message: `Matakuliah dengan id ${id_matakuliah} tidak ditemukan`,
        });
      }

      throw new BadRequestException({
        status: 'error',
        message: 'Gagal menghapus matakuliah',
      });
    }
  }
}
