import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { Entregadto } from '../dtos/entregadto';
import entregasData from './data/entregas.json';
import { Entrega } from './dtos/entrega';

@Injectable()
export class EntregaRepository implements OnModuleInit {
  private entregas: Map<string, Entrega> = new Map();

  onModuleInit() {
    console.log('Inicializando EntregaRepository...');
    this.loadEntregasFromFile();
  }

  private loadEntregasFromFile() {
    console.log(`Cargando entregas desde archivo, datos encontrados: ${entregasData.length}`);
    
    if (!entregasData || entregasData.length === 0) {
      console.error('No se encontraron datos de entregas en el archivo JSON');
      return;
    }
  
    try {
      for (const e of entregasData) {
        console.log(`Procesando entrega para: ${e.repartidorEmail}, cliente: ${e.cliente}`);
        
        const nuevaEntrega = new Entrega(
          e.repartidorEmail,
          e.cliente,
          e.fechaEntrega,
          e.estado,
          e.direccion,
        );
        
        console.log(`Entrega creada con ID: ${nuevaEntrega.id}`);
        this.entregas.set(nuevaEntrega.id, nuevaEntrega);
      }
      
      console.log(`Total de entregas cargadas: ${this.entregas.size}`);
    } catch (error) {
      console.error('Error al cargar las entregas:', error);
      throw new InternalServerErrorException('Error al cargar las entregas');
    }
  
  }

  public findById(id: string): Entrega | undefined {
    console.log(`Buscando entrega con ID: ${id}`);
    const entrega = this.entregas.get(id);
    console.log(entrega ? `Entrega encontrada` : 'Entrega no encontrada');
    return entrega;
  }

  public getEntregasByRepartidorEmail(email: string): Entrega[] {
    console.log(`Buscando entregas para el repartidor: ${email}`);
    const entregasRepartidor: Entrega[] = [];
    
    for (const entrega of this.entregas.values()) {
      if (entrega.repartidorEmail === email) {
        entregasRepartidor.push(entrega);
      }
    }
    
    console.log(`Encontradas ${entregasRepartidor.length} entregas para ${email}`);
    return entregasRepartidor;
  }

// En EntregaRepository
public getAllEntregas(): Entrega[] {
  return Array.from(this.entregas.values());
}
}