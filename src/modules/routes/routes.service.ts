import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoutesRepository } from './repositories/routes.repository';
import { RouteStatus } from './dtos/get-routes.response.dto';
import { UsersRepository } from '../auth/repositories/users.repository';

@Injectable()
export class RoutesService {
  constructor(
    private readonly routesRepository: RoutesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  //Get all pending routes from all delivery people
  getAllPendingRoutes() {
    return this.routesRepository.findAll([RouteStatus.PENDING]);
  }

  //Get routes by delivery person ID
  getRoutesByDeliveryPersonId(deliveryPersonId: string, authUserEmail: string) {
    //Get user by email
    const user = this.usersRepository.findByEmail(authUserEmail);
    if (!user) {
      throw new NotFoundException(`User with email ${authUserEmail} not found`);
    }

    //Check if the user is the delivery person for the route
    const isDeliveryPerson = deliveryPersonId === user.id;
    if (!isDeliveryPerson) {
      throw new ForbiddenException(
        `Authenticated user with id ${user.id} is not authorized to access routes for delivery person ID ${deliveryPersonId}`,
      );
    }

    const route =
      this.routesRepository.findByDeliveryPersonId(deliveryPersonId);

    //Check if the route exists
    if (!route) {
      throw new NotFoundException(
        `No routes found for delivery person ID ${deliveryPersonId}`,
      );
    }

    return route;
  }

  //Get route by package ID
  getRouteByPackageId(packageId: string, authUserEmail: string) {
    //Get user by email
    const user = this.usersRepository.findByEmail(authUserEmail);
    if (!user) {
      throw new NotFoundException(`User with email ${authUserEmail} not found`);
    }
    const route = this.routesRepository.findByPackageId(packageId);

    if (!route) {
      throw new NotFoundException(
        `Route with package ID ${packageId} not found`,
      );
    }

    // Check if the user is the delivery person for the route
    const isDeliveryPerson = route.delivery?.deliveryPersonId === user.id;
    if (!isDeliveryPerson) {
      throw new ForbiddenException(
        `Authenticated user with id ${user.id} is not authorized to access route with package ID ${packageId}`,
      );
    }

    return route;
  }
}
