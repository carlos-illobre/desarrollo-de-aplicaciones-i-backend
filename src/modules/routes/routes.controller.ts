import { Controller, Get, Post, UseGuards, Param, Req } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AuthenticatedRequest } from '../../common/authenticated-request';
import { PendingRoutesResponseDto } from './dtos/pending-routes.response.dto';
import { AssignedRoutesResponseDto } from './dtos/assigned-routes.response.dto';
import { GetAssignedRouteByIdResponse } from './dtos/assigned-routes-by-id.reponse.dto';

@Controller('routes')
@UseGuards(AuthGuard)
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  // Get all pending routes from all delivery people
  @Get('pending')
  getPendingRoutes(): PendingRoutesResponseDto[] {
    return this.routesService.getAllPendingRoutes();
  }

  // Get routes for the authenticated delivery person
  @Get('assigned')
  getAssignedRoutes(
    @Req() req: AuthenticatedRequest,
  ): AssignedRoutesResponseDto[] {
    return this.routesService.getMyRoutes(req.authUserEmail);
  }

  // Get assigned route by ID
  @Get('assigned/:id')
  getRouteById(
    @Param('id') routeId: string,
    @Req() req: AuthenticatedRequest,
  ): GetAssignedRouteByIdResponse {
    const route = this.routesService.getAssignedRouteById(
      routeId,
      req.authUserEmail,
    );

    return new GetAssignedRouteByIdResponse(route);
  }

  // Get assigned route by ID
  @Get('pending/:id')
  getPendingRouteById(
    @Param('id') routeId: string,
    @Req() req: AuthenticatedRequest,
  ): GetAssignedRouteByIdResponse {
    const route = this.routesService.getPendingRouteById(
      routeId,
      req.authUserEmail,
    );

    return new GetAssignedRouteByIdResponse(route);
  }

  // Assign route to authenticated delivery person
  @Post(':id/assign/:confirmationCode')
  assignRoute(
    @Param('id') routeId: string,
    @Param('confirmationCode') confirmationCode: string,
    @Req() req: AuthenticatedRequest,
  ) {
    this.routesService.assignRoute(
      routeId,
      confirmationCode,
      req.authUserEmail,
    );
  }

  // Mark route as delivered
  @Post(':id/deliver/:confirmationCode')
  deliverRoute(
    @Param('id') routeId: string,
    @Param('confirmationCode') confirmationCode: string,
    @Req() req: AuthenticatedRequest,
  ) {
    this.routesService.deliverRoute(
      routeId,
      confirmationCode,
      req.authUserEmail,
    );
  }

  // Cancel assigned route and return it to pending status
  @Post(':id/cancel')
  cancelRoute(@Param('id') routeId: string, @Req() req: AuthenticatedRequest) {
    this.routesService.cancelRoute(routeId, req.authUserEmail);
  }
}
