export class CreateMatakuliahDto {
  nama_matakuliah: string;
  id_dosen: number; // ini akan di-mapping ke dosen_nidn
  sks: number;
}
