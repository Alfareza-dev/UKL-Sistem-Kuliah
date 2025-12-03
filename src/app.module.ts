import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DosenModule } from './dosen/dosen.module';
import { MatakuliahModule } from './matakuliah/matakuliah.module';
import { MahasiswaModule } from './mahasiswa/mahasiswa.module';
import { PenjadwalanModule } from './penjadwalan/penjadwalan.module';
import { AnalisisModule } from './analisis/analisis.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DosenModule,
    MatakuliahModule,
    MahasiswaModule,
    PenjadwalanModule,
    AnalisisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
