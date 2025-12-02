import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DosenService } from './dosen.service';
import { CreateDosenDto } from './dto/create-dosen.dto';
import { UpdateDosenDto } from './dto/update-dosen.dto';

@Controller('dosen')
export class DosenController {
  constructor(private readonly dosenService: DosenService) {}

  @Post()
  async create(@Body() createDosenDto: CreateDosenDto) {
    const dosen = await this.dosenService.create(createDosenDto);
    return {
      status: 'success',
      message: 'Dosen added successfully',
      data: dosen,
    };
  }

  @Get()
  async findAll() {
    const dosen = await this.dosenService.findAll();
    return {
      status: 'success',
      message: 'Data dosen retrieved successfully',
      data: dosen,
    };
  }

  @Get(':nidn')
  async findOne(@Param('nidn') nidnParam: string) {
    const nidn = parseInt(nidnParam, 10);
    const dosen = await this.dosenService.findOneByNidn(nidn);
    return {
      status: 'success',
      message: 'Dosen retrieved successfully',
      data: dosen,
    };
  }

  @Put(':nidn')
  async update(
    @Param('nidn') nidnParam: string,
    @Body() updateDosenDto: UpdateDosenDto,
  ) {
    const nidn = parseInt(nidnParam, 10);
    const dosen = await this.dosenService.updateByNidn(nidn, updateDosenDto);
    return {
      status: 'success',
      message: 'Dosen updated successfully',
      data: dosen,
    };
  }

  @Delete(':nidn')
  async remove(@Param('nidn') nidnParam: string) {
    const nidn = parseInt(nidnParam, 10);
    await this.dosenService.removeByNidn(nidn);
    return {
      status: 'success',
      message: 'Dosen deleted successfully',
    };
  }
}
