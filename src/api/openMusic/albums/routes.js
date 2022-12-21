const routes = (handler) => [
    {
      method: 'POST',
      path: '/albums',
      handler: handler.addAlbums,
    },
    {
      method: 'GET',
      path: '/albums/{id}',
      handler: handler.getAlbumsByIdHandler,
    },
    {
      method: 'PUT',
      path: '/albums/{id}',
      handler: handler.editAlbumByIdHandler,
    },
    {
      method: 'DELETE',
      path: '/albums/{id}',
      handler: handler.deleteAlbumByIdhandler,
    },
  ];
  
  module.exports = routes;