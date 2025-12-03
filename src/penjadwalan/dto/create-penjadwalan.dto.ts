export class CreatePenjadwalanDto {
  id_dosen: number; // → akan di-mapping ke dosen_nidn
  id_matakuliah: number; // → akan di-mapping ke matakuliah_id
  jadwal: string;
  tahun_ajaran?: string; // optional, kita kasih default di service
  semester?: number; // optional, default di service
}
