import { PartialType } from '@nestjs/mapped-types';
import { CreateMatakuliahDto } from './create-matakuliah.dto';

export class UpdateMatakuliahDto extends PartialType(CreateMatakuliahDto) {}
