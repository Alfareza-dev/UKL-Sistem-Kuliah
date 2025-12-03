import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import { UpdateMahasiswaDto } from './dto/update-mahasiswa.dto';
import { PilihMatakuliahDto } from './dto/pilih-matakuliah.dto';
import { LihatJadwalDto } from './dto/lihat-jadwal.dto';

@Injectable()
export class MahasiswaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMahasiswaDto) {
    const { nim, nama_mahasiswa, jenis_kelamin, jurusan } = dto;

    try {
      const mhs = await this.prisma.mahasiswa.create({
        data: {
          nim,
          nama_mahasiswa,
          jenis_kelamin,
          jurusan,
        },
      });

      return mhs;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException({
          status: 'error',
          message: `Mahasiswa dengan NIM ${nim} sudah ada`,
        });
      }

      throw new BadRequestException({
        status: 'error',
        message: 'Gagal menambah mahasiswa',
      });
    }
  }

  async findAll() {
    try {
      return await this.prisma.mahasiswa.findMany();
    } catch {
      throw new BadRequestException({
        status: 'error',
        message: 'Gagal mengambil data mahasiswa',
      });
    }
  }

  async findOneByNim(nim: string) {
    try {
      const mhs = await this.prisma.mahasiswa.findUnique({
        where: { nim },
      });
      return mhs;
    } catch {
      throw new BadRequestException({
        status: 'error',
        message: 'Gagal mengambil detail mahasiswa',
      });
    }
  }

  async updateByNim(nim: string, dto: UpdateMahasiswaDto) {
    try {
      const mhs = await this.prisma.mahasiswa.update({
        where: { nim },
        data: dto,
      });

      return mhs;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException({
          status: 'error',
          message: `Mahasiswa dengan NIM ${nim} tidak ditemukan`,
        });
      }

      throw new BadRequestException({
        status: 'error',
        message: 'Gagal mengupdate mahasiswa',
      });
    }
  }

  async removeByNim(nim: string) {
    try {
      await this.prisma.mahasiswa.delete({
        where: { nim },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException({
          status: 'error',
          message: `Mahasiswa dengan NIM ${nim} tidak ditemukan`,
        });
      }

      throw new BadRequestException({
        status: 'error',
        message: 'Gagal menghapus mahasiswa',
      });
    }
  }

  // ===================== FITUR MAHASISWA =====================

  // Mahasiswa memilih matakuliah
  async pilihMatakuliah(dto: PilihMatakuliahDto) {
    const { nim, matakuliah_ids } = dto;

    // 1. cek mahasiswa ada (by nim)
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { nim },
    });

    if (!mahasiswa) {
      throw new BadRequestException({
        status: 'error',
        message: `Mahasiswa dengan NIM ${nim} tidak ditemukan`,
      });
    }

    // pakai id internal untuk relasi KRS
    const mahasiswaId = mahasiswa.id;

    // 2. ambil data matakuliah
    const matakuliahList = await this.prisma.matakuliah.findMany({
      where: {
        id_matakuliah: { in: matakuliah_ids },
      },
    });

    if (matakuliahList.length !== matakuliah_ids.length) {
      throw new BadRequestException({
        status: 'error',
        message: 'Beberapa matakuliah tidak ditemukan',
      });
    }

    // 3. hitung total SKS
    const totalSKS = matakuliahList.reduce((sum, mk) => sum + mk.sks, 0);

    // validasi SKS
    if (totalSKS < 15) {
      return {
        status: 'error',
        message: 'Total sks kurang dari 15, silahkan tambah mata kuliah',
      };
    }

    if (totalSKS > 23) {
      return {
        status: 'error',
        message: 'Total sks lebih dari 23, silahkan kurangi mata kuliah',
      };
    }

    // 4. ambil jadwal dari tabel Penjadwalan
    const penjadwalanList = await this.prisma.penjadwalan.findMany({
      where: {
        matakuliah_id: { in: matakuliah_ids },
      },
    });

    const matkulYangTidakPunyaJadwal = matakuliah_ids.filter(
      (id) => !penjadwalanList.some((pj) => pj.matakuliah_id === id),
    );

    if (matkulYangTidakPunyaJadwal.length > 0) {
      throw new BadRequestException({
        status: 'error',
        message: 'Beberapa matakuliah belum memiliki jadwal',
      });
    }

    // 5. cek jadwal bentrok
    const seenJadwal = new Set<string>();
    for (const pj of penjadwalanList) {
      if (seenJadwal.has(pj.jadwal)) {
        return {
          status: 'error',
          message: 'jadwal bentrok',
        };
      }
      seenJadwal.add(pj.jadwal);
    }

    // 6. simpan KRS (hapus lama dulu)
    await this.prisma.krs.deleteMany({
      where: { mahasiswa_id: mahasiswaId },
    });

    await this.prisma.$transaction(
      matakuliah_ids.map((idMk) =>
        this.prisma.krs.create({
          data: {
            mahasiswa_id: mahasiswaId, // pakai id internal di DB
            matakuliah_id: idMk,
          },
        }),
      ),
    );

    return {
      status: 'success',
      message: 'Matakuliah berhasil dipilih',
      data: {
        nim,
        total_sks: totalSKS,
      },
    };
  }

  // Mahasiswa melihat jadwal
  async lihatJadwal(dto: LihatJadwalDto) {
    const { nim } = dto;

    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { nim },
    });

    if (!mahasiswa) {
      throw new BadRequestException({
        status: 'error',
        message: `Mahasiswa dengan NIM ${nim} tidak ditemukan`,
      });
    }

    const mahasiswaId = mahasiswa.id;

    // ambil KRS + relasi Matakuliah
    const krsList = await this.prisma.krs.findMany({
      where: { mahasiswa_id: mahasiswaId },
      include: {
        matakuliah: true,
      },
    });

    if (krsList.length === 0) {
      return {
        status: 'error',
        message: 'Belum ada mata kuliah terpilih / jadwal',
      };
    }

    const matakuliahIds = krsList.map((krs) => krs.matakuliah_id);

    const penjadwalanList = await this.prisma.penjadwalan.findMany({
      where: {
        matakuliah_id: { in: matakuliahIds },
      },
    });

    const jadwal = krsList.map((krs) => {
      const pj = penjadwalanList.find(
        (p) => p.matakuliah_id === krs.matakuliah_id,
      );

      return {
        id_matakuliah: krs.matakuliah_id,
        nama_matakuliah: krs.matakuliah.nama_matakuliah,
        jadwal: pj ? pj.jadwal : null,
      };
    });

    return {
      status: 'success',
      message: 'Jadwal berhasil diambil',
      data: {
        nim,
        jadwal,
      },
    };
  }
}
