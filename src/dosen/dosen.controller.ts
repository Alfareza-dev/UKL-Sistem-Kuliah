import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { DosenService } from './dosen.service';
import { CreateDosenDto } from './dto/create-dosen.dto';
import { UpdateDosenDto } from './dto/update-dosen.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('dosen')
export class DosenController {
  constructor(private readonly dosenService: DosenService) {}
  @Post()
  async create(@Body() createDosenDto: CreateDosenDto) {
    const dosen = await this.dosenService.create(createDosenDto);
    return {
      status: 'success',
      message: 'Dosen added successfully',
      data: {
        nidn: dosen.nidn,
        nama_dosen: dosen.nama_dosen,
        jenis_kelamin: dosen.jenis_kelamin,
        alamat: dosen.alamat,
      },
    };
  }

  @Get()
  async findAll() {
    const list = await this.dosenService.findAll();
    return {
      status: 'success',
      message: 'Data dosen retrieved successfully',
      data: list.map((d) => ({
        nidn: d.nidn,
        nama_dosen: d.nama_dosen,
        jenis_kelamin: d.jenis_kelamin,
        alamat: d.alamat,
      })),
    };
  }

  @Get(':nidn')
  async findOne(@Param('nidn') nidnParam: string) {
    const nidn = parseInt(nidnParam, 10);
    const dosen = await this.dosenService.findOneByNidn(nidn);

    if (!dosen) {
      throw new NotFoundException({
        status: 'error',
        message: 'Dosen not found',
      });
    }

    return {
      status: 'success',
      message: 'Dosen retrieved successfully',
      data: {
        nidn: dosen.nidn,
        nama_dosen: dosen.nama_dosen,
        jenis_kelamin: dosen.jenis_kelamin,
        alamat: dosen.alamat,
      },
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
      data: {
        nidn: dosen.nidn,
        nama_dosen: dosen.nama_dosen,
        jenis_kelamin: dosen.jenis_kelamin,
        alamat: dosen.alamat,
      },
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
