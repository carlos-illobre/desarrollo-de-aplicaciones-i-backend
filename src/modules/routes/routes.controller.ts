import { Controller, Get, UseGuards, Param, Req } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AuthenticatedRequest } from '../../common/authenticated-request';

@Controller('routes')
@UseGuards(AuthGuard)
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  // Get all pending routes from all delivery people
  @Get()
  getPendingRoutes() {
    return this.routesService.getAllPendingRoutes();
  }

  // Get routes by delivery person ID
  @Get('routes/:deliveryPersonId')
  getRoutesByDeliveryPersonId(
    @Param('deliveryPersonId') deliveryPersonId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.routesService.getRoutesByDeliveryPersonId(
      deliveryPersonId,
      req.authUserEmail,
    );
  }

  // Get route by package ID
  @Get('routes/:packageId')
  getRouteByPackageId(
    @Param('packageId') packageId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.routesService.getRouteByPackageId(packageId, req.authUserEmail);
  }
}
