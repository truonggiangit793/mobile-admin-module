const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const taskSchema = new mongoose.Schema(
  {
    taskID: {
      type: String,
      required: true,
      unique: true,
    },
    taskName: {
      type: String,
      required: true,
      unique: true,
    },
    memberList: {
      type: Object,
      default: [],
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('Task', taskSchema);
