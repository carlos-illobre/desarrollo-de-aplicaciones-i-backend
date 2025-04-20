// entregaService.ts
import { Injectable } from '@nestjs/common';
import { EntregaRepository } from '../repositories/entregaRepository';
import { Entrega } from './dtos/entrega';

@Injectable()
export class EntregaService {
  constructor(private readonly entregaRepository: EntregaRepository) {}

  public async getEntregasByRepartidorEmail(email: string) {
    return this.entregaRepository.getEntregasByRepartidorEmail(email);
  }

  public async getEntregaById(id: string) {
    return this.entregaRepository.findById(id);
  }

  public async getEntregas() : Promise<Entrega[]> {
    return this.entregaRepository.getAllEntregas();
  }
}