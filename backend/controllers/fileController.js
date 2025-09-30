const ExcelFile = require('../models/ExcelFile');
const { parseExcelFile } = require('../utils/excelParser');
const fs = require('fs').promises;

// @desc    Upload Excel file
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Parse the Excel file
    const parsedData = parseExcelFile(req.file.path);

    // Create file record
    const excelFile = await ExcelFile.create({
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      headers: parsedData.headers,
      rowCount: parsedData.rowCount,
      columnCount: parsedData.columnCount,
      parsedData: parsedData.data,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: {
        id: excelFile._id,
        fileName: excelFile.originalName,
        headers: excelFile.headers,
        rowCount: excelFile.rowCount,
        columnCount: excelFile.columnCount,
        uploadedAt: excelFile.createdAt,
      },
    });
  } catch (error) {
    // Clean up file if there was an error
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get file data
// @route   GET /api/files/:id
// @access  Private
exports.getFile = async (req, res) => {
  try {
    const file = await ExcelFile.findById(req.params.id).select('+parsedData');

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check ownership
    if (file.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: {
        id: file._id,
        fileName: file.originalName,
        headers: file.headers,
        data: file.parsedData,
        uploadedAt: file.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's files
// @route   GET /api/files
// @access  Private
exports.getUserFiles = async (req, res) => {
  try {
    const files = await ExcelFile.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-parsedData');

    res.json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
exports.deleteFile = async (req, res) => {
  try {
    const file = await ExcelFile.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check ownership
    if (file.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete physical file
    await fs.unlink(file.filePath).catch(console.error);

    // Delete record
    await file.deleteOne();

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};