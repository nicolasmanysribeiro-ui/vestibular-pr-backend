import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DisciplinesService } from './disciplines.service';

@UseGuards(AuthGuard('jwt'))
@Controller('disciplines')
export class DisciplinesController {
  constructor(private disciplinesService: DisciplinesService) {}

  @Get()
  findAll() {
    return this.disciplinesService.findAll();
  }
}