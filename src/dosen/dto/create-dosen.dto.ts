export class CreateDosenDto {
  nidn: number; // int
  nama_dosen: string; // string
  jenis_kelamin: 'L' | 'P'; // 'L' atau 'P'
  alamat: string; // string
}
