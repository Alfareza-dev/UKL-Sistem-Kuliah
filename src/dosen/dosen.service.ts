import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDosenDto } from './dto/create-dosen.dto';
import { UpdateDosenDto } from './dto/update-dosen.dto';

@Injectable()
export class DosenService {
  constructor(private prisma: PrismaService) {}

  async create(createDosenDto: CreateDosenDto) {
    const { nidn, nama_dosen, jenis_kelamin, alamat } = createDosenDto;

    const dosen = await this.prisma.dosen.create({
      data: {
        nidn,
        nama_dosen,
        jenis_kelamin,
        alamat,
      },
    });

    return dosen;
  }

  findAll() {
    return this.prisma.dosen.findMany();
  }

  findOneByNidn(nidn: number) {
    return this.prisma.dosen.findUnique({
      where: { nidn },
    });
  }

  updateByNidn(nidn: number, updateDosenDto: UpdateDosenDto) {
    return this.prisma.dosen.update({
      where: { nidn },
      data: updateDosenDto,
    });
  }

  removeByNidn(nidn: number) {
    return this.prisma.dosen.delete({
      where: { nidn },
    });
  }
}
