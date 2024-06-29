import { User } from '../domain/userModel';

export interface UserRepositoryPort {
  findByUsername(username: string): Promise<User | null>;
  create(user: User): Promise<User>;
}
