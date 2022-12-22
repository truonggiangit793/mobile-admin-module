require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerAutogen = require('swagger-autogen')();
const cors = require('cors');
const defineRoute = require('./routes/index');
const db = require('./configs/database');
const ip = require('ip');
const app = express();

db.connect();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

const outputFile = '../services/swagger_output.json';
const endpointsFiles = ['../routes/api.js'];
const doc = {
  info: {
    title: 'Mobile RESTful API Service Document',
  },
  host: `${ip.address()}:${process.env.PORT}/api/v1`,
  schemes: ['http', 'https'],
};
swaggerAutogen(outputFile, endpointsFiles, doc);

defineRoute(app);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json({
    status: false,
    statusCode: err.status || 500,
    msg: {
      en: err.message,
    },
  });
});

module.exports = app;
