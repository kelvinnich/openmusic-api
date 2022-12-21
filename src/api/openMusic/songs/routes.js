const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: handler.addSongsHandler
    },

    {
        method: 'GET',
        path: '/songs',
        handler: handler.getAllSongsHandler,
    },

    {
        method: 'GET',
        path: '/songs/{id}',
        handler: handler.getSongbyIdHandler
    },

    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: handler.putSongsByIdHandler
    },

    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: handler.deleteSongsByIdHandler
    }


]

module.exports = routes