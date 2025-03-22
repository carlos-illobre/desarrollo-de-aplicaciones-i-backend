import { randomUUID } from 'node:crypto';

export enum RoleEnum {
  DELIVERY = 'delivery',
  BUYER = 'buyer',
}
export class UserDto {
  id: string;
  email: string;
  password: string;
  role: RoleEnum;

  constructor(email: string, password: string, role: RoleEnum) {
    this.id = randomUUID();
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
