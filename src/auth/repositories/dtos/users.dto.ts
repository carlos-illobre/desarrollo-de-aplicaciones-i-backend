import { randomUUID } from 'node:crypto';

export enum RoleEnum {
  DELIVERY = 'delivery',
  BUYER = 'buyer',
}
export class UserDto {
  id: string;
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.id = randomUUID();
    this.email = email;
    this.password = password;
  }
}
