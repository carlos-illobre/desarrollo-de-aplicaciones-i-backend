// entregaRepository.ts

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { EntregaDto } from './dtos/entrega.dto';
import users from './data/users.json';

@Injectable()

import { Entrega } from '../models/entrega';

export class EntregaRepository implements OnModuleInit {

 // Load users from the JSON file when the module initializes
  onModuleInit() {
    this.loadUsersFromFile();
  }

  // Load users from the JSON file
  private loadUsersFromFile() {
    for (const entrega of entregas) {
      this.users.set(entrega.repartidorEmail, entrega as EntregaDto);
    }
  }
  


  public findByRepartidorEmail(email: string): Entrega | undefined {
    return this.entregas.get(email);
  }

  public findById(id: string): Entrega | undefined {
    return this.entregas.get(email);
  }
}
