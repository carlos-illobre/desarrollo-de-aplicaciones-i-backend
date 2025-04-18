// entregaService.ts

import { EntregaRepository } from '../repositories/entregaRepository';

export class EntregaService {
  private entregaRepository: EntregaRepository;

  constructor() {
    this.entregaRepository = new EntregaRepository();
  }

  public async getEntregasByRepartidorEmail(email: string) {
    return this.entregaRepository.findByRepartidorEmail(email);
  }

  public async getEntregaById(id: string) {
    return this.entregaRepository.findById(id);
  }
}
