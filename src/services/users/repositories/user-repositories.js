import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import pool from '../../../database/pool.js';
import { ConflictError } from '../../../exceptions/index.js';
class UserRepositories {
  constructor() { this.pool = pool; }
  async createUser({ username, password, fullname }) {
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date().toISOString();
    try {
      const result = await this.pool.query({
        text: `INSERT INTO users (id, username, password, fullname, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, fullname`,
        values: [id, username, hashedPassword, fullname, now, now],
      });
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') throw new ConflictError('Username sudah digunakan');
      throw error;
    }
  }
  async verifyNewUsername(username) {
    const result = await this.pool.query({
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    });
    return result.rowCount > 0;
  }
  async getUserById(id) {
    const result = await this.pool.query({
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [id],
    });
    return result.rows[0];
  }
}
export default new UserRepositories();
