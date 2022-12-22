const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const taskDetailSchema = new mongoose.Schema(
  {
    taskID: {
      type: String,
      required: true,
      unique: true,
    },
    productTracked: {
      type: Object,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

taskDetailSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('TaskDetail', taskDetailSchema);
