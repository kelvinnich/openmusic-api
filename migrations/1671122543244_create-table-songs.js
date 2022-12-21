exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('songs',{
        id: {
            type: 'VARCHAR(255)',
            primaryKey: true,
            notNull: true,
        },

        title: {
            type: 'VARCHAR(255)',
            notNull: false,
        },

        year: {
            type:'INT',
            notNull: false,
        },

        performer: {
            type: 'VARCHAR(255)',
            notNull: false,
        },

        genre: {
            type: 'VARCHAR(255)',
            notNull: false,
        },

        duration: {
            type: 'INT',
            notNull: false,
        },

        album_id: {
            type: 'TEXT',
            notNull: false,
        },
    });

    pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE')


};

exports.down = (pgm) => {
    pgm.dropTable('songs')
};

