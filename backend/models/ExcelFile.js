const mongoose = require('mongoose');

const excelFileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  cloudinaryUrl: String,
  fileSize: Number,
  headers: [String],
  rowCount: Number,
  columnCount: Number,
  parsedData: {
    type: mongoose.Schema.Types.Mixed,
    select: false, // Don't include by default due to size
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ExcelFile', excelFileSchema);