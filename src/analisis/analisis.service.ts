import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TopAnalisisDto } from './dto/top-analisis.dto';

@Injectable()
export class AnalisisService {
  constructor(private prisma: PrismaService) {}

  async topMatakuliahDosen(dto: TopAnalisisDto) {
    const { tahun_ajaran, semester, limit = 10 } = dto;

    const penjadwalanList = await this.prisma.penjadwalan.findMany({
      where: {
        tahun_ajaran,
        semester,
      },
    });

    if (penjadwalanList.length === 0) {
      return {
        status: 'success',
        message: 'Tidak ada data penjadwalan untuk filter tersebut',
        data: {
          top_matakuliah: [],
          top_dosen: [],
        },
      };
    }

    const matkulIds = [
      ...new Set(penjadwalanList.map((pj) => pj.matakuliah_id)),
    ];

    const krsList = await this.prisma.krs.findMany({
      where: {
        matakuliah_id: {
          in: matkulIds,
        },
      },
      include: {
        matakuliah: true,
      },
    });

    if (krsList.length === 0) {
      return {
        status: 'success',
        message: 'Belum ada pengambilan matakuliah untuk filter tersebut',
        data: {
          top_matakuliah: [],
          top_dosen: [],
        },
      };
    }

    const dosenIds = [...new Set(penjadwalanList.map((pj) => pj.dosen_nidn))];

    const dosenList = await this.prisma.dosen.findMany({
      where: {
        nidn: {
          in: dosenIds,
        },
      },
    });

    const dosenMap = new Map<number, { nidn: number; nama_dosen: string }>();
    dosenList.forEach((d) => {
      dosenMap.set(d.nidn, { nidn: d.nidn, nama_dosen: d.nama_dosen });
    });

    const matkulToDosenMap = new Map<number, number>();
    penjadwalanList.forEach((pj) => {
      matkulToDosenMap.set(pj.matakuliah_id, pj.dosen_nidn);
    });

    type MatkulAgg = {
      id_matakuliah: number;
      nama_matakuliah: string;
      id_dosen: number | null;
      nama_dosen: string | null;
      total_mahasiswa_memilih: number;
      total_sks_diambil: number;
      sks: number;
    };

    const matkulAggMap = new Map<number, MatkulAgg>();

    for (const krs of krsList) {
      const mk = krs.matakuliah;
      const mkId = mk.id_matakuliah;

      const existing = matkulAggMap.get(mkId);
      if (!existing) {
        const dosenId = matkulToDosenMap.get(mkId) ?? null;
        const dosenData = dosenId ? dosenMap.get(dosenId) : null;

        matkulAggMap.set(mkId, {
          id_matakuliah: mkId,
          nama_matakuliah: mk.nama_matakuliah,
          id_dosen: dosenId,
          nama_dosen: dosenData ? dosenData.nama_dosen : null,
          total_mahasiswa_memilih: 1,
          total_sks_diambil: mk.sks,
          sks: mk.sks,
        });
      } else {
        existing.total_mahasiswa_memilih += 1;
        existing.total_sks_diambil += existing.sks;
      }
    }

    const topMatakuliah = Array.from(matkulAggMap.values())
      .sort(
        (a, b) =>
          b.total_mahasiswa_memilih - a.total_mahasiswa_memilih ||
          b.total_sks_diambil - a.total_sks_diambil,
      )
      .slice(limit)
      .slice(0, limit);

    type DosenAgg = {
      id_dosen: number;
      nama_dosen: string | null;
      total_mahasiswa_memilih: number;
      total_matakuliah_diampu: number;
      total_pengambilan_matakuliah: number;
    };

    const dosenMahasiswaSetMap = new Map<number, Set<number>>();
    const dosenMatkulSetMap = new Map<number, Set<number>>();
    const dosenPengambilanMap = new Map<number, number>();

    for (const krs of krsList) {
      const mk = krs.matakuliah;
      const mkId = mk.id_matakuliah;
      const mahasiswaId = krs.mahasiswa_id;

      const dosenId = matkulToDosenMap.get(mkId);
      if (!dosenId) continue;

      if (!dosenMahasiswaSetMap.has(dosenId)) {
        dosenMahasiswaSetMap.set(dosenId, new Set());
      }
      dosenMahasiswaSetMap.get(dosenId)!.add(mahasiswaId);

      if (!dosenMatkulSetMap.has(dosenId)) {
        dosenMatkulSetMap.set(dosenId, new Set());
      }
      dosenMatkulSetMap.get(dosenId)!.add(mkId);

      dosenPengambilanMap.set(
        dosenId,
        (dosenPengambilanMap.get(dosenId) ?? 0) + 1,
      );
    }

    const dosenAggList: DosenAgg[] = [];

    for (const [dosenId, mahasiswaSet] of dosenMahasiswaSetMap.entries()) {
      const matkulSet = dosenMatkulSetMap.get(dosenId) ?? new Set();
      const totalPengambilan = dosenPengambilanMap.get(dosenId) ?? 0;
      const dosenData = dosenMap.get(dosenId);

      dosenAggList.push({
        id_dosen: dosenId,
        nama_dosen: dosenData ? dosenData.nama_dosen : null,
        total_mahasiswa_memilih: mahasiswaSet.size,
        total_matakuliah_diampu: matkulSet.size,
        total_pengambilan_matakuliah: totalPengambilan,
      });
    }

    const topDosen = dosenAggList
      .sort(
        (a, b) =>
          b.total_pengambilan_matakuliah - a.total_pengambilan_matakuliah ||
          b.total_mahasiswa_memilih - a.total_mahasiswa_memilih,
      )
      .slice(0, limit);

    return {
      status: 'success',
      message: 'Analisis berhasil diambil',
      data: {
        top_matakuliah: topMatakuliah.map((mk) => ({
          id_matakuliah: mk.id_matakuliah,
          nama_matakuliah: mk.nama_matakuliah,
          id_dosen: mk.id_dosen,
          nama_dosen: mk.nama_dosen,
          total_mahasiswa_memilih: mk.total_mahasiswa_memilih,
          total_sks_diambil: mk.total_sks_diambil,
        })),
        top_dosen: topDosen,
      },
    };
  }
}
