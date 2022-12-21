/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('albums', {
        id : {
            type: 'VARCHAR(255)',
            primaryKey: true,
            notNull: true,
        },
        name: {
            type: 'VARCHAR(255)',
            notNull: false,
        },
        year: {
            type: 'INT',
            notNull: false,
        },
    })
};

exports.down = (pgm) => {
    pgm.dropTable('albums')
};
