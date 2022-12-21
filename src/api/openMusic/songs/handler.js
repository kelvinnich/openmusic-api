const responseError = require("../../../helper/utils/responseErr");


class SongsHandler {
    constructor(service, validator){
        this._service = service;
        this._validator = validator;


        this.addSongsHandler = this.addSongsHandler.bind(this);
        this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
        this.getSongbyIdHandler = this.getSongbyIdHandler.bind(this);
        this.putSongsByIdHandler = this.putSongsByIdHandler.bind(this);
        this.deleteSongsByIdHandler = this.deleteSongsByIdHandler.bind(this)
    }

    async addSongsHandler(request, h){
        try{

            this._validator.validateSongsPayload(request.payload);
            const{title, year,  performer, genre, duration} = request.payload;
    
            const song = await this._service.addSongs({title, year, performer, genre,duration});
    
            return h.response({
                status: 'success',
                message: 'Menambahkan lagu',
                data: {
                    songId: song,
                }
           }).code(201);
        }catch(error){
            console.log(error)
            return responseError(error, h);
        }
    }

    async getAllSongsHandler(request, h){
        try{
            const songs = await this._service.getAllSongs(request.query);
            return {
                status: 'success',
                message: 'Mendapatkan seluruh lagu',
                data: {
                    songs,
                },
            }
        }catch(error){
            return responseError(error, h)
        }
    }

    async getSongbyIdHandler(request, h){
        try{
            const {id}  = request.params;
            const song = await this._service.getSongsByID(id);
    
            return {
                status: 'success',
                message: 'Mengubah lagu berdasarkan id',
                data: {
                    song: song,
                },
            }
        }catch(error){
            //console.log(error)
            return responseError(error, h)
        }
    }

    async putSongsByIdHandler(request, h){
        try{
            this._validator.validateSongsPayload(request.payload);
            const { id } = request.params;

            const songs = await this._service.putSongsByID(id, request.payload);

            return {
                status: 'success',
                message: 'Mengubah lagu berdasarkan id',
                data : {
                    songs,
                },
            };
        }catch(error){
            console.log(error)
           return responseError(error, h);
        }
    }

    async deleteSongsByIdHandler(request, h){
        try{
            const {id} = request.params;

            const songs = await this._service.deleteSongsByID(id);

            return{
                status: 'success',
                message: 'Menghapus lagu berdasarkan id',
                data : {
                    songs
                },
            };
        }catch(error){
           return responseError(error, h)
        }

    }
}

module.exports = SongsHandler