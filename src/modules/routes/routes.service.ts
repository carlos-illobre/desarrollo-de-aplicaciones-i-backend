import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoutesRepository } from './repositories/routes.repository';
import { RouteDto, RouteStatus } from './dtos/routes.dto';
import { PendingRoutesResponseDto } from './dtos/pending-routes.response.dto';
import { AssignedRoutesResponseDto } from './dtos/assigned-routes.response.dto';
import { UsersRepository } from '../auth/repositories/users.repository';
import { generateOtp } from '../../common/utils';

@Injectable()
export class RoutesService {
  constructor(
    private readonly routesRepository: RoutesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  //Get all pending routes from all delivery people
  getAllPendingRoutes(): PendingRoutesResponseDto[] {
    const pendingRoutes = this.routesRepository.findAll([RouteStatus.PENDING]);

    return pendingRoutes.map((route) => ({
      id: route.id,
      warehouse: route.warehouse,
      destinationNeighborhood: route.destination.neighborhood,
    }));
  }

  //Get routes for the authenticated delivery person
  getMyRoutes(authUserEmail: string): AssignedRoutesResponseDto[] {
    //Get user by email
    const user = this.usersRepository.findByEmail(authUserEmail);
    if (!user) {
      throw new NotFoundException(`User with email ${authUserEmail} not found`);
    }

    // Get all routes assigned to the delivery person (all are assigned or completed routes)
    const routes = this.routesRepository.findByDeliveryPersonId(user.id);

    //Check if routes exist
    if (!routes || routes.length === 0) {
      throw new NotFoundException(
        `No routes found for delivery person ID ${user.id}`,
      );
    }

    // Map to simplified response structure
    return routes.map((route) => ({
      id: route.id,
      clientName: route.clientName,
      date:
        route.status === RouteStatus.COMPLETED
          ? route.delivery!.deliveredAt!
          : route.delivery!.assignedAt,
      address: route.destination.address,
      status: route.status,
    }));
  }

  //Get route by ID
  getAssignedRouteById(id: string, authUserEmail: string): RouteDto {
    //Get user by email
    const user = this.usersRepository.findByEmail(authUserEmail);
    if (!user) {
      throw new NotFoundException(`User with email ${authUserEmail} not found`);
    }
    const route = this.routesRepository.findById(id);

    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    // Check if the user is the delivery person for the route
    const isDeliveryPerson = route.delivery?.deliveryPersonId === user.id;
    if (!isDeliveryPerson) {
      throw new ForbiddenException(
        `Authenticated user with id ${user.id} is not authorized to access route with ID ${id}`,
      );
    }
    return route;
  }

  //Assign route to authenticated delivery person
  assignRoute(routeId: string, authUserEmail: string) {
    //Get user by email
    const user = this.usersRepository.findByEmail(authUserEmail);
    if (!user) {
      throw new NotFoundException(`User with email ${authUserEmail} not found`);
    }

    const route = this.routesRepository.findById(routeId);
    if (!route) {
      throw new NotFoundException(`Route with ID ${routeId} not found`);
    }

    // Check if route is pending
    if (route.status !== RouteStatus.PENDING) {
      throw new ForbiddenException(
        `Route with ID ${routeId} is not available for assignment`,
      );
    }

    // Update route with assignment details and generate delivery confirmation code
    const updatedRoute: RouteDto = {
      ...route,
      status: RouteStatus.ON_ROUTE,
      delivery: {
        assignedAt: new Date().toISOString(),
        deliveryPersonId: user.id,
        deliveryConfirmationCode: generateOtp(),
      },
    };
    this.routesRepository.updateRoute(routeId, updatedRoute);
  }

  //Mark route as delivered
  deliverRoute(
    routeId: string,
    confirmationCode: string,
    authUserEmail: string,
  ) {
    //Get user by email
    const user = this.usersRepository.findByEmail(authUserEmail);
    if (!user) {
      throw new NotFoundException(`User with email ${authUserEmail} not found`);
    }

    const route = this.routesRepository.findById(routeId);
    if (!route) {
      throw new NotFoundException(`Route with ID ${routeId} not found`);
    }

    // Check if route is on_route and assigned to this user
    if (route.status !== RouteStatus.ON_ROUTE) {
      throw new ForbiddenException(
        `Route with ID ${routeId} is not available for delivery`,
      );
    }

    if (route.delivery?.deliveryPersonId !== user.id) {
      throw new ForbiddenException(
        `Route with ID ${routeId} is not assigned to this delivery person`,
      );
    }

    // Verify delivery confirmation code
    if (route.delivery?.deliveryConfirmationCode !== confirmationCode) {
      throw new ForbiddenException('Invalid delivery confirmation code');
    }

    // Update route with delivery details
    const updatedRoute: RouteDto = {
      ...route,
      status: RouteStatus.COMPLETED,
      delivery: {
        ...route.delivery,
        deliveredAt: new Date().toISOString(),
      },
    };

    this.routesRepository.updateRoute(routeId, updatedRoute);
  }

  //Cancel assigned route and return it to pending status
  cancelRoute(routeId: string, authUserEmail: string) {
    //Get user by email
    const user = this.usersRepository.findByEmail(authUserEmail);
    if (!user) {
      throw new NotFoundException(`User with email ${authUserEmail} not found`);
    }

    const route = this.routesRepository.findById(routeId);
    if (!route) {
      throw new NotFoundException(`Route with ID ${routeId} not found`);
    }

    // Check if route is on_route and assigned to this user
    if (route.status !== RouteStatus.ON_ROUTE) {
      throw new ForbiddenException(
        `Route with ID ${routeId} cannot be cancelled (not on route)`,
      );
    }

    if (route.delivery!.deliveryPersonId !== user.id) {
      throw new ForbiddenException(
        `Route with ID ${routeId} is not assigned to this delivery person`,
      );
    }

    // Update route to return it to pending status
    const updatedRoute: RouteDto = {
      ...route,
      status: RouteStatus.PENDING,
      delivery: undefined, // Remove delivery information
    };

    this.routesRepository.updateRoute(routeId, updatedRoute);
  }
}
