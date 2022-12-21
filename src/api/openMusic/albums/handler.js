const { ClientError } = require("../../../helper/exception/ClientError");
const responseError = require("../../../helper/utils/responseErr");

class AlbumsHandler {
    constructor(service, validator){
        this._service = service;
        this._validator = validator;

        this.addAlbums = this.addAlbums.bind(this);
        this.getAlbumsByIdHandler = this.getAlbumsByIdHandler.bind(this);
        this.editAlbumByIdHandler = this.editAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdhandler = this.deleteAlbumByIdhandler.bind(this)
    }

    async addAlbums(request, h){
        try{
            this._validator.validatesAlbumPayload(request.payload);
            const {name, year} = request.payload
            const album = await this._service.insertAlbum({name, year});
            return h.response({
                status:'success',
                message: 'add album',
                data: {
                    "albumId": album,
                },
            }).code(201);
        }catch(error){
          console.log(error)
           return responseError(error, h)
        }
    }

          async getAlbumsByIdHandler(request, h){
            try{
                const{id} = request.params;
                const album = await this._service.getAlbumByID(id);

                return{
                    status: 'success',
                    message: 'success to get by id',
                    data: {
                      album,
                    },
                };
            }catch(error){
                if (error instanceof ClientError) {
                    return h.response({
                      status: 'fail',
                      message: error.message,
                    }).code(error.statusCode = 404);
                  }
                  return h.response({
                    status: 'error',
                    message: error.message,
                  }).code(500);
            }
          }

          async editAlbumByIdHandler(request, h){
            try{
                this._validator.validatesAlbumPayload(request.payload);
                const {id} = request.params;
                
               await this._service.putAlbumByID(id, request.payload);
                return {
                    status: 'success',
                    message: 'Changing albums by id',
                };
            }catch(error){
              return responseError(error, h)
        }
      }

          async deleteAlbumByIdhandler(request, h){
            try{
                const {id} = request.params;
                await this._service.deleteAlbumByID(id)
                return {
                    status: 'success',
                    message: 'Delete albums by id',
                };
            }catch(error){
                if (error instanceof ClientError) {
                    console.log(error)
                    return h.response({
                      status: 'fail',
                      message: error.message,
                    }).code(error.statusCode = 404);
                  }
                  return h.response({
                    status: 'error',
                    message: error.message,
                  }).code(500);
            }            
          }
      }
          


module.exports = AlbumsHandler