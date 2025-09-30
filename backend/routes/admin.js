const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  deleteUser,
  getStats,
  getUsage,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.use(protect);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);
router.get('/usage', getUsage);

module.exports = router;