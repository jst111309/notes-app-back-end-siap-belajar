import NoteRepositories from '../repositories/note-repositories.js';
import response from '../../../utils/response.js';
import { InvariantError, NotFoundError, AuthorizationError } from '../../../exceptions/index.js';

// Memastikan catatan ada dan dimiliki oleh user yang sedang login.
// verifyNoteOwner mengembalikan null untuk dua kasus: catatan tidak ada, atau bukan milik user.
// Kedua kasus dibedakan di sini agar respons-nya 404 atau 403 sesuai.
async function verifyNoteOwner(noteId, userId) {
  const note = await NoteRepositories.verifyNoteOwner(noteId, userId);
  if (note) return note;

  const exists = await NoteRepositories.getNoteById(noteId);
  if (!exists) throw new NotFoundError('Catatan tidak ditemukan');
  throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
}

export const createNote = async (req, res, next) => {
  const { title, body, tags } = req.validated;
  const note = await NoteRepositories.createNote({ title, body, tags, owner: req.user.id });
  if (!note) return next(new InvariantError('Catatan gagal ditambahkan'));
  return response(res, 201, 'Catatan berhasil ditambahkan', { noteId: note.id });
};

export const getNotes = async (req, res) => {
  const notes = await NoteRepositories.getNotes(req.user.id);
  return response(res, 200, 'Catatan sukses ditampilkan', { notes });
};

export const getNoteById = async (req, res) => {
  const note = await verifyNoteOwner(req.params.id, req.user.id);
  return response(res, 200, 'Catatan sukses ditampilkan', { note });
};

export const editNoteById = async (req, res) => {
  await verifyNoteOwner(req.params.id, req.user.id);
  const note = await NoteRepositories.editNote({ id: req.params.id, ...req.validated });
  return response(res, 200, 'Catatan berhasil diperbarui', note);
};

export const deleteNoteById = async (req, res) => {
  await verifyNoteOwner(req.params.id, req.user.id);
  const deletedNote = await NoteRepositories.deleteNote(req.params.id);
  return response(res, 200, 'Catatan berhasil dihapus', deletedNote);
};
