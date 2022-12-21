const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { InvariantError } = require("../../helper/exception/InvariantError");
const NotFoundError = require("../../helper/exception/notFound");

class AlbumsService {
    constructor(){
        this._pool = new Pool();
    }

    async insertAlbum({name, year}){
        const id = `albums-${nanoid(16)}`

        const sqlStatment = {
            text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values: [id, name, year],
        };

        const result = await this._pool.query(sqlStatment);
        if(!result.rows[0].id){
            throw new InvariantError("failed insert database");
        }

        return result.rows[0].id
    }

    async getAlbumByID(id){
        const sqlStatment = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(sqlStatment);
        if (!result.rows.length){
            throw new InvariantError("failed get by id")
        }

        return result.rows[0]
    }


    async putAlbumByID(id,{name, year}){
        const sqlStatment = {
            text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
            values: [name, year, id],
        };

        const result = await this._pool.query(sqlStatment);
        if(!result.rows.length){
            throw new NotFoundError('failed to update database');
        }
    }

    async deleteAlbumByID(id){
        const sqlStatment = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id ',
            values: [id],
        };

        const result = await this._pool.query(sqlStatment);
        if(!result.rows.length){
            throw new InvariantError('failed to delete ');
        }
        return result.rows.length
    }
}

module.exports = AlbumsService