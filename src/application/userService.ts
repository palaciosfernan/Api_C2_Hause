import { User } from '../domain/userModel';
import { UserRepository } from '../domain/userRepository';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(user: User): Promise<User> {
    const existingUser = await this.userRepository.findByUsername(user.username);
    if (existingUser) {
      throw new Error('El nombre de usuario ya está en uso');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const createdUser = await this.userRepository.create(user);
    return createdUser;
  }

  async loginUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Usuario o contraseña incorrectos');
    }
    return user;
  }
}
