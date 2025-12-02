import { Test, TestingModule } from '@nestjs/testing';
import { MatakuliahService } from './matakuliah.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MatakuliahService', () => {
  let service: MatakuliahService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatakuliahService,
        {
          provide: PrismaService,
          useValue: {}, // mock kosong, cukup untuk test "should be defined"
        },
      ],
    }).compile();

    service = module.get<MatakuliahService>(MatakuliahService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
