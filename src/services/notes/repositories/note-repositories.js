import { nanoid } from 'nanoid';
import pool from '../../../database/pool.js';

class NoteRepositories {
  constructor() { this.pool = pool; }

  async createNote({ title, body, tags, owner }) {
    const id = `note-${nanoid(16)}`;
    const now = new Date().toISOString();
    const query = {
      text: `INSERT INTO notes (id, title, body, tags, created_at, updated_at, owner)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      values: [id, title, body, tags, now, now, owner],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getNotes(owner) {
    const result = await this.pool.query({
      text: 'SELECT * FROM notes WHERE owner = $1 ORDER BY created_at DESC',
      values: [owner],
    });
    return result.rows;
  }

  async getNoteById(id) {
    const result = await this.pool.query({ text: 'SELECT * FROM notes WHERE id = $1', values: [id] });
    return result.rows[0];
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      return null;
    }
    const note = result.rows[0];
    if (note.owner !== owner) {
      return null;
    }
    return note;
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
