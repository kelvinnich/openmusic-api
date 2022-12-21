const { ClientError } = require("../exception/ClientError");

const responseError = (error, h) => {
    if (error instanceof ClientError) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(error.statusCode);
    }
    return h.response({
      status: 'error',
      message: error.message,
    }).code(500);
  };

  module.exports = responseError