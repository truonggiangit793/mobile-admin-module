const apiRoute = require('./api');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../services/swagger_output.json');
module.exports = function route(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  app.use('/api/v1', apiRoute);
};
