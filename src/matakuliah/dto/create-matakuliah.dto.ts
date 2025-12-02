export class CreateMatakuliahDto {
  nama_matakuliah: string; // required
  id_dosen: number; // required, foreign key ke Dosen.id
  sks: number; // required, 1–6
}
