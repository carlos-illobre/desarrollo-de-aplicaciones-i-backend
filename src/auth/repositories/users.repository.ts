import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import { UserDto } from './dtos/users.dto';
import * as users from './data/users.json';

@Injectable()
export class UsersRepository implements OnModuleInit {
  private users: UserDto[] = [];

  // Load users from the JSON file when the module initializes
  async onModuleInit() {
    this.loadUsersFromFile();
  }

  // Load users from the JSON file
  private loadUsersFromFile() {
    this.users = users as UserDto[];
  }

  // Add a new user to the repository
  public create(user: UserDto): UserDto {
    if (this.findByEmail(user.email))
      throw new ConflictException('User already exists');
    this.users.push(user);
    return user;
  }

  // Find a user by email
  public findByEmail(email: string): UserDto | undefined {
    return this.users.find((user) => user.email === email);
  }

  // Find a user by id
  public findById(id: string): UserDto | undefined {
    return this.users.find((user) => user.id === id);
  }

  // Get all users
  public findAll(): UserDto[] {
    return this.users;
  }
}
