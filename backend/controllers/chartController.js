const ChartConfig = require('../models/ChartConfig');
const AnalysisHistory = require('../models/AnalysisHistory');
const ExcelFile = require('../models/ExcelFile');
const User = require('../models/User');
const { generateAIInsights } = require('../utils/aiService');

// @desc    Create chart configuration
// @route   POST /api/charts
// @access  Private
exports.createChart = async (req, res) => {
  try {
    const { title, type, xAxis, yAxis, excelFileId, chartData } = req.body;

    // Verify file exists and user owns it
    const file = await ExcelFile.findById(excelFileId);
    if (!file) {
      return res.status(404).json({ message: 'Excel file not found' });
    }

    if (file.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create chart config
    const chartConfig = await ChartConfig.create({
      title,
      type,
      xAxis,
      yAxis,
      excelFileId,
      userId: req.user.id,
      chartData,
    });

    // Create analysis history
    const history = await AnalysisHistory.create({
      fileName: file.originalName,
      chartType: type,
      xAxis,
      yAxis,
      chartConfigId: chartConfig._id,
      excelFileId: file._id,
      userId: req.user.id,
    });

    // Update user chart count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { chartCount: 1 },
    });

    // Generate AI insights (optional, async)
    if (process.env.OPENAI_API_KEY) {
      generateAIInsights(chartData, chartConfig)
        .then(insights => {
          history.aiInsights = insights;
          return history.save();
        })
        .catch(console.error);
    }

    res.status(201).json({
      success: true,
      data: chartConfig,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chart by ID
// @route   GET /api/charts/:id
// @access  Private
exports.getChart = async (req, res) => {
  try {
    const chart = await ChartConfig.findById(req.params.id)
      .populate('excelFileId', 'originalName headers');

    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }

    // Check ownership
    if (chart.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: chart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's charts
// @route   GET /api/charts
// @access  Private
exports.getUserCharts = async (req, res) => {
  try {
    const charts = await ChartConfig.find({ userId: req.user.id })
      .populate('excelFileId', 'originalName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: charts.length,
      data: charts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update chart download count
// @route   PUT /api/charts/:id/download
// @access  Private
exports.incrementDownload = async (req, res) => {
  try {
    const chart = await ChartConfig.findById(req.params.id);

    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }

    chart.downloadCount += 1;
    await chart.save();

    // Also update history
    await AnalysisHistory.findOneAndUpdate(
      { chartConfigId: chart._id },
      { $inc: { downloadCount: 1 } }
    );

    res.json({
      success: true,
      downloadCount: chart.downloadCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete chart
// @route   DELETE /api/charts/:id
// @access  Private
exports.deleteChart = async (req, res) => {
  try {
    const chart = await ChartConfig.findById(req.params.id);

    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }

    // Check ownership
    if (chart.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await chart.deleteOne();

    // Delete associated history
    await AnalysisHistory.deleteMany({ chartConfigId: chart._id });

    res.json({
      success: true,
      message: 'Chart deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analysis history
// @route   GET /api/charts/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const history = await AnalysisHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};