import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePenjadwalanDto } from './dto/create-penjadwalan.dto';
import { UpdatePenjadwalanDto } from './dto/update-penjadwalan.dto';

@Injectable()
export class PenjadwalanService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePenjadwalanDto) {
    const { id_dosen, id_matakuliah, jadwal, tahun_ajaran, semester } = dto;

    try {
      const pj = await this.prisma.penjadwalan.create({
        data: {
          dosen_nidn: id_dosen, // mapping ke FK nidn
          matakuliah_id: id_matakuliah, // mapping ke FK id_matakuliah
          jadwal,
          tahun_ajaran: tahun_ajaran ?? '2025/2026',
          semester: semester ?? 1,
        },
      });

      return pj;
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException({
          status: 'error',
          message:
            'Dosen atau Matakuliah tidak ditemukan. Periksa kembali id_dosen dan id_matakuliah',
        });
      }

      throw new BadRequestException({
        status: 'error',
        message: 'Gagal menambah penjadwalan',
      });
    }
  }

  async findAll() {
    try {
      return await this.prisma.penjadwalan.findMany();
    } catch {
      throw new BadRequestException({
        status: 'error',
        message: 'Gagal mengambil data penjadwalan',
      });
    }
  }

  async findOneById(id: number) {
    try {
      return await this.prisma.penjadwalan.findUnique({
        where: { id },
      });
    } catch {
      throw new BadRequestException({
        status: 'error',
        message: 'Gagal mengambil detail penjadwalan',
      });
    }
  }

  async updateById(id: number, dto: UpdatePenjadwalanDto) {
    const { id_dosen, id_matakuliah, jadwal, tahun_ajaran, semester } = dto;

    try {
      return await this.prisma.penjadwalan.update({
        where: { id },
        data: {
          dosen_nidn: id_dosen,
          matakuliah_id: id_matakuliah,
          jadwal,
          tahun_ajaran,
          semester,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException({
          status: 'error',
          message: `Penjadwalan dengan id ${id} tidak ditemukan`,
        });
      }

      if (error.code === 'P2003') {
        throw new BadRequestException({
          status: 'error',
          message:
            'Dosen atau Matakuliah tidak ditemukan. Periksa kembali id_dosen dan id_matakuliah',
        });
      }

      throw new BadRequestException({
        status: 'error',
        message: 'Gagal mengupdate penjadwalan',
      });
    }
  }

  async removeById(id: number) {
    try {
      await this.prisma.penjadwalan.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException({
          status: 'error',
          message: `Penjadwalan dengan id ${id} tidak ditemukan`,
        });
      }

      throw new BadRequestException({
        status: 'error',
        message: 'Gagal menghapus penjadwalan',
      });
    }
  }
}
