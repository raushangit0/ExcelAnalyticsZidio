const mongoose = require('mongoose');

const analysisHistorySchema = new mongoose.Schema({
  fileName: String,
  chartType: String,
  xAxis: String,
  yAxis: String,
  chartConfigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChartConfig',
  },
  excelFileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExcelFile',
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
  aiInsights: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('AnalysisHistory', analysisHistorySchema);