const express = require('express');
const router = express.Router();
const {
  uploadFile,
  getFile,
  getUserFiles,
  deleteFile,
} = require('../controllers/fileController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/', protect, getUserFiles);
router.get('/:id', protect, getFile);
router.delete('/:id', protect, deleteFile);

module.exports = router;