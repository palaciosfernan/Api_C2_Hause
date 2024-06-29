import { User } from './userModel';
import { query } from '../adapters/mysqlAdapter';

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  create(user: User): Promise<User>;
}

export class UserRepositoryImpl implements UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const sql = 'SELECT * FROM Users WHERE username = ?';
    const rows = await query(sql, [username]);
    return rows.length ? rows[0] : null;
  }

  async create(user: User): Promise<User> {
    const { username, password, role } = user;
    const sql = 'INSERT INTO Users (username, password, role) VALUES (?, ?, ?)';
    const result = await query(sql, [username, password, role]);
    user.id = result.insertId;
    return user;
  }
}
