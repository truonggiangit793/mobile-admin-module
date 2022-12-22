const xlsxFile = require('read-excel-file/node');
const path = require('path');
const mime = require('mime');
const excel = require('excel4node');
const fs = require('fs');
const workbook = new excel.Workbook();
const worksheet = workbook.addWorksheet('Sheet');

const productModel = require('../../models/product');

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
  productImport: async (req, res, next) => {
    /*
            #swagger.tags = ['Products']
            #swagger.description = 'Admin can user this endpoint for importing list of products to database instead of register for each one.'
            #swagger.consumes = ['multipart/form-data']  
            #swagger.parameters['file'] = {
                in: 'formData',
                type: 'file',
                required: 'true',
                description: 'Upload excel file data. Only excel format is allowed.',
            } 
        */
    try {
      const rows = await xlsxFile(req.file.path);
      if (
        rows[0][0].toUpperCase() !== 'BARCODE' ||
        rows[0][1].toUpperCase() !== 'PRODUCT NAME'
      )
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Invalid format excel file.',
            vn: 'Tập tin excel không đúng cấu trúc.',
          },
        });

      rows.forEach(async (element, index) => {
        if (index > 0) {
          await productModel.findOneAndUpdate(
            {barcode: element[0].toUpperCase()},
            {
              barcode: element[0].toUpperCase(),
              productName: element[1].toUpperCase(),
            },
            {upsert: true, new: true, setDefaultsOnInsert: true},
          );
        }
      });
      return res.status(200).json({
        status: true,
        statusCode: 200,
        msg: {
          en: 'All products has been import successfully!',
          vn: 'Đã nhập danh sách sản phẩm thành công!',
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
  productRegister: async (req, res, next) => {
    // #swagger.tags = ['Products']
    // #swagger.description = 'This endpoint provides method for registering each of product.'
    try {
      const barcode = req.body.barcode ? req.body.barcode.toUpperCase() : null;
      const productName = req.body.productName
        ? req.body.productName.toUpperCase()
        : null;
      const productQuery = await productModel.findOne({barcode});
      if (!barcode)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Barcode is required!',
            vn: 'Mã vạch sản phẩm là bắt buộc.',
          },
        });
      if (!productName)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Product name is required!',
            vn: 'Tên sản phẩm là bắt buộc.',
          },
        });
      if (productQuery)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'This product barcode has been existed!',
            vn: `Mã vạch "${barcode}" của sản phẩm "${productName}" đã tồn tại.`,
          },
        });
      const product = new productModel({barcode, productName});
      product.save();
      return res.status(200).json({
        status: true,
        statusCode: 200,
        msg: {
          en: `The "${barcode}" has been registered successfully!`,
          vn: `Mã vạch sản phẩm "${barcode}" đã được tạo thành công.`,
        },
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
  productGetDetail: async (req, res, next) => {
    // #swagger.tags = ['Products']
    // #swagger.description = 'Admin can show the detail of any products by using this endpoint.'
    try {
      const barcode = req.query.barcode
        ? req.query.barcode.toUpperCase()
        : null;
      const productQuery = await productModel.findOne({barcode});
      if (!barcode)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Barcode is required!',
            vn: 'Mã vạch sản phẩm là bắt buộc.',
          },
        });
      if (productQuery) {
        return res.status(200).json({
          status: true,
          statusCode: 200,
          msg: {
            en: `Detail of product "${productQuery.productName}"`,
            vn: `Thông tin chi tiết của sản phẩm "${productQuery.productName}"`,
          },
          result: {
            data: productQuery,
          },
        });
      } else {
        return res.status(404).json({
          status: false,
          statusCode: 404,
          msg: {
            en: `Product barcode "${barcode}" not found or has been removed, contact developer for more detail!`,
            vn: `Không tìm thấy mã vạch sản phẩm "${barcode}", hoặc đã bị gỡ bỏ, vui lòng liên hệ quản trị viên.`,
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
  productGetAll: async (req, res, next) => {
    // #swagger.tags = ['Products']
    // #swagger.description = 'Admin can list of all products by using this endpoint.'
    try {
      const perPageMaxSize = 50;
      let perPage = parseInt(req.query.perPage)
        ? parseInt(req.query.perPage) >= perPageMaxSize
          ? perPageMaxSize
          : parseInt(req.query.perPage)
        : perPageMaxSize;
      let page = parseInt(req.query.page) || 1;
      productModel
        .find({})
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec((err, productList) => {
          productModel.countDocuments((err, totalProducts) => {
            if (err) return next(err);
            const pageTotal = Math.ceil(totalProducts / perPage);
            if (productList.length > 0) {
              return res.status(200).json({
                status: true,
                statusCode: 200,
                msg: {
                  en: 'Get list of all products.',
                  vn: 'Danh sách tất cả sản phẩm.',
                },
                currentPage: page,
                pageTotal,
                totalProducts,
                result: {
                  perPage: productList.length,
                  data: productList,
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
  productDelete: async (req, res, next) => {
    // #swagger.tags = ['Products']
    // #swagger.description = 'Admin can remove any products through this endpoint.'
    console.log(req.params);
    try {
      const barcode = req.params.barcode
        ? req.params.barcode.toUpperCase()
        : null;
      const productQuery = await productModel.findOne({barcode});
      if (!barcode)
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Barcode is required!',
            vn: 'Mã vạch sản phẩm là bắt buộc.',
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
      await productModel.deleteOne({barcode});
      return res.status(200).json({
        status: true,
        statusCode: 200,
        msg: {
          en: `Product barcode "${barcode}" has been removed successfully!`,
          vn: `Mã vạch sản phẩm "${barcode}" đã được gỡ bỏ thành công.`,
        },
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
  productDownloadExample: async (req, res, next) => {
    // #swagger.tags = ['Products']
    // #swagger.description = 'Render and dowload the example excel file for importing products.'
    worksheet.cell(1, 1).string('Barcode').style(titleStyle);
    worksheet.cell(1, 2).string('Product Name').style(titleStyle);
    pipFileStream(res);
  },
};
