export class CreateMahasiswaDto {
  nim: string; // required
  nama_mahasiswa: string; // required
  jenis_kelamin: 'L' | 'P'; // 'L' atau 'P'
  jurusan: string; // required
}
