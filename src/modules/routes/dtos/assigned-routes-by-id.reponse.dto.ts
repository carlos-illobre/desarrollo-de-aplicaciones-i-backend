import { RouteDto } from './routes.dto';

export enum RouteStatus {
  PENDING = 'pending',
  ON_ROUTE = 'on_route',
  COMPLETED = 'completed',
}

export class WarehouseDto {
  name: string;
  section: string;
  shelf: string;
}

export class CoordinatesDto {
  lat: number;
  lng: number;
}

export class DestinationDto {
  neighborhood: string;
  address: string;
  coordinates: CoordinatesDto;
}

export class DeliveryDto {
  assignedAt: string;
  deliveredAt?: string;
  deliveryPersonId: string;
}

export class GetAssignedRouteByIdResponse {
  id: string;
  warehouse: WarehouseDto;
  status: RouteStatus;
  clientName: string;
  delivery?: DeliveryDto;
  destination: DestinationDto;

  constructor(route: RouteDto) {
    this.id = route.id;
    this.warehouse = route.warehouse;
    this.status = route.status;
    this.clientName = route.clientName;
    this.delivery = route.delivery
      ? {
          assignedAt: route.delivery.assignedAt,
          deliveredAt: route.delivery.deliveredAt,
          deliveryPersonId: route.delivery.deliveryPersonId,
        }
      : undefined;
    this.destination = route.destination;
  }
}
