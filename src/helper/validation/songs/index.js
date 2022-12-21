const { InvariantError } = require("../../exception/InvariantError");
const songsPayloadSchema = require("./schema");

const songsValidates = {
    validateSongsPayload: (payload) => {
        let err = songsPayloadSchema.validate(payload);
        if(err.error){
          throw new InvariantError(err.error.message)
        }
      }
}

module.exports = songsValidates