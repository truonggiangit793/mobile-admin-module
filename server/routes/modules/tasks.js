const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const taskModel = require('../../models/task');
const productModel = require('../../models/product');
const accountModel = require('../../models/account');
const taskDetailModel = require('../../models/task-detail');
const {v4: uidGenerate} = require('uuid');
const mime = require('mime');
const excel = require('excel4node');
const workbook = new excel.Workbook();

module.exports = {
  taskNew: async (req, res, next) => {
    // #swagger.tags = ['Tasks']
    try {
      const taskID = uidGenerate();
      const taskName = req.body.taskName
        ? req.body.taskName.toUpperCase()
        : null;
      const taskQuery = await taskModel.findOne({taskName});
      if (!taskName) {
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Task name is required!',
            vn: 'Tên công việc không được trống!',
          },
        });
      }
      if (taskQuery) {
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'This task is already exists!',
            vn: 'Tên công việc này đã tồn tại, tên công việc là duy nhất!',
          },
        });
      }
      const task = new taskModel({taskID, taskName});
      const taskDetail = new taskDetailModel({taskID});
      task.save();
      taskDetail.save();
      return res.status(200).json({
        status: true,
        statusCode: 200,
        msg: {
          en: "A task has been create successfully! Let's invite members to join this task.",
          vn: 'Một công việc mới đã được tạo, hãy bắt đầu thêm thành viên thực hiện công việc này!',
        },
        task,
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
  taskGetAll: async (req, res, next) => {
    // #swagger.tags = ['Tasks']
    try {
      const taskList = await taskModel.find({}).sort({createdAt: -1});
      if (taskList.length > 0) {
        return res.status(200).json({
          status: true,
          statusCode: 200,
          msg: {
            en: 'Get list of all tasks.',
            vn: 'Danh sách tất cả các công việc.',
          },
          result: {
            total: taskList.length,
            data: taskList,
          },
        });
      } else {
        return res.status(200).json({
          status: false,
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
  taskAddMember: async (req, res, next) => {
    // #swagger.tags = ['Tasks']
    try {
      const taskID = req.params.taskID || null;
      const userCode = req.body.userCode
        ? req.body.userCode.toUpperCase()
        : null;
      const taskQuery = await taskModel.findOne({taskID});
      const accountQuery = await accountModel.findOne({userCode});
      if (!taskQuery)
        return res.status(404).json({
          status: false,
          statusCode: 404,
          msg: {
            en: 'This task cannot be found or has been done, please contact admin!',
            vn: 'Không tìm thấy công việc này hoặc công việc đã được hoàn thành, vui lòng liên hệ quản trị viên!',
          },
        });
      if (!userCode)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'User account is required.',
            vn: 'Tên tài khoản là bắt buộc.',
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
      let memberList =
        taskQuery.memberList.length > 0 ? taskQuery.memberList : [];
      const existedMember = memberList.find(
        element => element.userCode === accountQuery.userCode,
      );
      if (existedMember) {
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: `${accountQuery.fullName} has been joined this task before!`,
            vn: `${accountQuery.fullName} đã được thêm vào công việc này trước đó.`,
          },
        });
      } else {
        memberList.push({
          userCode: userCode.toUpperCase(),
          fullName: accountQuery.fullName,
        });
        await taskModel.findOneAndUpdate({taskID}, {memberList});
        return res.status(200).json({
          status: true,
          statusCode: 200,
          msg: {
            en: `${accountQuery.fullName} has been added to this task!`,
            vn: `${accountQuery.fullName} đã được thêm vào công việc này.`,
          },
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
  taskDelete: async (req, res, next) => {
    // #swagger.tags = ['Tasks']
    try {
      const taskID = req.params.taskID || null;
      const taskQuery = await taskModel.findOne({taskID});
      const taskDetailQuery = await taskDetailModel.findOne({taskID});
      if (!taskQuery || !taskDetailQuery) {
        return res.status(404).json({
          status: false,
          statusCode: 404,
          msg: {
            en: 'This task cannot be found or has been done, please contact admin!',
            vn: 'Không tìm thấy công việc này hoặc công việc đã được hoàn thành, vui lòng liên hệ quản trị viên!',
          },
        });
      } else {
        await taskModel.deleteOne({taskID});
        await taskDetailModel.deleteOne({taskID});
        return res.status(200).json({
          status: true,
          statusCode: 200,
          msg: {
            en: `Task "${taskQuery.taskName}" has been deleted.`,
            vn: `Công việc "${taskQuery.taskName}" đã được xoá.`,
          },
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
  taskGetDetail: async (req, res, next) => {
    // #swagger.tags = ['Tasks']
    try {
      const taskID = req.params.taskID || null;
      const taskQuery = await taskModel.findOne({taskID});
      const taskDetailQuery = await taskDetailModel.findOne({taskID});
      if (!taskDetailQuery || !taskQuery) {
        return res.status(404).json({
          status: false,
          statusCode: 404,
          msg: {
            en: 'This task cannot be found, please contact admin!',
            vn: 'Không tìm thấy công việc này, vui lòng liên hệ quản trị viên!',
          },
        });
      } else {
        return res.status(200).json({
          status: true,
          statusCode: 200,
          msg: {
            en: `Detail of task "${taskQuery.taskName}".`,
            vn: `Thông tin chi tiết của công việc "${taskQuery.taskName}"`,
          },
          task: {
            taskID: taskQuery.taskID,
            taskName: taskQuery.taskName,
            memberList: taskQuery.memberList,
            isDone: taskQuery.isDone,
            productTracked: {
              total: taskDetailQuery.productTracked.length,
              list: taskDetailQuery.productTracked,
            },
          },
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
  taskAction: async (req, res, next) => {
    // #swagger.tags = ['Tasks']
    try {
      const token = req.query.token || req.headers['x-access-token'];
      const taskID = req.params.taskID || null;
      const barcode = req.body.barcode ? req.body.barcode.toUpperCase() : null;
      let quantity = req.body.quantity ? parseInt(req.body.quantity) : 0;
      const expiredDate = req.body.expiredDate || null;
      const taskDetailQuery = await taskDetailModel.findOne({taskID});
      const productQuery = await productModel.findOne({barcode});
      jwt.verify(token, process.env.SECRET_KEY, async (error, payload) => {
        let productTrackedList =
          taskDetailQuery.productTracked.length > 0
            ? taskDetailQuery.productTracked
            : [];
        if (!barcode)
          return res.status(200).json({
            status: false,
            statusCode: 200,
            msg: {
              en: 'Barcode is required.',
              vn: 'Mã vạch sản phẩm là bắt buộc',
            },
          });
        if (!productQuery)
          return res.status(404).json({
            status: false,
            statusCode: 404,
            msg: {
              en: `Product barcode "${barcode}" not found or has been removed, contact developer for more detail!`,
              vn: `Không tìm thấy mã vạch sản phẩm "${barcode}", hoặc đã bị gỡ bỏ, vui lòng liên hệ quản trị viên.`,
            },
          });
        if (!quantity || quantity <= 0)
          return res.status(200).json({
            status: false,
            statusCode: 200,
            msg: {
              en: 'Quantity of product is required and must be more than 1.',
              vn: 'Số lượng sản phẩm là bắt buộc và phải lớn hơn 0.',
            },
          });
        if (!expiredDate)
          return res.status(200).json({
            status: false,
            statusCode: 200,
            msg: {
              en: 'Expired date is required and must be a valid date.',
              vn: 'Hạn sử dụng là bắt buộc và phải là ngày hợp lệ.',
            },
          });
        if (productTrackedList.length <= 0) {
          productTrackedList.push({
            userCode: payload.data.userCode,
            fullName: payload.data.fullName,
            barcode: productQuery.barcode,
            productName: productQuery.productName,
            quantity: quantity,
            expiredDate: expiredDate,
          });
        } else {
          const isExist = taskDetailQuery.productTracked.find(
            element =>
              element.userCode == payload.data.userCode &&
              element.barcode == barcode &&
              element.expiredDate == expiredDate,
          );
          if (isExist) {
            productTrackedList = productTrackedList.map(element => {
              if (element.userCode == payload.data.userCode) {
                if (
                  element.barcode == barcode &&
                  element.expiredDate == expiredDate
                ) {
                  return {
                    userCode: element.userCode,
                    fullName: element.fullName,
                    barcode: element.barcode,
                    productName: element.productName,
                    quantity: element.quantity + quantity,
                    expiredDate: element.expiredDate,
                  };
                } else {
                  return element;
                }
              } else {
                return element;
              }
            });
          } else {
            productTrackedList.push({
              userCode: payload.data.userCode,
              fullName: payload.data.fullName,
              barcode: productQuery.barcode,
              productName: productQuery.productName,
              quantity: quantity,
              expiredDate: expiredDate,
            });
          }
        }
        await taskDetailModel.findOneAndUpdate(
          {taskID},
          {productTracked: productTrackedList},
        );
        return res.status(200).json({
          status: true,
          statusCode: 200,
          msg: {
            en: `${productQuery.productName} has been updated successfully!`,
            vn: `${productQuery.productName} đã được cập nhật thành công.`,
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
  taskMarkDone: async (req, res, next) => {
    // #swagger.tags = ['Tasks']
    try {
      const taskID = req.params.taskID || null;
      const taskQuery = await taskModel.findOne({taskID});
      if (!taskQuery)
        return res.status(404).json({
          status: false,
          statusCode: 404,
          msg: {
            en: 'This task cannot be found or has been done, please contact admin!',
            vn: 'Không tìm thấy công việc này hoặc công việc đã được hoàn thành, vui lòng liên hệ quản trị viên!',
          },
        });
      await taskModel.findOneAndUpdate({taskID}, {isDone: true});
      return res.status(200).json({
        status: true,
        statusCode: 200,
        msg: {
          en: `"${taskQuery.taskName}" has been marked as done.`,
          vn: `"${taskQuery.taskName}" đã được đánh dấu là hoàn thành.`,
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
  taskUndoAction: async (req, res, next) => {
    // #swagger.tags = ['Tasks']
    try {
      const token = req.query.token || req.headers['x-access-token'];
      const taskID = req.params.taskID || null;
      const barcode = req.body.barcode ? req.body.barcode.toUpperCase() : null;
      const expiredDate = req.body.expiredDate || null;
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
        let productTrackedList =
          taskDetailQuery.productTracked.length > 0
            ? taskDetailQuery.productTracked
            : [];
        if (productTrackedList.length > 0) {
          productTrackedList.forEach((element, index) => {
            if (
              element.userCode == payload.data.userCode &&
              element.barcode == barcode &&
              element.expiredDate == expiredDate
            ) {
              productTrackedList.splice(index, 1);
            }
          });
        }
        await taskDetailModel.findOneAndUpdate(
          {taskID},
          {productTracked: productTrackedList},
        );
        return res.status(200).json({
          status: true,
          statusCode: 200,
          msg: {
            en: 'Successfully!',
            vn: 'Thành công!',
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
  taskExport: async function (req, res, next) {
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
    try {
      const dir = path.resolve(__dirname, '../', '../', 'tmp');
      const exportedFile = dir + '/tmp.xlsx';
      !fs.existsSync(dir) ? fs.mkdirSync(dir) : null;
      const worksheet = workbook.addWorksheet('Master');
      const titleStyle = workbook.createStyle({
        font: {color: '#000000', size: 12, bold: true},
      });
      const normalStyle = workbook.createStyle({
        font: {color: '#000000', size: 12},
      });
      worksheet.cell(1, 1).string('Barcode').style(titleStyle);
      worksheet.cell(1, 2).string('Usercode').style(titleStyle);
      worksheet.cell(1, 3).string('Fullname').style(titleStyle);
      worksheet.cell(1, 4).string('Product Name').style(titleStyle);
      worksheet.cell(1, 5).string('Expired date').style(titleStyle);
      worksheet.cell(1, 6).string('Quantity').style(titleStyle);
      worksheet.column(1).setWidth(30);
      worksheet.column(2).setWidth(30);
      worksheet.column(3).setWidth(30);
      worksheet.column(4).setWidth(80);
      worksheet.column(5).setWidth(20);
      worksheet.column(6).setWidth(20);
      if (taskDetailQuery.productTracked.length > 0) {
        taskDetailQuery.productTracked.forEach((product, index) => {
          worksheet
            .cell(index + 2, 1)
            .string(product.barcode.toString())
            .style(normalStyle);
          worksheet
            .cell(index + 2, 2)
            .string(product.userCode.toString())
            .style(normalStyle);
          worksheet
            .cell(index + 2, 3)
            .string(product.fullName.toString())
            .style(normalStyle);
          worksheet
            .cell(index + 2, 4)
            .string(product.productName.toString())
            .style(normalStyle);
          worksheet
            .cell(index + 2, 5)
            .string(product.expiredDate.toString())
            .style(normalStyle);
          worksheet
            .cell(index + 2, 6)
            .string(product.quantity.toString())
            .style(normalStyle);
        });
      } else {
        worksheet.cell(2, 1).string('No items').style(normalStyle);
      }

      workbook.write(exportedFile, (err, stats) => {
        if (!err) {
          var filename = path.basename(exportedFile);
          var mimetype = mime.lookup(exportedFile);
          res.setHeader(
            'Content-disposition',
            'attachment; filename=' + filename,
          );
          res.setHeader('Content-type', mimetype);
          var filestream = fs.createReadStream(exportedFile);
          filestream.pipe(res);
        } else {
          res.end('An error occured, please refesh this page!');
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        statusCode: 500,
        msg: {en: 'Interal Server Error'},
        error: error.message,
      });
    }
  },
};
