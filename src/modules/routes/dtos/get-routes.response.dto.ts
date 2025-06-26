import { Type } from 'class-transformer';

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
  clientName: string;

  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;
}

export class DeliveryDto {
  assignedDateTime: string;
  deliveredDateTime?: string;
  deliveryPersonId: string;
  deliveryConfirmationCode: string;
}

export class GetRoutesResponseDto {
  packageId: string;

  @Type(() => WarehouseDto)
  warehouse: WarehouseDto;

  status: RouteStatus;
  assignmentConfirmationCode: string;

  @Type(() => DeliveryDto)
  delivery?: DeliveryDto;

  @Type(() => DestinationDto)
  destination: DestinationDto;
}
