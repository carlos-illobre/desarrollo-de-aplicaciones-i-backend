import { Injectable, OnModuleInit } from '@nestjs/common';
import { RouteDto, RouteStatus } from '../dtos/routes.dto';
import * as fs from 'fs';
import routes from './data/routes.json';

@Injectable()
export class RoutesRepository implements OnModuleInit {
  private routes: Map<string, RouteDto> = new Map();

  // Load routes from the JSON file when the module initializes
  onModuleInit() {
    this.loadRoutesFromFile();
  }

  // Load routes from the JSON file
  private loadRoutesFromFile() {
    for (const route of routes) {
      this.routes.set(route.id, route as RouteDto);
    }
  }

  // Save routes to the JSON file
  private saveRoutesToFile() {
    const routesArray = Array.from(this.routes.values());
    try {
      fs.writeFileSync(
        './src/modules/routes/repositories/data/routes.json',
        JSON.stringify(routesArray, null, 2),
        'utf-8',
      );
      console.log('Routes file updated successfully');
    } catch (error) {
      console.error('Error writing to routes file:', error);
    }
  }

  // Find a route by id
  public findById(id: string): RouteDto | undefined {
    return this.routes.get(id);
  }

  // Get all by status
  public findAll(status: RouteStatus[]): RouteDto[] {
    return Array.from(this.routes.values()).filter((route) =>
      status.includes(route.status),
    );
  }

  // Find all by delivery person ID
  public findByDeliveryPersonId(deliveryPersonId: string): RouteDto[] {
    return Array.from(this.routes.values()).filter(
      (route) => route.delivery?.deliveryPersonId === deliveryPersonId,
    );
  }

  // Update a route
  public updateRoute(id: string, updatedRoute: RouteDto): RouteDto {
    this.routes.set(id, updatedRoute);
    this.saveRoutesToFile();
    return updatedRoute;
  }
}
