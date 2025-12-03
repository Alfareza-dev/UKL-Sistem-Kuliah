import { PartialType } from '@nestjs/mapped-types';
import { CreatePenjadwalanDto } from './create-penjadwalan.dto';

export class UpdatePenjadwalanDto extends PartialType(CreatePenjadwalanDto) {}
