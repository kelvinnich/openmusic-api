const  Hapi  = require('@hapi/hapi')
const  Jwt  = require('@hapi/jwt')
require('dotenv').config();

//album
const albums = require('./api/openMusic/albums');
const albumValidates = require('./helper/validation/albums');
const AlbumsService = require('./service/albumService/albumService');

//songs
const songs = require('./api/openMusic/songs'); 
const songsValidates = require('./helper/validation/songs');
const SongsServices = require ('./service/songService/songsService');

//auth
const authentications = require('./api/openMusic/authentications');
const TokenManager = require('./Tokenize/TokenManager');
const AuthenticationsValidator = require('./helper/validation/authentacations');
const AuthenticationsServices = require('./service/authentications/AuthenticationsService');

//users
const users = require('./api/openMusic/users')
const UsersValidator = require('./helper/validation/users');
const UsersServices = require('./service/users/UsersServices')

// playlists
const PlaylistsService = require('./service/playListService/PlayListServices');
const PlaylistsValidator = require('./helper/validation/playlist');
const playlist = require('./api/openMusic/playlist');

//collaborations
const CollaborationsService = require('./service/collaborations/Collaborations');
const collaborations = require('./api/openMusic/collaborations');
const CollaborationssValidator = require('./helper/validation/collaborations');



const run = async () => {
  const collaborationsService = new CollaborationsService();
  const albumsService = new AlbumsService();
  const songsService = new SongsServices();
  const usersService = new UsersServices();
  const authenticationsService = new AuthenticationsServices();
  const playlistsService = new PlaylistsService(collaborationsService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  
  await server.register([
    {
      plugin: Jwt,
    },
  ]);
    
  server.auth.strategy('openmusicapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: albumValidates
      }
    },

    {
      plugin: songs,
      options: {
        service: songsService,
        validator: songsValidates,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationssValidator,
      },
    },
    {
      plugin: playlist,
      options: {
        playlistsService,
        songsService,
        validator: PlaylistsValidator,
      },
    },
  ]);
  
    await server.start();
    console.log(`berjalan di server${server.info.uri}`);
};

run();

