const express = require('express');
const router = express.Router();
const {
  createChart,
  getChart,
  getUserCharts,
  incrementDownload,
  deleteChart,
  getHistory,
} = require('../controllers/chartController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createChart);
router.get('/', protect, getUserCharts);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getChart);
router.put('/:id/download', protect, incrementDownload);
router.delete('/:id', protect, deleteChart);

module.exports = router;