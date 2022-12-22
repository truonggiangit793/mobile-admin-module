const Router = require('express').Router();
const authorization = require('../middlewares/authorization');
const authentication = require('../middlewares/authentication');
const multerService = require('../services/multer');

const {
  accountLogin,
  accountImport,
  accountRegister,
  accountGetProfile,
  accountDelete,
  accountGetAll,
  accountUpdateMe,
  accountChangePassword,
  accountDownloadExample,
  accountGetTaskAll,
  accountGetTaskCurrent,
  accountGetTaskDone,
  accountGetTaskDetail,
} = require('./modules/accounts');

const {
  productImport,
  productRegister,
  productGetDetail,
  productGetAll,
  productDelete,
  productDownloadExample,
} = require('./modules/products');

const {
  taskNew,
  taskAddMember,
  taskGetAll,
  taskGetDetail,
  taskDelete,
  taskAction,
  taskMarkDone,
  taskUndoAction,
  taskExport,
} = require('./modules/tasks');

/**
 * Account ================================================================
 */

Router.post('/account/login', accountLogin);

Router.post(
  '/account/import',
  authentication,
  authorization.manager,
  multerService,
  accountImport,
);

Router.post(
  '/account/register',
  authentication,
  authorization.manager,
  accountRegister,
);

Router.delete(
  '/account/:userCode/delete',
  authentication,
  authorization.manager,
  accountDelete,
);

Router.get('/account/me', authentication, accountGetProfile);

Router.get('/account/my-task/all', authentication, accountGetTaskAll);

Router.get('/account/my-task/current', authentication, accountGetTaskCurrent);

Router.get('/account/my-task/done', authentication, accountGetTaskDone);

Router.get(
  '/account/my-task/:taskID/detail',
  authentication,
  // authorization.checkAction,
  accountGetTaskDetail,
);

Router.put('/account/update-me', authentication, accountUpdateMe);

Router.put('/account/change-password', authentication, accountChangePassword);

Router.get(
  '/account/get-all',
  authentication,
  authorization.manager,
  accountGetAll,
);

Router.get(
  '/account/download-example',
  authentication,
  authorization.manager,
  accountDownloadExample,
);

/**
 * Product ================================================================
 */

Router.post(
  '/product/import',
  authentication,
  authorization.admin,
  multerService,
  productImport,
);

Router.post(
  '/product/register',
  authentication,
  authorization.admin,
  productRegister,
);

Router.get('/product/get-detail', authentication, productGetDetail);

Router.get('/product/get-all', authentication, productGetAll);

Router.delete(
  '/product/:barcode/delete',
  authentication,
  authorization.admin,
  productDelete,
);

Router.get(
  '/product/download-example',
  authentication,
  authorization.manager,
  productDownloadExample,
);

/**
 * Task ================================================================
 */

Router.post('/task/new', authentication, authorization.manager, taskNew);

Router.get('/task/get-all', authentication, authorization.manager, taskGetAll);

Router.post(
  '/task/:taskID/add-members',
  authentication,
  authorization.manager,
  authorization.checkAction,
  taskAddMember,
);

Router.get(
  '/task/:taskID/detail',
  authentication,
  authorization.manager,
  taskGetDetail,
);

Router.delete(
  '/task/:taskID/delete',
  authentication,
  authorization.manager,
  taskDelete,
);

Router.post(
  '/task/:taskID/action',
  authentication,
  authorization.checkAction,
  taskAction,
);

Router.post(
  '/task/:taskID/export',
  authentication,
  authorization.manager,
  taskExport,
);

Router.post(
  '/task/:taskID/undo-action',
  authentication,
  authorization.checkAction,
  taskUndoAction,
);

Router.post(
  '/task/:taskID/mark-done',
  authentication,
  authorization.manager,
  taskMarkDone,
);

module.exports = Router;
