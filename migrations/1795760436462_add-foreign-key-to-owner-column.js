/* eslint-disable camelcase */
export const shorthands = undefined;

// Catatan lama (sebelum fitur autentikasi) tidak punya owner.
// Foreign key notes_owner_fkey sudah dibuat di migrasi add-owner-to-notes,
// jadi di sini hanya mengisi owner yang masih NULL dengan user khusus "old_notes".
export const up = (pgm) => {
  pgm.sql(`INSERT INTO users (id, username, password, fullname, created_at, updated_at)
           VALUES ('old_notes', 'old_notes', 'old_notes', 'old notes', NOW()::text, NOW()::text)
           ON CONFLICT (id) DO NOTHING`);
  pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner IS NULL");
};

export const down = (pgm) => {
  pgm.sql("UPDATE notes SET owner = NULL WHERE owner = 'old_notes'");
  pgm.sql("DELETE FROM users WHERE id = 'old_notes'");
};
