const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { InvariantError } = require("../../helper/exception/InvariantError");
const NotFoundError = require("../../helper/exception/notFound");

class SongsServices {
    constructor(){
        this._pool = new Pool();
    }

    async addSongs({title, year, performer, genre, duration, albumId}){
        const id = `songs-${nanoid(16)}`

        const sqlStatment = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id,title, year, performer, genre, duration, albumId]
        };

        const result = await this._pool.query(sqlStatment);
        if(!result.rows[0].id){
            throw new InvariantError("failed to insert database");
        }

        return result.rows[0].id;
    }

    async getAllSongs({title = "", performer = ""}){
        const sqlStatment = {
            text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
            values: [`%${title}%`, `%${performer}%`], 
        };

        const result = await this._pool.query(sqlStatment);
        if(!result.rows.length){
            throw new InvariantError('failed get data')
        }

        return result.rows;
    }

    async getSongsByID(id){
        const sqlStatment = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(sqlStatment);
        if(!result.rows[0]){
            throw new NotFoundError('id not found');
        }

        return result.rows[0]
    }

    async putSongsByID(id,{title, year, performer, genre, duration, albumId}) {
        const sqlStatment = {
            text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
            values: [title, year, performer, genre, duration, albumId, id]
        }

        const result = await this._pool.query(sqlStatment);
        if(!result.rows.length){
            throw new NotFoundError(" failed to update database ");
        }

        return result.rows
    }

    async deleteSongsByID(id){
        const sqlStatment = {
            text: 'DELETE FROM songs WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(sqlStatment);
        if(!result.rowCount){
            throw new NotFoundError("failed delete id not found");
        }
    }

    async verifySongExists(songId) {
        const query = {
          text: 'SELECT * FROM songs WHERE id = $1',
          values: [songId],
        };
        const result = await this._pool.query(query);
    
        if (!result.rows.length) {
          throw new NotFoundError('songs not found');
        }
      }
}


module.exports = SongsServices