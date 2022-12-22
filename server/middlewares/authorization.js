const jwt = require('jsonwebtoken');
const taskModel = require('../models/task');

const authorization = {
  admin: async (req, res, next) => {
    try {
      const token = req.query.token || req.headers['x-access-token'] || null;
      jwt.verify(token, process.env.SECRET_KEY, async (error, payload) => {
        if (payload.data && payload.data.role.toUpperCase() === 'ADMIN') {
          console.log('\x1b[36m%s\x1b[0m', 'authorization', {payload});
          return next();
        } else {
          return res.status(401).json({
            status: false,
            msg: {
              en: 'Permission denied! Only admin is allowed to access this enpoint!',
              vn: 'Bạn không có quyền truy cập.',
            },
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        statusCode: 500,
        msg: {en: 'Interal Server Error'},
        error: error.message,
      });
    }
  },
  manager: async (req, res, next) => {
    try {
      const token = req.query.token || req.headers['x-access-token'] || null;
      jwt.verify(token, process.env.SECRET_KEY, async (error, payload) => {
        if (
          payload.data.role.toUpperCase() === 'ADMIN' ||
          payload.data.role.toUpperCase() === 'MANAGER'
        ) {
          console.log('\x1b[36m%s\x1b[0m', 'authorization', {payload});
          return next();
        } else {
          return res.status(401).json({
            status: false,
            msg: {
              en: 'Permission denied!',
              vn: 'Bạn không có quyền truy cập.',
            },
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        statusCode: 500,
        msg: {en: 'Interal Server Error'},
        error: error.message,
      });
    }
  },
  checkAction: async (req, res, next) => {
    try {
      const token = req.query.token || req.headers['x-access-token'] || null;
      const taskID = req.params.taskID || null;
      const taskQuery = await taskModel.findOne({taskID});
      if (!taskQuery) {
        return res.status(404).json({
          status: false,
          statusCode: 404,
          msg: {
            en: 'This task cannot be found or has been done, please contact admin!',
            vn: 'Không tìm thấy công việc này hoặc công việc đã được hoàn thành, vui lòng liên hệ quản trị viên!',
          },
        });
      } else {
        jwt.verify(token, process.env.SECRET_KEY, async (error, payload) => {
          const isAccess = taskQuery.memberList.find(
            element => element.userCode === payload.data.userCode,
          );
          if (!isAccess) {
            return res.status(401).json({
              status: false,
              statusCode: 401,
              msg: {
                en: 'You do not have permission to act this task.',
                vn: 'Bạn không có quyền thực hiện công việc này.',
              },
            });
          } else {
            if (taskQuery.isDone) {
              return res.status(200).json({
                status: false,
                statusCode: 200,
                msg: {
                  en: 'This task has been marked as done, please contact store manager.',
                  vn: 'Không thực hiện được, công việc này đã được đánh dấu là hoàn thành, vui lòng liên hệ cửa hàng trưởng.',
                },
              });
            } else {
              return next();
            }
          }
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        statusCode: 500,
        msg: {en: 'Interal Server Error'},
        error: error.message,
      });
    }
  },
};

module.exports = authorization;
