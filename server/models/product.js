const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const productSchema = new mongoose.Schema(
  {
    barcode: {
      type: String,
      required: true,
      unique: true,
    },
    productName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('Product', productSchema);
