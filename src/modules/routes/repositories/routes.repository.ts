import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  GetRoutesResponseDto,
  RouteStatus,
} from '../dtos/get-routes.response.dto';
import routes from './data/routes.json';

@Injectable()
export class RoutesRepository implements OnModuleInit {
  private routes: Map<string, GetRoutesResponseDto> = new Map();

  // Load routes from the JSON file when the module initializes
  onModuleInit() {
    this.loadRoutesFromFile();
  }

  // Load routes from the JSON file
  private loadRoutesFromFile() {
    for (const route of routes) {
      this.routes.set(route.packageId, route as GetRoutesResponseDto);
    }
  }

  // Find a route by packageId
  public findByPackageId(packageId: string): GetRoutesResponseDto | undefined {
    return this.routes.get(packageId);
  }

  // Get all by status
  public findAll(status: RouteStatus[]): GetRoutesResponseDto[] {
    return Array.from(this.routes.values()).filter((route) =>
      status.includes(route.status),
    );
  }

  // Find all by delivery person ID
  public findByDeliveryPersonId(
    deliveryPersonId: string,
  ): GetRoutesResponseDto[] {
    return Array.from(this.routes.values()).filter(
      (route) => route.delivery?.deliveryPersonId === deliveryPersonId,
    );
  }
}
