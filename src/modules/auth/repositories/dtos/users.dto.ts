import { randomUUID } from 'node:crypto';

export class UserDto {
  id: string;
  email: string;
  fullName: string;
  password: string;

  constructor(email: string, fullName: string, password: string) {
    this.id = randomUUID();
    this.email = email;
    this.fullName = fullName;
    this.password = password;
  }
}
