import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { DosenModule } from './dosen/dosen.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, DosenModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
