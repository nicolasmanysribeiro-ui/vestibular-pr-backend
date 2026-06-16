import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SimulationsService } from './simulations.service';
import { CreateSimulationDto, CompleteSimulationDto } from './dto/create-simulation.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('simulations')
export class SimulationsController {
  constructor(private simulationsService: SimulationsService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateSimulationDto) {
    return this.simulationsService.createSimulation(req.user.userId, dto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.simulationsService.getUserSimulations(req.user.userId);
  }

  @Patch(':id/complete')
  complete(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: CompleteSimulationDto,
  ) {
    return this.simulationsService.completeSimulation(req.user.userId, id, dto.answers);
  }
}