const markersController = require('../controllers/markersController');

module.exports = app => {
    app.post(
        '/markers/list',
        markersController.markersList
    );
    app.post(
        '/markers/info',
        markersController.markersInfo
    );
    app.post(
        '/markers',
        markersController.markers
    );
    app.post(
        '/markers/filtered',
        markersController.markersFiltered
    );
    app.post(
        '/markers/update',
        markersController.markersUpdate
    );
};