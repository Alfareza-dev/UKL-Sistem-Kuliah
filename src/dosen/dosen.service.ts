import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDosenDto } from './dto/create-dosen.dto';
import { UpdateDosenDto } from './dto/update-dosen.dto';

@Injectable()
export class DosenService {
  constructor(private prisma: PrismaService) {}

  async create(createDosenDto: CreateDosenDto) {
    try {
      const { nidn, nama_dosen, jenis_kelamin, alamat } = createDosenDto;

      const dosen = await this.prisma.dosen.create({
        data: { nidn, nama_dosen, jenis_kelamin, alamat },
      });

      return dosen;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException({
          status: 'error',
          message: `Dosen dengan NIDN ${createDosenDto.nidn} sudah ada`,
        });
      }

      throw new BadRequestException({
        status: 'error',
        message: 'Gagal menambah dosen',
      });
    }
  }

  async findAll() {
    try {
      return await this.prisma.dosen.findMany();
    } catch (error) {
      throw new BadRequestException({
        status: 'error',
        message: 'Gagal mengambil data dosen',
      });
    }
  }

  async findOneByNidn(nidn: number) {
    try {
      const dosen = await this.prisma.dosen.findUnique({
        where: { nidn },
      });

      return dosen;
    } catch (error) {
      throw new BadRequestException({
        status: 'error',
        message: 'Gagal mengambil detail dosen',
      });
    }
  }

  async updateByNidn(nidn: number, updateDosenDto: UpdateDosenDto) {
    try {
      const dosen = await this.prisma.dosen.update({
        where: { nidn },
        data: updateDosenDto,
      });

      return dosen;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException({
          status: 'error',
          message: `Dosen dengan NIDN ${nidn} tidak ditemukan`,
        });
      }

      throw new BadRequestException({
        status: 'error',
        message: 'Gagal mengupdate dosen',
      });
    }
  }

  async removeByNidn(nidn: number) {
    try {
      return await this.prisma.dosen.delete({
        where: { nidn },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException({
          status: 'error',
          message: `Dosen dengan NIDN ${nidn} tidak ditemukan`,
        });
      }

      throw new BadRequestException({
        status: 'error',
        message: 'Gagal menghapus dosen',
      });
    }
  }
}
