import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { DosenModule } from './dosen/dosen.module';

@Module({
  imports: [PrismaModule, DosenModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
