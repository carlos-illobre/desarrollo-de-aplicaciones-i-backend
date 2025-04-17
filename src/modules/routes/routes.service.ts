import { Injectable } from '@nestjs/common';
import { RoutesRepository } from './repositories/routes.repository';

@Injectable()
export class RoutesService {
  constructor(private readonly routesRepository: RoutesRepository) {}

  getAllRoutes() {
    return this.routesRepository.findAll();
  }
}
