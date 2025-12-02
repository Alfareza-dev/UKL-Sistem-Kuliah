import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { DosenModule } from './dosen/dosen.module';
import { AuthModule } from './auth/auth.module';
import { MatakuliahModule } from './matakuliah/matakuliah.module';

@Module({
  imports: [PrismaModule, AuthModule, DosenModule, MatakuliahModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
