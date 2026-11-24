import { nanoid } from 'nanoid';
import pool from '../../../database/pool.js';

class NoteRepositories {
  constructor() { this.pool = pool; }

  async createNote({ title, body, tags }) {
    const id = `note-${nanoid(16)}`;
    const now = new Date().toISOString();
    const query = {
      text: `INSERT INTO notes (id, title, body, tags, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      values: [id, title, body, tags, now, now],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getNotes() {
    const result = await this.pool.query('SELECT * FROM notes ORDER BY created_at DESC');
    return result.rows;
  }

  async getNoteById(id) {
    const result = await this.pool.query({ text: 'SELECT * FROM notes WHERE id = $1', values: [id] });
    return result.rows[0];
  }

  async editNote({ id, title, body, tags }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
      values: [title, body, tags, updatedAt, id],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteNote(id) {
    const result = await this.pool.query({
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    });
    return result.rows[0]?.id; // ID tidak ditemukan -> undefined, bukan TypeError
  }
}
export default new NoteRepositories();
