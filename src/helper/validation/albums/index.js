const { InvariantError } = require("../../exception/InvariantError");
const { albumsPayloadSchema } = require("./schema");


const albumValidates = {
  validatesAlbumPayload: (payload) => {
    const err = albumsPayloadSchema.validate(payload);
    if (err.error) {
      throw new InvariantError(err.error.message);
    }
  },
};

module.exports = albumValidates;