import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { UserDto } from './dtos/users.dto';
import * as fs from 'fs';
import * as path from 'path';
import users from './data/users.json';

@Injectable()
export class UsersRepository implements OnModuleInit {
  private users: Map<string, UserDto> = new Map();

  // Load users from the JSON file when the module initializes
  onModuleInit() {
    this.loadUsersFromFile();
  }

  // Load users from the JSON file
  private loadUsersFromFile() {
    for (const user of users) {
      this.users.set(user.email, user as UserDto);
    }
  }

  // Save users to the JSON file
  private saveUsersToFile() {
    const usersArray = Array.from(this.users.values());
    try {
      fs.writeFileSync(
        './src/modules/auth/repositories/data/users.json',
        JSON.stringify(usersArray, null, 2),
        'utf-8',
      );
      console.log('File updated successfully');
    } catch (error) {
      console.error('Error writing to file:', error);
    }
  }

  // Add a new user to the repository
  public create(email: string, fullName: string, password: string) {
    const user = new UserDto(email, fullName, password);
    const existingUser = this.findByEmail(user.email);

    if (existingUser) throw new ConflictException('User already exists');
    this.users.set(user.email, user);

    //Update file with new user
    this.saveUsersToFile();
    return user;
  }

  // Find a user by email
  public findByEmail(email: string): UserDto | undefined {
    return this.users.get(email);
  }

  // Get all users
  public findAll(): UserDto[] {
    return Array.from(this.users.values());
  }

  public updatePassword(email: string, password: string): void {
    const user = this.findByEmail(email);
    if (!user) {
      console.log('User not found');
      throw new InternalServerErrorException();
    }
    user.password = password;
    this.users.set(email, user);
  }
}
