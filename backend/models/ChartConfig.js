const mongoose = require('mongoose');

const chartConfigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['bar', 'line', 'pie', 'scatter', 'doughnut', '3d-column'],
    required: true,
  },
  xAxis: {
    type: String,
    required: true,
  },
  yAxis: {
    type: String,
    required: true,
  },
  excelFileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExcelFile',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  chartData: {
    labels: [String],
    values: [Number],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ChartConfig', chartConfigSchema);