export class PendingRoutesResponseDto {
  id: string;
  warehouse: {
    name: string;
    section: string;
    shelf: string;
  };
  destinationNeighborhood: string;
}
