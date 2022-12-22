const bcrypt = require('bcrypt');
const validator = require('email-validator');
const jwt = require('jsonwebtoken');
const xlsxFile = require('read-excel-file/node');
const phoneNumberValidator = require('validate-phone-number-node-js');
const excel = require('excel4node');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const workbook = new excel.Workbook();
const worksheet = workbook.addWorksheet('Sheet');

const accountModel = require('../../models/account');
const taskModel = require('../../models/task');
const taskDetailModel = require('../../models/task-detail');
const adminConfig = require('../../configs/adminConfig');

const dir = path.resolve(__dirname, '../', '../', 'tmp');
!fs.existsSync(dir) ? fs.mkdirSync(dir) : null;
const exportedFile = dir + `/tmp.xlsx`;
const titleStyle = workbook.createStyle({
  font: {color: '#000000', size: 12, bold: true},
});

const pipFileStream = res => {
  workbook.write(exportedFile, (err, stats) => {
    if (!err) {
      var filename = path.basename(exportedFile);
      var mimetype = mime.lookup(exportedFile);
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);
      var filestream = fs.createReadStream(exportedFile);
      filestream.pipe(res);
    } else {
      res.end('An error occured, please refesh this page!');
    }
  });
};

module.exports = {
  accountLogin: async (req, res, next) => {
    // #swagger.tags = ['Accounts']
    // #swagger.description = 'This endpoint provides method for logging in system. Then receive an access token.'
    try {
      const userCode = req.body.userCode
        ? req.body.userCode.toUpperCase()
        : null;
      const password = req.body.password
        ? req.body.password.toUpperCase()
        : null;
      if (!userCode)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'User account is required.',
            vn: 'Tài khoản đăng nhập là bắt buộc.',
          },
        });
      if (!password)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Password is required.',
            vn: 'Mật khẩu đăng nhập là bắt buộc.',
          },
        });
      const accountQuery = await accountModel.findOne({userCode});
      if (accountQuery) {
        const validPassword = bcrypt.compareSync(
          password,
          accountQuery.password,
        );
        const lastLogin = new Date();
        const payload = {
          userCode: accountQuery.userCode,
          fullName: accountQuery.fullName,
          email: accountQuery.email,
          phoneNumber: accountQuery.phoneNumber,
          role: accountQuery.role,
          lastLogin,
        };
        if (validPassword) {
          const jwtSignature = jwt.sign(
            {
              // Set the expiration upto 1 day
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
              data: payload,
            },
            process.env.SECRET_KEY,
          );
          await accountModel.findOneAndUpdate(
            {userCode},
            {access_token: jwtSignature, lastLogin},
          );
          return res.status(200).json({
            status: true,
            statusCode: 200,
            msg: {en: 'Login successfully!', vn: 'Đăng nhập thành công.'},
            token: jwtSignature,
            payload,
          });
        } else {
          return res.status(401).json({
            status: false,
            statusCode: 401,
            msg: {en: 'Invalid password!', vn: 'Mật khẩu không hợp lệ.'},
          });
        }
      } else {
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {en: 'Account does not exist!', vn: 'Tài khoản không tồn tại.'},
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
  accountImport: async (req, res, next) => {
    /*
            #swagger.tags = ['Accounts']
            #swagger.consumes = ['multipart/form-data']  
            #swagger.description = 'Admin can user this endpoint for importing list of accounts to database instead of register for each one.'
            #swagger.parameters['file'] = {
                in: 'formData',
                type: 'file',
                required: 'true',
                description: 'Upload excel file data. Only excel format is allowed.',
            } 
        */
    const rows = await xlsxFile(req.file.path);

    if (
      rows[0][0].toUpperCase() !== 'USER CODE' ||
      rows[0][1].toUpperCase() !== 'FULLNAME' ||
      rows[0][2].toUpperCase() !== 'EMAIL' ||
      rows[0][3].toUpperCase() !== 'PHONE NUMBER' ||
      rows[0][4].toUpperCase() !== 'PASSWORD' ||
      rows[0][5].toUpperCase() !== 'ROLE'
    )
      return res.status(200).json({
        status: false,
        statusCode: 200,
        msg: {
          en: 'Invalid format excel file.',
          vn: 'Tập tin excel không đúng cấu trúc.',
        },
      });
    try {
      rows.forEach(async (element, index) => {
        if (index > 0) {
          await accountModel.findOneAndUpdate(
            {userCode: element[0].toUpperCase()},
            {
              fullName: element[1].toUpperCase(),
              email: element[2],
              phoneNumber: element[3],
              password: bcrypt.hashSync(
                element[4].toUpperCase(),
                bcrypt.genSaltSync(10),
              ),
              role: element[5]
                ? element[5].toUpperCase() == 'ADMIN'
                  ? 'STAFF'
                  : element[5].toUpperCase()
                : null,
            },
            {upsert: true, new: true, setDefaultsOnInsert: true},
          );
        }
      });
      return res.status(200).json({
        status: true,
        statusCode: 200,
        msg: {
          en: 'All accounts has been import successfully!',
          vn: 'Đã nhập danh sách tài khoản thành công!',
        },
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
  accountRegister: async (req, res, next) => {
    // #swagger.tags = ['Accounts']
    // #swagger.description = 'This endpoint provides method for registering each of account.'
    try {
      const userCode = req.body.userCode
        ? req.body.userCode.toUpperCase()
        : null;
      const fullName = req.body.fullName
        ? req.body.fullName.toUpperCase()
        : null;
      const email = req.body.email || null;
      const phoneNumber = req.body.phoneNumber || null;
      const password = req.body.password
        ? req.body.password.toUpperCase()
        : null;
      const role = req.body.role ? req.body.role.toUpperCase() : null;
      const accountQuery = await accountModel.findOne({userCode});

      if (!userCode)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'User account is required.',
            vn: 'Tài khoản đăng nhập là bắt buộc.',
          },
        });
      if (!fullName)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {en: 'Fullname is required.', vn: 'Họ và tên là bắt buộc.'},
        });
      if (!email || !validator.validate(email))
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Email is required and must be a valid email!',
            vn: 'Email là bắt buộc và phải là email hợp lệ.',
          },
        });
      if (!phoneNumber || !phoneNumberValidator.validate(phoneNumber))
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Phone number is required and must be a valid phone number!',
            vn: 'Số điện thoại là bắt buộc và phải là số điện thoại hợp lệ.',
          },
        });
      if (!password || password.length < 6)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Password is required and must be at least 6 characters!',
            vn: 'Mật khẩu là bắt buộc và phải từ 6 ký tự trở lên.',
          },
        });
      const validRole = role == 'MANAGER' || role == 'STAFF';
      if (!role || !validRole)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Role is required and must be a valid role!',
            vn: 'Phân quyền là bắt buộc và phải là phân quyền hợp lệ.',
          },
        });
      if (accountQuery)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Account has been already existed!',
            vn: 'Tài khoản này đã tồn tại.',
          },
        });
      const newUser = new accountModel({
        userCode,
        fullName,
        email,
        phoneNumber,
        password: bcrypt.hashSync(
          password.toUpperCase(),
          bcrypt.genSaltSync(10),
        ),
        role,
      });
      newUser.save();
      return res.status(200).json({
        status: true,
        statusCode: 200,
        msg: {
          en: `Account name "${fullName}" has been registered successfully!`,
          vn: `Tài khoản "${fullName}" đã được tạo thành công.`,
        },
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
  accountDelete: async (req, res, next) => {
    // #swagger.tags = ['Accounts']
    // #swagger.description = 'Admin can disable any account through this endpoint.'
    try {
      const userCode = req.params.userCode
        ? req.params.userCode.toUpperCase()
        : null;
      const accountQuery = await accountModel.findOne({userCode});
      if (!userCode)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'User account is required.',
            vn: 'Tài khoản đăng nhập là bắt buộc.',
          },
        });
      if (userCode == adminConfig.userCode)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Permission denied. This is ADMIN account.',
            vn: 'Bạn không có quyền để xoá tài khoản này.',
          },
        });

      if (!accountQuery)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Account does not exist!',
            vn: 'Tài khoản này không tồn tại.',
          },
        });
      await accountModel.deleteOne({userCode});
      return res.status(200).json({
        status: true,
        statusCode: 200,
        msg: {
          en: `Account name "${accountQuery.fullName}" has been disabled.`,
          vn: `Tài khoản "${accountQuery.fullName}" đã được vô hiệu hoá.`,
        },
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
  accountGetProfile: async (req, res, next) => {
    // #swagger.tags = ['Accounts']
    // #swagger.description = 'The server response the personal information of the current session.'
    try {
      const token = req.query.token || req.headers['x-access-token'];
      jwt.verify(token, process.env.SECRET_KEY, async (error, payload) => {
        const accountQuery = await accountModel.findOne({
          userCode: payload.data.userCode.toUpperCase(),
        });
        return res.status(200).json({
          status: true,
          statusCode: 200,
          msg: {
            en: 'Get personal information successfully!',
            vn: 'Tải thông tin cá nhân thành công!',
          },
          data: accountQuery,
        });
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
  accountUpdateMe: async (req, res, next) => {
    // #swagger.tags = ['Accounts']
    // #swagger.description = 'Users of the system can update their information by calling this api .'
    try {
      const token = req.query.token || req.headers['x-access-token'];
      jwt.verify(token, process.env.SECRET_KEY, async (error, payload) => {
        const accountQuery = await accountModel.findOne({
          userCode: payload.data.userCode.toUpperCase(),
        });
        await accountModel.findOneAndUpdate(
          {userCode: payload.data.userCode},
          {
            email: req.body.email || accountQuery.email,
            fullName: req.body.fullName
              ? req.body.fullName.toUpperCase()
              : null || accountQuery.fullName,
            phoneNumber: req.body.phoneNumber || accountQuery.phoneNumber,
          },
          {upsert: true, new: true, setDefaultsOnInsert: true},
        );
        return res.status(200).json({
          status: true,
          statusCode: 200,
          msg: {
            en: `Account name "${accountQuery.fullName}" has been updated successfully!`,
            vn: `Tài khoản "${accountQuery.fullName}" đã được cập nhật thông tin thành công.`,
          },
          data: {
            userCode: accountQuery.userCode,
            email: req.body.email || accountQuery.email,
            fullName: req.body.fullName
              ? req.body.fullName.toUpperCase()
              : null || accountQuery.fullName,
            phoneNumber: req.body.phoneNumber || accountQuery.phoneNumber,
            role: accountQuery.role,
            lastLogin: accountQuery.lastLogin,
          },
        });
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
  accountChangePassword: async (req, res, next) => {
    // #swagger.tags = ['Accounts']
    // #swagger.description = 'This endpoint allows user can change their password and refresh their access token.'
    try {
      const token = req.query.token || req.headers['x-access-token'];
      const oldPassword = req.body.oldPassword
        ? req.body.oldPassword.toUpperCase()
        : null;
      const newPassword = req.body.newPassword
        ? req.body.newPassword.toUpperCase()
        : null;
      const repeatPassword = req.body.repeatPassword
        ? req.body.repeatPassword.toUpperCase()
        : null;
      if (!oldPassword)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Old password is required.',
            vn: 'Mật khẩu cũ là bắt buộc.',
          },
        });
      if (!newPassword || newPassword.length < 6)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'New password is required and must be at least 6 characters.',
            vn: 'Mật khẩu mới không được để trống và phải ít nhất 6 ký tự.',
          },
        });
      if (!repeatPassword || newPassword !== repeatPassword)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Repeat password is required and must be matched new password.',
            vn: 'Mật khẩu xác nhận không được để trống và phải khớp với mật khẩu mới.',
          },
        });
      jwt.verify(token, process.env.SECRET_KEY, async (error, payload) => {
        const accountQuery = await accountModel.findOne({
          userCode: payload.data.userCode.toUpperCase(),
        });
        if (!bcrypt.compareSync(oldPassword, accountQuery.password))
          return res.status(200).json({
            status: false,
            statusCode: 200,
            msg: {
              en: 'Old password is incorrect.',
              vn: 'Mật khẩu cũ không đúng.',
            },
          });
        const jwtSignature = jwt.sign(
          {
            // Set the expiration upto 1 day
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            data: {
              userCode: accountQuery.userCode,
              fullName: accountQuery.fullName,
              email: accountQuery.email,
              phoneNumber: accountQuery.phoneNumber,
              role: accountQuery.role,
            },
          },
          process.env.SECRET_KEY,
        );
        await accountModel.findOneAndUpdate(
          {userCode: payload.data.userCode},
          {
            password: bcrypt.hashSync(
              repeatPassword.toUpperCase(),
              bcrypt.genSaltSync(10),
            ),
            access_token: jwtSignature,
          },
          {upsert: true, new: true, setDefaultsOnInsert: true},
        );
        return res.status(200).json({
          status: true,
          statusCode: 200,
          msg: {
            en: `Password of "${accountQuery.fullName}" has been updated successfully!`,
            vn: `Mật khẩu của tài khoản "${accountQuery.fullName}" đã được cập nhật thành công.`,
          },
          token: jwtSignature,
        });
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
  accountGetAll: async (req, res, next) => {
    // #swagger.tags = ['Accounts']
    // #swagger.description = 'Admin can list of all accounts by using this endpoint.'
    try {
      const accountList = await accountModel.find({});
      if (accountList.length > 0) {
        return res.status(200).json({
          status: true,
          statusCode: 200,
          msg: {
            en: 'Get list of all accounts.',
            vn: 'Danh sách tất cả tài khoản.',
          },
          result: {
            total: accountList.length,
            data: accountList,
          },
        });
      } else {
        return res.status(200).json({
          status: true,
          statusCode: 200,
          msg: {
            en: 'There is no data.',
            vn: 'Danh sách trống, không có dữ liệu nào.',
          },
          result: [],
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
  accountDownloadExample: async (req, res, next) => {
    // #swagger.tags = ['Accounts']
    // #swagger.description = 'Render and dowload the example excel file for importing accounts.'
    worksheet.cell(1, 1).string('User Code').style(titleStyle);
    worksheet.cell(1, 2).string('Fullname').style(titleStyle);
    worksheet.cell(1, 3).string('Email').style(titleStyle);
    worksheet.cell(1, 4).string('Phone Number').style(titleStyle);
    worksheet.cell(1, 5).string('Password').style(titleStyle);
    worksheet.cell(1, 6).string('Role').style(titleStyle);
    pipFileStream(res);
  },
  accountGetTaskAll: async (req, res, next) => {
    // #swagger.tags = ['Accounts']
    try {
      const token = req.query.token || req.headers['x-access-token'];
      jwt.verify(token, process.env.SECRET_KEY, async (error, payload) => {
        const accountQuery = await accountModel.findOne({
          userCode: payload.data.userCode.toUpperCase(),
        });
        const taskQuery = await taskModel.find({});
        if (taskQuery.length <= 0) {
          return res.status(200).json({
            status: true,
            statusCode: 200,
            msg: {en: 'There is no task data.', vn: 'Không có công việc nào.'},
          });
        } else {
          let taskList = [];
          taskQuery.forEach(task => {
            const isAdded = task.memberList.find(
              element => element.userCode === accountQuery.userCode,
            );
            if (isAdded) taskList.push(task);
          });
          if (taskList.length <= 0) {
            return res.status(200).json({
              status: true,
              statusCode: 200,
              msg: {
                en: 'There is no task data.',
                vn: 'Không có công việc nào.',
              },
            });
          } else {
            return res.status(200).json({
              status: true,
              statusCode: 200,
              msg: {
                en: 'Get your all task!',
                vn: 'Danh sách công việc của bạn.',
              },
              data: {
                total: taskList.length,
                taskList,
              },
            });
          }
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
  accountGetTaskCurrent: async (req, res, next) => {
    // #swagger.tags = ['Accounts']
    try {
      const token = req.query.token || req.headers['x-access-token'];
      jwt.verify(token, process.env.SECRET_KEY, async (error, payload) => {
        const accountQuery = await accountModel.findOne({
          userCode: payload.data.userCode.toUpperCase(),
        });
        const taskQuery = await taskModel.find({isDone: false});
        if (taskQuery.length <= 0) {
          return res.status(200).json({
            status: true,
            statusCode: 200,
            msg: {en: 'There is no task data.', vn: 'Không có công việc nào.'},
          });
        } else {
          let taskList = [];
          taskQuery.forEach(task => {
            const isAdded = task.memberList.find(
              element => element.userCode === accountQuery.userCode,
            );
            if (isAdded) taskList.push(task);
          });
          if (taskList.length <= 0) {
            return res.status(200).json({
              status: true,
              statusCode: 200,
              msg: {
                en: 'There is no task data.',
                vn: 'Không có công việc nào.',
              },
            });
          } else {
            return res.status(200).json({
              status: true,
              statusCode: 200,
              msg: {
                en: 'Get your all task!',
                vn: 'Danh sách công việc của bạn.',
              },
              data: {
                total: taskList.length,
                taskList,
              },
            });
          }
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
  accountGetTaskDone: async (req, res, next) => {
    // #swagger.tags = ['Accounts']
    try {
      const token = req.query.token || req.headers['x-access-token'];
      jwt.verify(token, process.env.SECRET_KEY, async (error, payload) => {
        const accountQuery = await accountModel.findOne({
          userCode: payload.data.userCode.toUpperCase(),
        });
        const taskQuery = await taskModel.find({isDone: true});
        if (taskQuery.length <= 0) {
          return res.status(200).json({
            status: true,
            statusCode: 200,
            msg: {en: 'There is no task data.', vn: 'Không có công việc nào.'},
          });
        } else {
          let taskList = [];
          taskQuery.forEach(task => {
            const isAdded = task.memberList.find(
              element => element.userCode === accountQuery.userCode,
            );
            if (isAdded) taskList.push(task);
          });
          if (taskList.length <= 0) {
            return res.status(200).json({
              status: true,
              statusCode: 200,
              msg: {
                en: 'There is no task data.',
                vn: 'Không có công việc nào.',
              },
            });
          } else {
            return res.status(200).json({
              status: true,
              statusCode: 200,
              msg: {
                en: 'Get your all task!',
                vn: 'Danh sách công việc của bạn.',
              },
              data: {
                total: taskList.length,
                taskList,
              },
            });
          }
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
  accountGetTaskDetail: async (req, res, next) => {
    // #swagger.tags = ['Accounts']
    try {
      const token = req.query.token || req.headers['x-access-token'];
      const taskID = req.params.taskID || null;
      const taskQuery = await taskModel.findOne({taskID});
      const taskDetailQuery = await taskDetailModel.findOne({taskID});
      if (!taskQuery || !taskDetailQuery)
        return res.status(404).json({
          status: false,
          statusCode: 404,
          msg: {
            en: 'This task cannot be found or has been done, please contact admin!',
            vn: 'Không tìm thấy công việc này hoặc công việc đã được hoàn thành, vui lòng liên hệ quản trị viên!',
          },
        });
      jwt.verify(token, process.env.SECRET_KEY, async (error, payload) => {
        let myList = [];
        const productTrackedList =
          taskDetailQuery.productTracked.length > 0
            ? taskDetailQuery.productTracked
            : [];
        if (productTrackedList.length > 0) {
          productTrackedList.forEach(element => {
            if (element.userCode == payload.data.userCode) {
              myList.push(element);
            }
          });
        }
        return res.status(200).json({
          status: true,
          statusCode: 200,
          msg: {
            en: `Detail of task "${taskQuery.taskName}".`,
            vn: `Thông tin chi tiết của công việc "${taskQuery.taskName}".`,
          },
          data: {
            taskID: taskQuery.taskID,
            taskName: taskQuery.taskName,
            memberList: taskQuery.memberList,
            yourProductTrackedList: {
              total: myList.length,
              list: myList,
            },
          },
        });
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
};
