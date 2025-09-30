const User = require('../models/User');
const ExcelFile = require('../models/ExcelFile');
const ChartConfig = require('../models/ChartConfig');
const AnalysisHistory = require('../models/AnalysisHistory');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { role, status } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all user's data
    await ExcelFile.deleteMany({ userId: user._id });
    await ChartConfig.deleteMany({ userId: user._id });
    await AnalysisHistory.deleteMany({ userId: user._id });
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User and all associated data deleted',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const totalFiles = await ExcelFile.countDocuments();
    const totalCharts = await ChartConfig.countDocuments();
    const totalDownloads = await ChartConfig.aggregate([
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          admins: await User.countDocuments({ role: 'admin' }),
        },
        files: totalFiles,
        charts: totalCharts,
        downloads: totalDownloads[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get data usage
// @route   GET /api/admin/usage
// @access  Private/Admin
exports.getUsage = async (req, res) => {
  try {
    const fileStats = await ExcelFile.aggregate([
      {
        $group: {
          _id: null,
          totalSize: { $sum: '$fileSize' },
          avgSize: { $avg: '$fileSize' },
        }
      }
    ]);

    const recentActivity = await AnalysisHistory.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email');

    res.json({
      success: true,
      data: {
        storage: fileStats[0] || { totalSize: 0, avgSize: 0 },
        recentActivity,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};