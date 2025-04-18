// entregaController.ts

import { Request, Response } from 'express';
import { EntregaService } from '../services/entregaService';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';


export class EntregaController {
  private entregaService: EntregaService;

  constructor() {
    this.entregaService = new EntregaService();
  }


@Public()
@HttpCode(200)
@Post('entregas/:email')
async getEntregasDelRepartidor(@Param('email') email: string) {
  try {
    const entregasDelRepartidor = await this.entregaService.getEntregasByRepartidorEmail(email);
    return entregasDelRepartidor;
  } catch (error) {
    throw new Error(error.message);
  }
}

@Public()
@HttpCode(200)
@Get('entrega/:id')
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
