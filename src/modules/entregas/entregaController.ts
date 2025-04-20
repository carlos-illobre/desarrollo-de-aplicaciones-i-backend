// entregaController.ts

import { Response } from 'express';
import { EntregaService } from '../entregas/repositories/entregaService';
import { Body, Controller, Get, HttpCode, InternalServerErrorException, NotFoundException, Param, Post, Req, Request } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { Entrega } from './repositories/dtos/entrega';
import { AuthenticatedRequest } from 'src/common/authenticated-request';

@Controller('entregas')
export class EntregaController {

  constructor(private readonly entregaService: EntregaService){}; 

@HttpCode(200)
@Get()
async getEntregasDelRepartidor(@Req() request:AuthenticatedRequest ) {
  try {
    const entregasDelRepartidor = await this.entregaService.getEntregasByRepartidorEmail(request.authUserEmail);
    return entregasDelRepartidor;
  } catch (error) {
    throw new Error(error.message);
  }
}


@HttpCode(200)
@Get(':id')
async getEntregaById(@Param('id') id: string) {
  try {
    const entrega = await this.entregaService.getEntregaById(id);

    if (entrega) {
      return entrega;
    } else {
      throw new Error('Entrega no encontrada');
    }
  } catch (error) {
    throw new Error(error.message);
  }
}


}