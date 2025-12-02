import { Module } from '@nestjs/common';
import { DosenService } from './dosen.service';
import { DosenController } from './dosen.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DosenController],
  providers: [DosenService],
})
export class DosenModule {}
