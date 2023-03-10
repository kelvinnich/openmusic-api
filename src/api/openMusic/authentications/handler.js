const responseError = require("../../../helper/utils/responseErr");

class AuthenticationsHanlder {
  constructor(authentcationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authentcationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }
  

  async postAuthenticationHandler(request, h) {
    try{
      this._validator.validatePostAuthenticationPayload(request.payload);
  
      const { username, password } = request.payload;
      const id = await this._usersService.verifyUserCredential(username, password)
  
      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });
  
      await this._authenticationsService.addRefreshToken(refreshToken);
      
          const response = h.response({
            status: 'success',
            message: 'success to authentication',
            data: {
              accessToken,
              refreshToken,
            },
          });
          response.code(201);
          return response;
    }catch(error){
      console.log(error);
      return responseError(error, h)
    }
  }

  async putAuthenticationHandler(request, h) {
    try{
      this._validator.validatePutAuthenticationPayload(request.payload);
  
      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
  
      const accessToken = this._tokenManager.generateAccessToken({ id });
      return {
        status: 'success',
        message: 'Access Token updated successfully',
        data: {
          accessToken,
        },
      };

    }catch(error){
      return responseError(error, h);
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try{
      this._validator.validateDeleteAuthenticationPayload(request.payload);
  
      const { refreshToken } = request.payload;
  
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);
  
      return {
        status: 'success',
        message: 'Refresh token removed successfully',
      };
    }catch(error){
      return responseError(error, h)
    }
    }
}

module.exports = AuthenticationsHanlder;