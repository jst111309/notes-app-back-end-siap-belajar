/* eslint-disable camelcase */
export const shorthands = undefined;
export const up = (pgm) => {
  pgm.addColumn('notes', {
    owner: {
      type: 'VARCHAR(50)',
      references: 'users',
      onDelete: 'CASCADE',
    },
  });
};
export const down = (pgm) => pgm.dropColumn('notes', 'owner');
