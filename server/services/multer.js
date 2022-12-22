const multer = require('multer');
const path = require('path');
const fs = require('fs');

module.exports = function (req, res, next) {
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, res, callback) => {
        const dir = path.resolve(__dirname, '../', 'tmp');
        !fs.existsSync(dir) ? fs.mkdirSync(dir) : null;
        callback(null, dir);
      },
      filename: (req, file, callback) => {
        callback(null, `tmp.${file.originalname.split('.')[1]}`);
      },
    }),
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, callback) => {
      if (
        file.mimetype ==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        callback(null, true);
      } else {
        callback(null, false);
        const err = new Error('Extension Error');
        err.message = {
          en: 'Only accept *.xlsx file!',
          vn: 'Chỉ cho phép định dạng file excel.',
        };
        return callback(err);
      }
    },
  }).single('file');

  upload(req, res, err => {
    if (err) {
      return res
        .status(500)
        .json({status: false, statusCode: 500, msg: err.message});
    } else {
      const fileUpload = req.file || null;
      if (!fileUpload) {
        return res.status(200).json({
          status: false,
          statusCode: 200,
          msg: {
            en: 'Excel file is required.',
            vn: 'Vui lòng tải lên tập tin Excel.',
          },
        });
      }
      return next();
    }
  });
};
