import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class GetRoutesResponseDto {
  @IsUUID()
  @IsNotEmpty()
  packageId: string;

  @IsString()
  @IsNotEmpty()
  warehouse: string;

  @IsString()
  @IsNotEmpty()
  destinationNeighborhood: string;
}
