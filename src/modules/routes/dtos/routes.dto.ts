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
  deliveryConfirmationCode: string;
}

export class RouteDto {
  id: string;
  warehouse: WarehouseDto;
  status: RouteStatus;
  assignmentConfirmationCode: string;
  clientName: string;
  delivery?: DeliveryDto;
  destination: DestinationDto;
}
