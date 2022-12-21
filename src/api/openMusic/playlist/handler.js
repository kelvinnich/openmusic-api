const responseError = require("../../../helper/utils/responseErr");

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getPlaylistByIdHandler = this.getPlaylistByIdHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try{
      this._validator.validatePlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialsId } = request.auth.credentials;
      console.log(credentialsId);
      const playlistId = await this._playlistsService.addPlaylist({name, owner :credentialsId});
      
      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil dibuat',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;

    }catch(error){
      console.log(error);
      return responseError(error, h)
    }
  }

  async getPlaylistsHandler(request, h) {
    try{
      const { id: userId } = request.auth.credentials;
      const playlists = await this._playlistsService.getPlaylists(userId);
      return {
        status: 'success',
        data: {
          playlists,
        },
      };

    }catch(error){
      return responseError(error, h)
    }
  }

  async deletePlaylistByIdHandler(request, h) {
    try{
      const { id: playlistId } = request.params;
      const { id: userId } = request.auth.credentials;
  
      await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
      await this._playlistsService.deletePlaylistById(playlistId);
  
      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };

    }catch(error){
      console.log(error);
      return responseError(error, h);
    }
  }

  async postSongToPlaylistHandler(request, h) {
    try{
      this._validator.validatePlaylistSongPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: userId } = request.auth.credentials;
  
      await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
      await this._songsService.verifySongExists(songId);
      await this._playlistsService.addSongOnPlaylist(playlistId, songId, userId);
  
      const response = h.response({
        status: 'success',
        message: 'success add song to playlist',
      });
      response.code(201);
      return response;

    }catch(error){
      console.log(error);
      return responseError(error, h)
    }
  }

  async getPlaylistByIdHandler(request, h) {
    try{
      const { id: playlistId } = request.params;
      const { id: userId } = request.auth.credentials;
  
      await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
      const playlist = await this._playlistsService.getPlaylistById(playlistId);
  
      return {
        status: 'success',
        data: {
          playlist,
        },
      };

    }catch(error){
      return responseError(error, h);
    }
  }

  async deleteSongFromPlaylistHandler(request, h) {
    try{
      this._validator.validatePlaylistSongPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: userId } = request.auth.credentials;
  
      await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
      await this._playlistsService.deleteSongOnPlaylist(playlistId, songId, userId);
  
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };

    }catch(error){
      return responseError(error, h)
    }
  }

  async getPlaylistActivitiesHandler(request, h) {
    try{
      const { id: playlistId } = request.params;
      const { id: userId } = request.auth.credentials;
  
      await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
      const playlistActivities = await this._playlistsService.getPlaylistActivitiesById(playlistId);
  
      return {
        status: 'success',
        data: {
          playlistId,
          activities: playlistActivities,
        },
      };

    }catch(error){
      return responseError(error, h)
    }
  }
}

module.exports = PlaylistsHandler